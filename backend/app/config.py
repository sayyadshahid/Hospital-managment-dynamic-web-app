# import os
# from dotenv import load_dotenv
# from pathlib import Path
# import sys

# try:
#     dotenv_path = Path('.env')
#     if not dotenv_path.exists():
#         raise FileNotFoundError(".env file not found")

#     load_dotenv(dotenv_path=dotenv_path)
#     ITSM_URL = os.getenv("ITSM_URL")
#     ITSM_TOKEN = os.getenv("ITSM_TOKEN")
#     MONGO_DB_URL = os.getenv("MONGO_DB_URL")
#     DATABASE_NAME = os.getenv("DATABASE_NAME")
#     OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
#     DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
#     SECRET_KEY = os.getenv("SECRET_KEY")
#     ALGORITHM = os.getenv("ALGORITHM")
   
#     TWILIO_SID=os.getenv("TWILIO_SID")
#     TWILIO_AUTH_TOKEN=os.getenv("TWILIO_AUTH_TOKEN")
#     VERIFY_SERVICE_SID=os.getenv("VERIFY_SERVICE_SID")


#     if not all([MONGO_DB_URL, DATABASE_NAME, OPENAI_API_KEY, SECRET_KEY, ALGORITHM]):
#         print("---------------------One or more environment variables are missing--------------------------")
#         sys.exit(1)

# except FileNotFoundError as e:
#     print(f"------Error: {e}")
#     sys.exit(1)
# except ValueError as e:
#     print(f"------Error: {e}")
#     sys.exit(1)
# except Exception as e:
#     print(f"---------------Unexpected error: {e}")
#     sys.exit(1)
 