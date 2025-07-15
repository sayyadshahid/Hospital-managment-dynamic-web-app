#  name: str = Field(..., description='name')
#     phone:  str = Field(..., min_length=10, max_length=15, description ="User's phone number")
#     email: EmailStr = Field(..., description="user's email address")
#     dob: date = Field(..., description='date of birth')
#     gender: Literal["Male", "Female"] = Field(..., description="Gender")
#     address: str = Field(..., description="Address", min_length=5)
#     reasonForConsultation: str = Field(..., description="Reason for consultation", min_length=5)
#     is_active: bool = Field(default=True)
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: datetime = Field(default_factory=datetime.utcnow)
#     is_success: bool = Field(default=False)
#     schedule_date: date = Field(..., description='Schedule date')
#     schedule_time: str = Field(..., description='Schedule time')
    
    
def get_all_appointments_pipeline():
    pipeline = [
        {
            '$project': {
                '_id': 0,
                'id': {'$toString': '$_id'},
                'phone':1,
                'email':1,
                'dob':1,
                'gender':1,
                'address':1,
                'reasonForConsultation':1,
                'is_active':1,
                'created_at':1,
                'updated_at':1,
                'is_success':1,
                'schedule_date':1,
                'schedule_time':1,
                'name': 1,
                
            }
        }
    ]
    
    return pipeline


#   {
#                 "$match": {
#                     "user_id": userId
#                 }
#             },


def get_all_appointments_by_userId_pipeline(userId):
    pipeline = [
        {
                "$match": {
                    "user_id": userId
                }
            },
        {
            '$project': {
                '_id': 0,
                'id': {'$toString': '$_id'},
                'phone':1,
                'email':1,
                'dob':1,
                'gender':1,
                'address':1,
                'reasonForConsultation':1,
                'is_active':1,
                'created_at':1,
                'updated_at':1,
                'is_success':1,
                'schedule_date':1,
                'schedule_time':1,
                'name': 1,
            }
        }
    ]
    
    return pipeline