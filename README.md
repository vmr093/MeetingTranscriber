# 🎙️ MeetingTranscriber

***AI-powered transcription, summarization, and meeting management in one modern interface.***

MeetingTranscriber helps you convert conversations into structured summaries using advanced AI models and Whisper transcription. Organize, search, and export your meetings — all with a sleek UI.

---

## 🚀 Features

- 🎤 Record meeting audio
- 🤖 AI-generated summaries
- 🗂️ Version control for summaries
- 🔐 Secure login and authentication (JWT + Google OAuth)
- 🧠 Automatic transcript processing with Whisper + OpenAI
- 🔍 Search ameetings
- 📄 Export summaries as PDF or Markdown
- 🎨 Beautiful, responsive UI with animations and modern effects

---

## 🖥️ Demo

> _https://meeting-transcriber-7ya7nzwy4-vmr093s-projects.vercel.app/_

---

## 📦 Tech Stack

**Frontend:**
- React (Vite)
- Framer Motion
- React Router
- React Hot Toast
- Custom CSS (no Tailwind)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Auth
- Google OAuth (Firebase)
- Whisper + OpenAI integration

---

## Setup the Backend

- cd backend
- npm install

## Creat a .env file

- PORT=8080
- MONGO_URI=your_mongodb_uri
- OPENAI_API_KEY=your_openai_key

## Setup the Front End

- cd ../frontend
- npm install
- npm run dev

## 🔐 Authentication
**MeetingTranscriber uses:**

- Email/password login (JWT-based)
- Google Sign-In via Firebase
- Protected dashboard routes (PrivateRoute)

## AI Integration

- Whisper: Audio to text transcription
- OpenAI (GPT): Summarizes transcripts into actionable notes
- Version History: Stores previous summary versions with restore/download options

## 📥 File Upload & Summarization Flow

- Record audio
- Whisper processes and transcribes
- OpenAI summarizes the transcript with threaded summary segmentation
- Summary is saved and displayed in the modal
- Version control allows restoring/editing/exporting summaries

## 👤 Author

**Viola Ranjha**
- 🖥️ Full-Stack Developer | 💡 Creative Problem Solver | ☕ Coffee & Code Enthusiast
- 📧 ranjha.viola@gmail.com
- 🔗 https://vmr093.github.io/ViolaRanjha/



