from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
import os

# Load .env
load_dotenv()

print("CURRENT API KEY =", os.getenv("GEMINI_API_KEY"))

# FastAPI App
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

# MongoDB
mongo_uri = os.getenv("MONGODB_URI")

mongo_client = MongoClient(mongo_uri)

db = mongo_client["ai_testcase_generator"]

collection = db["testcases"]


# Request Model
class RequirementRequest(BaseModel):
    requirement: str


# Home Route
@app.get("/")
def home():
    return {
        "message": "AI Test Case Generator Backend Running"
    }


# Generate Test Cases From Text
@app.post("/generate-testcases")
def generate_testcases(data: RequirementRequest):
    try:

        # CACHE CHECK
        existing = collection.find_one(
            {"requirement": data.requirement},
            {"_id": 0}
        )

        if existing:
            return {
                "source": "cache",
                "requirement": existing["requirement"],
                "test_cases": existing["test_cases"]
            }

        prompt = f"""
Generate software test cases for:

{data.requirement}

Create the output in the following categories:

1. Functional Test Cases (minimum 3)

2. Negative Test Cases (minimum 2)

3. Boundary Test Cases (minimum 2)

4. Security Test Cases (minimum 2)

For every test case include:

- Test Case ID
- Test Case Description
- Preconditions
- Steps
- Expected Result
- Priority (High/Medium/Low)

Format the response clearly with headings for each category.
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt
        )

        generated_testcases = response.text

        collection.insert_one({
            "requirement": data.requirement,
            "test_cases": generated_testcases,
            "created_at": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        })

        return {
            "source": "ai",
            "requirement": data.requirement,
            "test_cases": generated_testcases
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# Upload TXT Requirement File
@app.post("/upload-requirement")
async def upload_requirement(file: UploadFile = File(...)):
    try:

        content = await file.read()

        requirement_text = content.decode("utf-8")

        # CACHE CHECK
        existing = collection.find_one(
            {"requirement": requirement_text},
            {"_id": 0}
        )

        if existing:
            return {
                "source": "cache",
                "requirement": existing["requirement"],
                "test_cases": existing["test_cases"]
            }

        prompt = f"""
Generate software test cases for:

{requirement_text}

Create the output in the following categories:

1. Functional Test Cases (minimum 3)

2. Negative Test Cases (minimum 2)

3. Boundary Test Cases (minimum 2)

4. Security Test Cases (minimum 2)

For every test case include:

- Test Case ID
- Test Case Description
- Preconditions
- Steps
- Expected Result
- Priority (High/Medium/Low)

Format the response clearly with headings for each category.
"""

        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=prompt
        )

        generated_testcases = response.text

        collection.insert_one({
            "requirement": requirement_text,
            "test_cases": generated_testcases,
            "created_at": datetime.now().strftime("%d-%m-%Y %H:%M:%S")
        })

        return {
            "source": "ai",
            "requirement": requirement_text,
            "test_cases": generated_testcases
        }

    except Exception as e:
        return {
            "error": str(e)
        }


# Get History
@app.get("/history")
def get_history():

    history = []

    for item in collection.find({}, {"_id": 0}):
        history.append(item)

    return history


# Delete History
@app.delete("/history")
def delete_history():

    collection.delete_many({})

    return {
        "message": "All history deleted successfully"
    }