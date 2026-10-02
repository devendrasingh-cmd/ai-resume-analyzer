# AI Resume Analyzer

A full-stack Resume Analysis application built with the MERN stack.

## Features

- User Registration and Login
- JWT Authentication
- Resume Upload
- PDF, DOC and DOCX support
- Maximum 5 MB file validation
- Resume text extraction
- ATS Score calculation
- Job Description based keyword matching
- Matched and Missing Keywords
- Resume section analysis
- Resume improvement suggestions
- Analysis History
- View Previous Analysis
- Delete Analysis
- Dashboard Statistics
- MongoDB data storage
- Protected API routes
- Helmet security
- Rate limiting

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- PDF Parser
- Helmet
- Express Rate Limit

## Project Structure

```text
AI Project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    ├── .gitignore
    └── package.json