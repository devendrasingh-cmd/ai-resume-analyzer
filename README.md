# 🚀 AI Resume Analyzer

### Smart Resume Analysis | MERN Stack | Docker | GitHub Actions

An AI-powered resume analysis web application designed to help users evaluate their resumes and improve their job application readiness.

---

## ✨ Key Features

- 🔐 User Authentication
- 📄 Resume Upload
- 🤖 Resume Analysis Workflow
- ⚡ REST API Integration
- 🗄️ MongoDB Database
- 🐳 Docker Containerization
- 🔄 GitHub Actions CI/CD Workflow
- 📦 Docker Image Build and Publishing Configuration

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| DevOps | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |

## 📂 Project Structure

```text
ai-resume-analyzer/
├── .github/
│   └── workflows/
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Docker Desktop
- MongoDB connection

### Clone Repository

```bash
git clone https://github.com/devendrasingh-cmd/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### Run with Docker

```bash
docker compose build
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

## 🔄 DevOps Workflow

The project includes configuration for automating application build and container image publishing through GitHub Actions.

1. Push code to the `main` branch.
2. Install frontend and backend dependencies.
3. Build the frontend application.
4. Build Docker images.
5. Authenticate with GitHub Container Registry.
6. Push container images when the workflow conditions are met.

**Current Status:** Dockerfiles, Docker Compose, and CI/CD workflow configuration are present. Successful pipeline execution and image publishing are pending verification.

## 🔒 Security Practices

- Environment variables for sensitive configuration
- `.gitignore` for excluding local and secret files
- Docker image build configuration
- GitHub Actions permissions
- Dependency management and updates

## 🗺️ Future Improvements

- Enhanced AI-powered resume scoring
- Job description matching
- Skill-gap analysis
- Automated testing
- Cloud deployment
- Application monitoring and logging

---

### 👨‍💻 Project

**AI Resume Analyzer** — Building practical tools for smarter resume evaluation.

