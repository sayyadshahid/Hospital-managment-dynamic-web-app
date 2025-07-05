def get_all_reviews_with_user_pipeline(hospital_id: str):
    pipeline = [
        {
            "$match": {
                "hospital_id": hospital_id
            }
        },
        {
            "$lookup": {
                "from": "doctors",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "doctor_info"
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user_info"
            }
        },
        {
            "$addFields": {
                "reviewer": {
                    "$cond": {
                        "if": {"$gt": [{"$size": "$doctor_info"}, 0]},
                        "then": {"$arrayElemAt": ["$doctor_info", 0]},
                        "else": {"$arrayElemAt": ["$user_info", 0]}
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "hospital_id": 1,
                "user_id": 1,
                "rating": 1,
                "review_text": 1,
                "created_at": 1,
                "user": {
                    "fullname": "$reviewer.fullname",
                    "email": "$reviewer.email",
                    "phone_no": "$reviewer.phone_no",
                    "role": {
                        "$cond": {
                            "if": {"$gt": [{"$size": "$doctor_info"}, 0]},
                            "then": "doctor",
                            "else": "user"
                        }
                    }
                }
            }
        }
    ]
    return pipeline


def get_all_reviews_with_user_pipeline():
    pipeline = [
         
        {
            "$lookup": {
                "from": "doctors",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "doctor_info"
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user_info"
            }
        },
        {
            "$addFields": {
                "reviewer": {
                    "$cond": {
                        "if": {"$gt": [{"$size": "$doctor_info"}, 0]},
                        "then": {"$arrayElemAt": ["$doctor_info", 0]},
                        "else": {"$arrayElemAt": ["$user_info", 0]}
                    }
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "id": {"$toString": "$_id"},
                "hospital_id": 1,
                "user_id": 1,
                "rating": 1,
                "review_text": 1,
                "created_at": 1,
                "user": {
                    "fullname": "$reviewer.fullname",
                    "email": "$reviewer.email",
                    "phone_no": "$reviewer.phone_no",
                    "role": {
                        "$cond": {
                            "if": {"$gt": [{"$size": "$doctor_info"}, 0]},
                            "then": "doctor",
                            "else": "user"
                        }
                    }
                }
            }
        }
    ]
    return pipeline

