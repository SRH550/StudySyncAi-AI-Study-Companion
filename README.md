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
- **Next.js 14**: Server-side rendering and optimized routing.
- **Tailwind CSS**: Modern, responsive styling with a focus on glassmorphism.
- **Lucide React**: Premium iconography.
- **Shadcn/UI**: Accessible and beautiful component library.

### Backend
- **Node.js & Express**: Scalable server architecture.
- **MongoDB**: Robust NoSQL database for flexible data storage.
- **OpenRouter API**: Access to top-tier AI models (Nemotron, Gemini, Llama).
- **JWT & Bcrypt**: Secure authentication and password hashing.
- **Multer & PDF-Parse**: Efficient file processing and text extraction.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas Account
- OpenRouter API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SRH550/StudySyncAi.git
   cd StudySyncAi
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on the provided guide
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file with your backend URL
   npm run dev
   ```

---

## 🔒 Security
This project uses multi-layer `.gitignore` protection to ensure that local secrets, environment variables, and node_modules are never exposed.

---

## 📄 License
This project is licensed under the ISC License.

Developed by [Shivakoti Raj Harsha](https://github.com/SRH550)
