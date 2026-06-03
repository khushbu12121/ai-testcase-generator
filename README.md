
# AI Test Case Generator

AI-powered web application that automatically generates software test cases from user requirements.

## Features

- Generate test cases from text requirements
- Upload requirement files (.txt)
- AI-powered test case generation using Gemini API
- MongoDB history storage
- View previously generated test cases
- Download test cases as PDF
- Copy test cases to clipboard
- Cache repeated requests

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript

### Backend
- FastAPI
- Python

### Database
- MongoDB Atlas

### AI Integration
- Google Gemini API

## Project Structure

```text
app/
components/
services/
backend/
├── main.py
├── requirements.txt
```

## API Endpoints

### Generate Test Cases
POST /generate-testcases

### Upload Requirement File
POST /upload-requirement

### Get History
GET /history

### Delete History
DELETE /history

## Future Improvements

- User Authentication
- Excel Export
- Advanced Test Categorization
- Multi-model AI Support

## Author

Khushbu Bansal
