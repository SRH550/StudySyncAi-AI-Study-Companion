# StudySync AI - Intelligent Study Companion

**StudySync AI** is a state-of-the-art, full-stack AI platform engineered to revolutionize the way students interact with their learning materials. By leveraging advanced Large Language Models, StudySync AI transforms static documents into dynamic, interactive learning assets.

**Live Platform:** [https://study-sync-ai-seven.vercel.app/](https://study-sync-ai-seven.vercel.app/)

---

## 🌟 Key Features

- **Reliable AI Engine**: Built with a fallback system using OpenRouter API (Nemotron-70B, Gemini Pro, Llama 3) to make sure the service is always online and fast.
- **Study Chat**: Allows students to upload notes and ask the AI specific questions about their material.
- **Easy Quiz Generation**: Automatically creates interactive quizzes from uploaded text to help with studying.
- **Progress Tracking**: A dashboard to track study streaks, quiz scores, and learning progress.
- **Cloud Deployment**: Deployed on the cloud using Vercel and Railway for reliable performance.

## 🛠️ Tech Stack

### Frontend
- **React/Next.js**: High-performance web framework.
- **Tailwind CSS**: Modern, responsive styling.
- **Lucide React**: Sleek iconography.
- **Axios**: Smooth API communication.

### Backend
- **Node.js & Express**: Scalable server architecture.
- **MongoDB**: Robust NoSQL database for flexible data storage.
- **OpenRouter API**: Access to top-tier AI models (Nemotron, Gemini, Llama).
- **JWT & Bcrypt**: Secure authentication and password hashing.
- **Multer & PDF-Parse**: Efficient file processing and text extraction.

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SRH550/StudySyncAi-AI-Study-Companion.git
   cd StudySyncAi-AI-Study-Companion
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # OPENROUTER_API_KEY=your_key
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file with:
   # NEXT_PUBLIC_API_URL=http://localhost:5000
   npm run dev
   ```

## 📄 License
This project is licensed under the MIT License.
