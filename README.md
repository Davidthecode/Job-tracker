# Job Application Tracker

A job application tracking system built with Next.js, TypeScript, and AI-powered job analysis. Track your job applications, monitor their status, and get AI insights to improve your application strategy.

## Features

### **Core Functionality**
- **Add Job Applications**: Track job title, company, application link, and status
- **Dashboard Overview**: Visual stats showing total applications, interviews, offers, and rejections
- **Edit Applications**: Update job details through a clean modal interface
- **Delete Applications**: Remove applications with confirmation dialogs
- **Status Management**: Track application progress (Applied, Interviewing, Rejected, Offer)

### **AI-Powered Analysis**
- **Job Description Analysis**: Paste any job description for AI-powered insights
- **Smart Summaries**: Get concise summaries of job requirements
- **Skill Recommendations**: Receive 3 key skills to highlight in your resume

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: Google Gemini API
- **Data Storage**: In-memory (JSON file-based)

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm package manager
- Google Gemini API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Davidthecode/Job-tracker.git
   cd job-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Getting a Gemini API Key

The AI job analysis feature requires a Google Gemini API key. Here's how to get one:

### Step 1: Access Google AI Studio
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account

### Step 2: Create API Key
1. Click on "Get API key" in the left sidebar
2. Click "Create API key"
3. Select "Create API key in new project" or choose an existing project
4. Copy your API key

### Step 3: Add to Environment
1. Paste your API key in the `.env.local` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
2. Restart your development server

### Important Notes:
- If you don't set up the API key, all features except AI analysis will work normally

## API Endpoints

The application provides RESTful API endpoints:

- `GET /api/jobs` - Retrieve all job applications
- `POST /api/jobs` - Create a new job application
- `PUT /api/jobs/[id]` - Update an existing job application
- `DELETE /api/jobs/[id]` - Delete a job application
- `POST /api/analyze-job` - Analyze job description with AI

## Data Storage

Currently uses a simple JSON file (`data/jobs.json`) for data persistence. This approach:
- Simple setup with no database required
- Perfect for development and testing
