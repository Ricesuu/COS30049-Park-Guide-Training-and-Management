# **🏞 COS30049 Park Guide Training and Management**

A comprehensive system for training and managing park guides, featuring AI-powered plant identification, IoT-based monitoring, and interactive learning modules.

## **🚀 Features**

-   🎓 Interactive Training Modules
-   🌿 AI-Powered Plant Identification
-   📱 Mobile & Web Applications
-   🔍 IoT-based Plant Monitoring
-   📊 Guide Progress Tracking
-   🎯 Assessment & Certification

## **💻 Technology Stack**

-   **Frontend**:
    -   Web: React, Vite, TailwindCSS
    -   Mobile: React Native, Expo, TailwindCSS
-   **Backend**:
    -   Next.js
    -   FastAPI (Python)
    -   MySQL Database
-   **AI/ML**:
    -   ONNX Runtime for model inference
    -   Cohere AI for text embeddings or NLP tasks
    -   Python Libraries: `fastapi`, `uvicorn`, `sentence-transformers`
    -   Node.js Packages: `onnxruntime-node`, `sharp`, `@qdrant/js-client-rest`, `nodemailer`, `concurrently`
-   **IoT**:
    -   MQTT Protocol
    -   Real-time Monitoring

## **📂 Repository Structure**

```
/
│── /backend-api         # Next.js & FastAPI backend
│── /frontend
│   ├── /mobile         # React Native mobile app
│   └── /web            # Vite-based web interface
│── /iot_feature        # IoT monitoring system
│── /backend            # Database schema
│── README.md           # Documentation
│── LICENSE             # Licensing information
```

---

## **🛠 Git Branching Strategy**

| **Branch**   | **Purpose**                    | **Who Works Here?**           |
| ------------ | ------------------------------ | ----------------------------- |
| `main`       | Production-ready stable code   | Group Leader/Product Owner    |
| `dev`        | Active development             | All developers                |
| `web-app`    | Web application development    | Frontend & backend developers |
| `mobile-app` | Mobile application development | Frontend & backend developers |

### **Branch Rules**

-   **1 Approval Required** for merging into `dev`.
-   **3 Approvals Required** for merging `dev` into `main`.

---

## **📝 Code Review Checklist**

✅ **Does it follow the project structure?**
✅ **Code is documented?**
✅ **Has the code been tested?**

---

## **📌 Project Board & Sprint Tracking**

📍 **GitHub Projects → Kanban Board**

-   📋 **Backlog:** Features yet to start
-   🚀 **Sprint Backlog:** Features to implement in sprint
-   🔜 **In Progress:** Features from sprint being implemented
-   🔎 **Code Review:** Feature's code being reviewed
-   ✅ **Done:** Completed features

---

## **🛠️ Setup & Installation**

### Prerequisites

-   Node.js (v20 or later)
-   Python 3.12+
-   MySQL

### Backend API Setup

```bash
cd backend-api
npm install
npm run build
```

### Web Frontend Setup

```bash
cd frontend/web/website
npm install
```

### Mobile App Setup

```bash
cd frontend/mobile/my-app
npm install
```

### IoT Feature Setup

```bash
cd iot_feature
pip install -r requirements.txt
```

## **🚀 Running the Project**

### Backend API

```bash
cd backend-api
npm run dev
```

This will start both the Next.js server and FastAPI server concurrently.

### Web Frontend

```bash
cd frontend/web/website
npm run dev
```

### Mobile App

```bash
cd frontend/mobile/my-app
npm start
```
