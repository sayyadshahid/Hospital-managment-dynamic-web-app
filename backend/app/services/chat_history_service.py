"""Persistent chat history for the AI assistant (per user, per conversation)."""
from datetime import datetime
from typing import List, Optional

from bson import ObjectId

from app.constant.constants import DbCollections
from app.database import get_database


def _make_title(text: str) -> str:
    title = " ".join((text or "").split())
    if not title:
        return "New chat"
    trimmed = title[:60]
    return trimmed + "..." if title != trimmed else trimmed


def _to_public(conv: dict) -> dict:
    messages = conv.get("messages", [])
    preview = ""
    for message in reversed(messages):
        if message.get("role") == "user" and message.get("content"):
            preview = str(message["content"])[:140]
            break
    return {
        "conversation_id": str(conv["_id"]),
        "title": conv.get("title", "New chat"),
        "created_at": conv.get("created_at"),
        "updated_at": conv.get("updated_at"),
        "preview": preview,
        "message_count": len(messages),
    }


async def list_conversations(user_id: str) -> List[dict]:
    collection = get_database()[DbCollections.AI_CONVERSATIONS_COLLECTION]
    conversations = []
    async for conv in collection.find({"user_id": user_id}).sort("updated_at", -1):
        conversations.append(_to_public(conv))
    return conversations


async def get_conversation(user_id: str, conversation_id: str) -> Optional[dict]:
    if not ObjectId.is_valid(conversation_id):
        return None
    collection = get_database()[DbCollections.AI_CONVERSATIONS_COLLECTION]
    conv = await collection.find_one({"_id": ObjectId(conversation_id), "user_id": user_id})
    if not conv:
        return None
    return {
        "conversation_id": str(conv["_id"]),
        "title": conv.get("title", "New chat"),
        "messages": conv.get("messages", []),
    }


async def delete_conversation(user_id: str, conversation_id: str) -> bool:
    if not ObjectId.is_valid(conversation_id):
        return False
    collection = get_database()[DbCollections.AI_CONVERSATIONS_COLLECTION]
    result = await collection.delete_one({"_id": ObjectId(conversation_id), "user_id": user_id})
    return result.deleted_count > 0


async def append_turn(user_id: str, conversation_id: str,
                      question: str, answer: str) -> bool:
    if not ObjectId.is_valid(conversation_id):
        return False
    collection = get_database()[DbCollections.AI_CONVERSATIONS_COLLECTION]
    now = datetime.utcnow()
    result = await collection.update_one(
        {"_id": ObjectId(conversation_id), "user_id": user_id},
        {"$push": {"messages": {
            "$each": [
                {"role": "user", "content": question},
                {"role": "assistant", "content": answer or ""},
            ]
        }},
         "$set": {"updated_at": now}},
    )
    return result.modified_count > 0 or result.matched_count > 0


async def append_turn_and_maybe_create(user_id: str, conversation_id: Optional[str],
                                       question: str, answer: str) -> str:
    """Append to an existing conversation, or create a new one. Returns the id."""
    if conversation_id:
        if await append_turn(user_id, conversation_id, question, answer):
            return conversation_id
    collection = get_database()[DbCollections.AI_CONVERSATIONS_COLLECTION]
    now = datetime.utcnow()
    inserted = await collection.insert_one({
        "user_id": user_id,
        "title": _make_title(question),
        "messages": [
            {"role": "user", "content": question},
            {"role": "assistant", "content": answer or ""},
        ],
        "created_at": now,
        "updated_at": now,
    })
    return str(inserted.inserted_id)