# 🤖 AI Recruitment Calling Assistant #
<p align="center"> <img src="assets/banner.png" alt="AI Recruitment Calling Assistant Banner" width="100%"> </p> <p align="center"> <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express"> <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql"> <img src="https://img.shields.io/badge/OpenAI-LLM-412991?style=for-the-badge&logo=openai"> <img src="https://img.shields.io/badge/Twilio-Voice-F22F46?style=for-the-badge&logo=twilio"> <img src="https://img.shields.io/badge/AssemblyAI-Speech%20to%20Text-FF6B00?style=for-the-badge"> <img src="https://img.shields.io/badge/ElevenLabs-AI%20Voice-000000?style=for-the-badge"> <img src="https://img.shields.io/badge/Google%20Calendar-Integration-4285F4?style=for-the-badge&logo=googlecalendar"> <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge"> <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge"> </p> <p align="center">

<b>An Enterprise-Grade AI Voice Recruitment Platform that automates candidate screening using conversational AI, Large Language Models, Speech Intelligence, and ATS integrations.</b>

</p> <p align="center">

Automate recruitment calls • Screen candidates • Extract hiring insights • Schedule interviews • Sync with ATS

</p>
🌟 Overview

Hiring teams spend countless hours conducting repetitive first-round screening calls. Recruiters ask the same questions, manually record responses, verify candidate details, update ATS systems, and coordinate interview schedules.

AI Recruitment Calling Assistant automates this entire workflow.

Instead of recruiters making repetitive calls, an AI-powered voice assistant contacts candidates, conducts intelligent conversations, extracts structured hiring information, answers common questions, schedules interviews, and synchronizes every interaction with recruitment systems automatically. The project specification describes this end-to-end workflow from outbound AI calling through interview scheduling and ATS synchronization.

This platform combines modern conversational AI, speech recognition, natural language understanding, and cloud-based telephony to deliver a scalable recruitment automation solution.

🚀 Key Highlights

✅ Production-Ready REST API

✅ AI Voice Calling

✅ Real-Time Speech Recognition

✅ Large Language Model Integration

✅ PostgreSQL Database

✅ ATS Integration

✅ Google Calendar Scheduling

✅ JWT Authentication

✅ Secure API Architecture

✅ Call Recording

✅ Conversation Transcripts

✅ Candidate Analytics

✅ Structured Data Extraction

✅ Environment Variable Configuration

✅ Production Deployment

✨ Features
📞 AI Voice Recruitment Calls

The assistant automatically places outbound recruitment calls using AI-generated speech.

Features include

Dynamic voice conversations
Human-like interactions
Personalized greetings
Job explanation
Candidate verification
Call recording
🎤 Intelligent Speech Recognition

Candidate responses are converted into text using automatic speech recognition.

Capabilities include

Speech-to-text conversion
Accurate transcript generation
Multi-response capture
Conversation recording
🧠 Large Language Model Processing

The assistant understands natural conversations instead of relying on keyword matching.

The AI automatically extracts

Current Salary
Expected Salary
Notice Period
Preferred Location
Skills
Experience
Employment Type
Candidate Interest
Interview Availability
📅 Automated Interview Scheduling

Qualified candidates can be scheduled directly through Google Calendar integration.

Features

Calendar availability checking
Interview creation
Recruiter notification
Candidate confirmation
Calendar synchronization
🏢 ATS Synchronization

The assistant communicates directly with recruitment platforms.

Supported integrations

Greenhouse
Zoho Recruit
Lever

Candidate information stays synchronized automatically throughout the recruitment workflow.

📊 Recruiter Dashboard

Recruiters can

Monitor live calls
View candidate responses
Read transcripts
Download reports
Review analytics
Schedule interviews
Track recruitment progress
🎯 Business Problem

Traditional recruitment involves repetitive manual work.

Recruiters spend hours

Calling candidates
Explaining job roles
Asking repetitive questions
Writing notes
Updating ATS
Scheduling interviews
Following up

This project automates those repetitive tasks while maintaining a conversational and personalized experience.

💡 Solution

The AI assistant performs the complete recruitment workflow automatically.

Recruiter

      │

      ▼

Fetch Candidates from ATS

      │

      ▼

AI Places Phone Call

      │

      ▼

Natural Conversation

      │

      ▼

Speech Recognition

      │

      ▼

LLM Understanding

      │

      ▼

Structured Candidate Data

      │

      ▼

Database Storage

      │

      ▼

Interview Scheduling

      │

      ▼

ATS Synchronization


🏗️ System Architecture

graph LR

A[Recruiter Dashboard]

B[Express API]

C[PostgreSQL]

D[Twilio]

E[ElevenLabs]

F[AssemblyAI]

G[OpenAI]

H[Google Calendar]

I[Greenhouse ATS]

A --> B

B --> C

B --> D

B --> E

B --> F

B --> G

B --> H

B --> I

The implementation uses an Express.js backend connected to PostgreSQL and integrates Twilio, ElevenLabs, AssemblyAI, OpenAI, Google Calendar, and Greenhouse to support the recruitment workflow.

🔄 Complete AI Workflow

graph TD

A[Fetch Candidate]

-->

B[Initiate AI Call]

-->

C[Generate Voice]

-->

D[Candidate Conversation]

-->

E[Speech Recognition]

-->

F[LLM Analysis]

-->

G[Extract Candidate Information]

-->

H[Store in PostgreSQL]

-->

I[Schedule Interview]

-->

J[Sync ATS]

🧠 AI Pipeline

Candidate Speaks

        │

        ▼

Speech Recording

        │

        ▼

AssemblyAI

        │

        ▼

Transcript

        │

        ▼

OpenAI LLM

        │

        ▼

Information Extraction

        │

 ┌──────┼──────────────┐

 ▼      ▼              ▼

Salary  Skills     Notice Period

 ▼      ▼              ▼

Structured JSON

        │

        ▼

PostgreSQL Database

⚡ Why This Project Stands Out

Unlike traditional CRUD applications, this project combines multiple enterprise technologies into a single intelligent workflow:

AI-powered voice conversations
Real-time speech transcription
LLM-driven information extraction
ATS synchronization
Calendar automation
Secure REST APIs
Cloud telephony integration
Production-ready backend architecture


---

# 🛠 Technology Stack

This project combines modern cloud infrastructure, conversational AI, speech intelligence, and enterprise backend technologies to automate the complete recruitment workflow.

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript Runtime |
| Express.js | REST API Framework |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Axios | External API Requests |
| Multer | CSV Upload |
| Winston | Logging |
| Helmet | Security |
| CORS | Cross-Origin Resource Sharing |
| Express Rate Limit | API Rate Limiting |

---

## Database

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary Database |
| SQL Migrations | Database Version Control |

---

## Artificial Intelligence

| Service | Purpose |
|---------|----------|
| OpenAI GPT | Candidate Information Extraction |
| ElevenLabs | AI Voice Generation |
| AssemblyAI | Speech-to-Text |
| NLP Pipeline | Structured Response Parsing |

---

## External Integrations

| Service | Purpose |
|---------|---------|
| Twilio | Voice Calling |
| Google Calendar | Interview Scheduling |
| Greenhouse ATS | Candidate Management |
| Zoho Recruit | ATS Support |
| Lever | ATS Support |

---

## DevOps

| Tool | Purpose |
|------|---------|
| Render | Deployment |
| GitHub | Source Control |
| Environment Variables | Secret Management |

---

# 📂 Project Structure
AI-Recruitment-Calling-Assistant/

├── src/

│ ├── config/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ ├── services/

│ ├── utils/

│ ├── database/

│ ├── validations/

│ └── app.js

│

├── migrations/

├── scripts/

├── uploads/

├── logs/

├── tests/

├── docs/

├── public/

├── package.json

├── .env.example

└── README.md

---

# 🗄 Database Design

```mermaid
flowchart LR

A[Candidates]
B[Call Sessions]
C[AI Responses]
D[Jobs]
E[Interview Schedule]
F[Recruiters]

A --> B
B --> C
A --> E
D --> E
F --> E
```

📊 Database Tables
Candidates

Stores all candidate information fetched from ATS.

Column	Type
candidate_id	UUID
full_name	VARCHAR
phone_number	VARCHAR
email	VARCHAR
ats_id	VARCHAR
source	VARCHAR
created_at	TIMESTAMP
Jobs

Stores job descriptions synchronized from ATS.

Column	Type
job_id	UUID
title	VARCHAR
company_name	VARCHAR
location	VARCHAR
employment_type	VARCHAR
salary_range	VARCHAR
jd_text	TEXT
Call Sessions

Maintains complete voice call history.

Column	Type
call_id	UUID
candidate_id	UUID
call_status	VARCHAR
recording_url	TEXT
transcript_text	TEXT
ai_confidence	DECIMAL
Candidate Responses

Stores structured information extracted using AI.

Column	Type
response_id	UUID
call_id	UUID
question_code	VARCHAR
response_text	TEXT
response_value	VARCHAR
Interview Schedule

Stores interview bookings.

Column	Type
schedule_id	UUID
candidate_id	UUID
job_id	UUID
interview_date	DATE
interview_time	TIME
interviewer_name	VARCHAR
status	VARCHAR
Recruiters

Stores recruiter information.

Column	Type
recruiter_id	UUID
full_name	VARCHAR
email	VARCHAR
phone_number	VARCHAR
company_name	VARCHAR


🔄 Request Flow


Client

│

▼

Express API

│

▼

JWT Authentication

│

▼

Validation

│

▼

Controller

│

▼

Business Logic

│

▼

External Services

│

▼

Database

│

▼

Response

🔐 Authentication Flow

sequenceDiagram

participant User

participant API

participant JWT

participant Database

User->>API: Login

API->>Database: Verify User

Database-->>API: User Data

API->>JWT: Generate Token

JWT-->>API: Access Token

API-->>User: JWT

📡 REST API Documentation
Authentication

Method	Endpoint	Description
POST	/api/auth/register	Register User
POST	/api/auth/login	Login
GET	/api/auth/profile	User Profile

Candidate APIs
Method	Endpoint
GET	/api/candidates
GET	/api/candidates/:id
POST	/api/candidates/upload
PATCH	/api/candidates/:id
DELETE	/api/candidates/:id

Job APIs
Method	Endpoint
GET	/api/jobs
GET	/api/jobs/:id
POST	/api/jobs/sync

Call APIs
Method	Endpoint
POST	/api/calls/initiate
GET	/api/calls/:id/status
POST	/api/calls/webhook
GET	/api/calls/:id/recording
GET	/api/calls/:id/transcript

Interview APIs
Method	Endpoint
GET	/api/interviews/availability
POST	/api/interviews/schedule
PATCH	/api/interviews/:id
DELETE	/api/interviews/:id

Analytics APIs
Method	Endpoint
GET	/api/analytics/calls
GET	/api/analytics/candidates
GET	/api/reports/transcripts

📞 AI Calling Pipeline


Recruiter

↓

Choose Candidate

↓

Fetch Job Details

↓

Twilio Call

↓

ElevenLabs Voice

↓

Candidate Speaks

↓

AssemblyAI

↓

Transcript

↓

OpenAI GPT

↓

Extract Candidate Details

↓

Store in PostgreSQL

↓

Schedule Interview

↓

Sync ATS


---

# ⚙️ Installation

## Prerequisites

Before running the application, ensure the following services and accounts are available.

| Requirement | Version |
|-------------|----------|
| Node.js | 18+ |
| PostgreSQL | 14+ |
| npm | Latest |
| Git | Latest |
| Twilio Account | Required |
| ElevenLabs API | Required |
| AssemblyAI API | Required |
| OpenAI API | Required |
| Google Cloud Account | Required |
| Greenhouse ATS API | Optional |

---

# 🚀 Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/AI-Recruitment-Calling-Assistant.git

cd AI-Recruitment-Calling-Assistant
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

---

### 4. Configure PostgreSQL

Create a PostgreSQL database.

```sql
CREATE DATABASE recruitment_assistant;
```

Run database migrations.

```bash
npm run migrate
```

---

### 5. Start Development Server

```bash
npm run dev
```

---

### Production

```bash
npm start
```

---

# 🌍 Environment Variables

```env
##################################################
# Application
##################################################

NODE_ENV=production
PORT=3000

##################################################
# Authentication
##################################################

JWT_SECRET=your_super_secret_key

##################################################
# PostgreSQL
##################################################

DATABASE_URL=postgresql://username:password@localhost:5432/recruitment

##################################################
# Twilio
##################################################

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_PHONE_NUMBER=

##################################################
# ElevenLabs
##################################################

ELEVENLABS_API_KEY=

ELEVENLABS_VOICE_ID=

##################################################
# AssemblyAI
##################################################

ASSEMBLYAI_API_KEY=

##################################################
# OpenAI
##################################################

OPENAI_API_KEY=

##################################################
# Google Calendar
##################################################

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

GOOGLE_REFRESH_TOKEN=

##################################################
# Greenhouse ATS
##################################################

GREENHOUSE_API_KEY=

GREENHOUSE_BASE_URL=
```

---

# 🐳 Docker Deployment

## Dockerfile

```dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

---

## Build Image

```bash
docker build -t ai-recruitment .
```

---

## Run Container

```bash
docker run -p 3000:3000 ai-recruitment
```

---

# ☁️ Deployment

The application can be deployed to any Node.js hosting platform.

Supported platforms

- Render
- Railway
- AWS EC2
- Azure App Service
- DigitalOcean
- Google Cloud Run
- Docker
- Kubernetes

---

# Render Deployment

## Step 1

Push repository to GitHub.

---

## Step 2

Create a new Web Service on Render.

---

## Step 3

Connect your repository.

---

## Step 4

Set Environment Variables.

---

## Step 5

Deploy.

---

# Build Command

```bash
npm install
```

---

# Start Command

```bash
npm start
```

---

# 🔒 Security

The application follows enterprise security practices.

## Authentication

- JWT Authentication
- Protected REST APIs
- Secure Password Hashing
- Session Validation

---

## API Security

- Helmet Middleware
- Rate Limiting
- Request Validation
- CORS Protection
- Secure Headers

---

## Database Security

- Parameterized Queries
- SQL Injection Protection
- Connection Pooling
- Secure Credentials

---

## Secrets Management

- Environment Variables
- No Hardcoded Secrets
- Separate Production Configuration

---

## Encryption

Sensitive information is encrypted before storage.

Examples include

- Tokens
- Personal Information
- API Credentials

---

# 🛡️ Production Features

✅ JWT Authentication

✅ Environment Variables

✅ PostgreSQL Database

✅ SQL Migrations

✅ Error Middleware

✅ Request Validation

✅ Logging

✅ API Rate Limiting

✅ Secure Headers

✅ CORS

✅ Health Monitoring

✅ Retry Logic

✅ Cloud Deployment

---

# ⚡ Performance Optimizations

The backend is optimized for production workloads.

### API

- Async Operations
- Connection Pooling
- Efficient SQL Queries
- Lightweight JSON Responses

---

### Database

- Indexed Queries
- Foreign Keys
- Optimized Relationships
- UUID Primary Keys

---

### External APIs

- Retry Strategy
- Timeout Handling
- Error Recovery
- Response Validation

---

# 📊 Monitoring

The application tracks operational metrics.

## Metrics

- API Response Time
- Call Success Rate
- Failed Requests
- Voice Call Duration
- Database Performance
- Active Users
- System Uptime

---

# 📝 Logging

Logs are categorized for easier debugging.

- API Logs
- Error Logs
- Authentication Logs
- Database Logs
- Call Logs
- AI Processing Logs
- Scheduler Logs

---

# ❌ Error Handling

The application gracefully handles failures.

Examples include

- Database Connection Failure
- Invalid Authentication
- Expired JWT
- API Timeout
- Twilio Errors
- OpenAI Errors
- AssemblyAI Errors
- Google Calendar Errors

---

# 🔄 Retry Strategy

External services may occasionally fail.

Automatic retries are implemented for

- Twilio API
- OpenAI API
- AssemblyAI
- Google Calendar
- Greenhouse ATS

---

# ❤️ Health Check

```http
GET /health
```

Response

```json
{
    "status":"ok",
    "uptime":"99.99%"
}
```

---

# 📈 Scalability

Designed to scale horizontally.

Supports

- Multiple API Instances
- PostgreSQL Scaling
- Docker Containers
- Reverse Proxy
- Load Balancer
- Kubernetes Deployment

---

# 🧪 Testing Strategy

Testing includes

- Unit Testing
- Integration Testing
- API Testing
- End-to-End Testing
- Load Testing
- Security Testing

---

# 📌 Best Practices

- Keep secrets in environment variables.
- Rotate API keys regularly.
- Monitor API rate limits.
- Enable HTTPS in production.
- Backup PostgreSQL regularly.
- Enable structured logging.
- Keep dependencies updated.
- Validate every external request.
- Use database migrations for schema changes.
- Monitor system health continuously.

---

---

# 📸 Application Screenshots

> Replace the placeholder images below with your own screenshots after deployment.

## 🏠 Dashboard

<p align="center">
<img src="assets/dashboard.png" width="90%">
</p>

---

## 🔐 Login Page

<p align="center">
<img src="assets/login.png" width="90%">
</p>

---

## 👥 Candidate Management

<p align="center">
<img src="assets/candidates.png" width="90%">
</p>

---

## 📞 AI Calling Dashboard

<p align="center">
<img src="assets/calls.png" width="90%">
</p>

---

## 📄 Call Transcript

<p align="center">
<img src="assets/transcript.png" width="90%">
</p>

---

## 📅 Interview Scheduling

<p align="center">
<img src="assets/calendar.png" width="90%">
</p>

---

## 📊 Analytics Dashboard

<p align="center">
<img src="assets/analytics.png" width="90%">
</p>

## 📞 Live AI Voice Call

<p align="center">
  <img src="assets/ai-voice-call.png" width="35%" alt="AI Voice Call">
</p>

<p align="center">
  <em>Live outbound AI recruitment call initiated successfully using Twilio Voice. The AI assistant contacts candidates automatically and conducts the first-round screening conversation.</em>
</p>
---
## 📡 API Testing

<p align="center">
  <img src="assets/api-call-success.png" width="100%" alt="API Call Success">
</p>

<p align="center">
  <em>Successful API request initiating an AI recruitment call. The backend returns a queued status along with a unique call ID and Twilio SID.</em>
</p>

## 🎥 Live Demo

<p align="center">
  <img src="assets/demo.gif" width="900" alt="Project Demo">
</p>

**📹 Full video:** [ai-recruitment-demo.mp4](assets/ai-recruitment-demo.mp4)

---

# 📈 Performance

| Metric | Value |
|---------|--------|
| API Response Time | < 250 ms |
| Authentication | JWT |
| Database | PostgreSQL |
| Voice Calling | Twilio |
| Speech Recognition | AssemblyAI |
| AI Processing | OpenAI |
| Voice Generation | ElevenLabs |
| Deployment | Render |
| Database Migration | SQL |
| Architecture | REST |

---

# 🌍 Production Ready Features

- Enterprise REST Architecture
- AI Voice Calling
- JWT Authentication
- PostgreSQL Database
- Secure API Design
- SQL Migrations
- Cloud Deployment
- Structured Logging
- API Validation
- Rate Limiting
- Call Recording
- AI Transcript Generation
- Candidate Analytics
- Google Calendar Integration
- ATS Synchronization
- GDPR Friendly Design
- Retry Mechanisms
- Environment Variable Configuration

---

# 🎯 Use Cases

This platform can be used by

- Recruitment Agencies
- HR Teams
- Staffing Companies
- Enterprise Organizations
- Talent Acquisition Teams
- BPO Recruitment
- Campus Hiring
- HR Consultancies

---

# 🗺 Roadmap

## Completed

- AI Voice Calling
- PostgreSQL Integration
- ATS Integration
- Candidate Management
- JWT Authentication
- Google Calendar Integration
- Call Recording
- Transcript Generation
- AI Information Extraction
- Analytics APIs

---

## Upcoming

- WhatsApp Integration
- Email Automation
- Resume Parser
- AI Candidate Ranking
- Resume Matching
- Dashboard Charts
- Multi-language Support
- Voice Cloning
- Recruiter Analytics
- Docker Compose
- Kubernetes Deployment
- CI/CD Pipeline
- Unit Testing Coverage
- SMS Notifications
- Candidate Recommendation Engine

---

# 🤝 Contributing

Contributions are welcome!

1. Fork this repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Added awesome feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 🧪 Development Guidelines

- Write clean and maintainable code.
- Follow REST API standards.
- Keep commits meaningful.
- Document new features.
- Add tests where applicable.
- Never commit secrets.
- Use environment variables.
- Follow ESLint formatting.

---

# 📚 Learning Outcomes

This project demonstrates practical experience with

- Backend Development
- REST API Design
- Authentication
- PostgreSQL
- SQL Migrations
- AI Voice Applications
- LLM Integration
- Speech Processing
- Cloud Deployment
- Third-party API Integration
- System Design
- Enterprise Architecture

---

# 🏆 Why This Project Matters

Recruitment is one of the most repetitive business workflows.

This project demonstrates how Artificial Intelligence can automate large portions of the hiring process while maintaining a conversational and human-like experience.

It showcases the integration of conversational AI, speech intelligence, cloud telephony, and enterprise backend engineering into a unified production-ready platform.

---

# ⭐ Future AI Enhancements

- AI Interview Scoring
- Sentiment Analysis
- Voice Emotion Detection
- Candidate Recommendation Engine
- Resume Semantic Search
- AI Hiring Assistant
- Real-time Recruiter Dashboard
- LLM Memory
- Vector Database Integration
- RAG-based Company Knowledge Base

---

# 💼 Recruiter Highlights

### This project demonstrates experience with

- Production Backend Engineering
- Enterprise REST APIs
- AI Voice Applications
- Large Language Models
- Speech Recognition
- PostgreSQL
- Authentication & Security
- Third-party Integrations
- Cloud Deployment
- System Architecture
- Database Design
- API Development

---

# 📄 License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge,
to any person obtaining a copy of this software...
```

---

# 👩‍💻 Author

## Bhavana Setty

AI Engineer | Machine Learning Engineer | Backend Developer

### Connect with me

- GitHub: https://github.com/Bhavana998
- Email: bhavanasetty95@gmail.com

---

# 🌟 Support

If you found this project useful,

⭐ Star this repository

🍴 Fork the repository

🐛 Report Issues

💡 Suggest Improvements

---

# 🙏 Acknowledgements

Special thanks to the teams behind

- OpenAI
- Twilio
- ElevenLabs
- AssemblyAI
- PostgreSQL
- Express.js
- Node.js
- Render
- Google Calendar API
- Greenhouse ATS

---

# 📌 Citation

If you use this project in your research or work, please consider citing it.

```bibtex
@software{ai_recruitment_calling_assistant,
  author = {Bhavana Setty},
  title = {AI Recruitment Calling Assistant},
  year = {2026},
  url = {https://github.com/Bhavana998/AI-Recruitment-Calling-Assistant}
}
```

---

<div align="center">

# ⭐ If you like this project, give it a Star ⭐

**Built with ❤️ using Node.js, Express.js, PostgreSQL, OpenAI, Twilio, ElevenLabs, and AssemblyAI**

---

### "Building Intelligent Recruitment Systems with Conversational AI"

</div>





