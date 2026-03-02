🌿 Galil Data – AI Powered Municipal Data Platform

A modern full-stack web application for exploring municipal and demographic data in the Eastern Galilee region, enhanced with an AI-powered RAG chat assistant.

Built with Next.js 14, TypeScript, Prisma, PostgreSQL, TailwindCSS, and AI integrations.

🚀 Overview

Galil Data is an interactive data exploration platform that allows users to:

Explore municipal authorities

View demographic statistics

Filter by region, cluster, and status

Visualize data through charts

Ask natural language questions via an AI assistant

The system combines structured data visualization with Retrieval-Augmented Generation (RAG) to provide contextual answers based on real municipal data.

🧠 AI Chat Assistant (RAG System)

One of the core features of this project is the AI-powered chat assistant.

🎯 Purpose

The chat allows users to ask natural language questions such as:

"What is the population of Karmiel?"

"Which authority has the highest female population?"

"Show data about Eastern Galilee cluster authorities."

Instead of responding with generic AI knowledge, the system retrieves relevant structured data and uses it to generate grounded answers.

⚙️ How The Chat Works (Architecture)

The assistant is built using a Retrieval-Augmented Generation (RAG) pipeline:

1️⃣ User Question

The user types a natural language query.

2️⃣ Embedding

The question is converted into a vector using an embedding model.

3️⃣ Vector Search

The system searches relevant chunks in the vector database (Pinecone / embeddings store).

Each chunk contains:

Authority name

Population data

Gender distribution

Metadata

4️⃣ Context Injection

Relevant chunks are injected into the LLM prompt.

5️⃣ AI Generation

The LLM generates a structured, grounded response based only on retrieved data.

📦 Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

TailwindCSS

shadcn/ui

Chart.js

Leaflet (interactive maps)

Backend

Next.js API routes

Prisma ORM

PostgreSQL

AI & RAG

Embedding model (Google / OpenAI)

Vector database (Pinecone)

LLM (Gemini / OpenAI)

Custom prompt engineering

Metadata filtering

🗂 Project Structure
src/
 ├── app/
 │   ├── api/
 │   │   ├── chat/
 │   │   ├── authorities/
 │   │   └── admin/
 │   ├── explorer/
 │   ├── dashboard/
 │   └── layout.tsx
 ├── components/
 ├── lib/
 └── prisma/
🔐 Security

Environment variables stored securely in .env

API keys are never exposed to client

Server-side AI calls

Role-based admin protection

🧪 Features

Dynamic data filtering

Real-time charts

Dark / Light mode

Admin panel

RAG-based AI chat

Vector search with metadata

Deployment on Vercel
