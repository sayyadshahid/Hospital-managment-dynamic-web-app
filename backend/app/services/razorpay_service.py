import razorpay
import os
from dotenv import load_dotenv

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_T4yJxr1uNxGng1")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "2ZrtB75KvVuT1tNhqb5N0n6n")


def create_payment_order(amount: int, currency: str = "INR"):
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    data = {"amount": amount, "currency": currency, "payment_capture": 1}
    order = client.order.create(data=data)
    return order


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
    params = {
        "razorpay_order_id": order_id,
        "razorpay_payment_id": payment_id,
        "razorpay_signature": signature,
    }
    try:
        client.utility.verify_payment_signature(params)
        return True
    except razorpay.errors.SignatureVerificationError:
        return False
