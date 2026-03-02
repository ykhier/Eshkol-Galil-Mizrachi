# 🌿 Galil Data – AI Powered Municipal Data Platform

A modern full-stack data exploration platform with an integrated AI RAG-based chat assistant.

Built with Next.js 14, TypeScript, Prisma, PostgreSQL, TailwindCSS, and advanced AI infrastructure.

---

# 📌 Overview

Galil Data is an interactive web platform that enables users to explore structured municipal and demographic data in an intuitive and intelligent way.

The system combines:

- Structured data filtering  
- Interactive dashboards  
- Data visualization (charts & maps)  
- AI-powered natural language Q&A  

Users can visually explore municipal statistics or ask natural language questions through an AI assistant.

---

# 🧠 AI Chat Assistant (RAG Architecture)

The core innovation of this project is the Retrieval-Augmented Generation (RAG) pipeline.

Instead of generating generic AI responses, the assistant:

1. Converts the user’s question into a vector (embedding)
2. Searches a vector database for relevant municipal data
3. Injects structured context into the LLM prompt
4. Generates a grounded response based strictly on retrieved data

This architecture significantly reduces hallucinations and ensures reliable, data-backed answers.

---

# ⚙️ How The Chat Works – Step by Step

## 1️⃣ User Question

Example:

> "Which authority has the highest population?"

## 2️⃣ Embedding Generation

The question is converted into a numerical vector representation.

## 3️⃣ Vector Similarity Search

The system queries Pinecone to retrieve the most relevant structured data chunks.

## 4️⃣ Context Injection

Retrieved data (authority name, population, gender distribution, metadata) is inserted into the LLM prompt.

## 5️⃣ Grounded AI Response

The LLM generates an answer strictly based on the retrieved context.

---

# 🏗 Tech Stack

## 🎨 Frontend

- Next.js 14 (App Router)  
- TypeScript  
- TailwindCSS  
- shadcn/ui  
- Chart.js  
- Leaflet  

## 🗄 Backend

- Next.js API Routes  
- Prisma ORM  
- PostgreSQL  

## 🤖 AI Infrastructure

- Embedding model (Google / OpenAI)  
- Pinecone vector database  
- LLM (Gemini / OpenAI)  
- Custom prompt engineering  
- Metadata filtering  

## ☁️ Deployment

- Vercel  
- Cloud PostgreSQL  
- Pinecone  

---

# ✨ Key Features

- Dynamic authority filtering  
- Real-time interactive charts  
- Dark / Light mode support  
- Admin panel  
- RAG-based AI assistant  
- Vector similarity search  
- Secure environment variable management  
- Server-side AI calls (no exposed API keys)  

---

# 🔐 Security

- API keys stored securely in environment variables  
- AI requests handled server-side only  
- No client-side exposure of secrets  
- Role-based admin authentication  
- Production-ready environment separation  

---

# 🚀 Vercel Deployment

This project is optimized for deployment on Vercel.

## 🔧 Deployment Steps

1. Push the repository to GitHub.
2. Go to Vercel → New Project.
3. Import your repository.
4. Configure:
   - Framework: Next.js
   - Install Command: `npm install`
   - Build Command: `npm run build`

5. Add environment variables in:

Vercel Dashboard → Project → Settings → Environment Variables
