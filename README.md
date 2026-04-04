# Notify - Smart Notice Board

A full-stack microservices-based notice board system with:

## 🚀 Features
- Admin & Student roles (RBAC)
- Create / Delete notices
- Mark notices as important
- API Gateway architecture
- Dockerized services

## 🛠 Tech Stack
- React (Frontend)
- Node.js + Express (Backend)
- MongoDB
- Docker

## ▶️ Run locally
```bash
docker compose up --build

🚀 Kubernetes Deployment

This project is deployed using Kubernetes with a microservices-based architecture.

🧠 Architecture
Frontend (React + Nginx)
        ↓
Gateway Service (Node.js)
        ↓
Microservices (Notice, Auth, etc.)
        ↓
MongoDB
⚙️ Services Used
Frontend – Served via Nginx (production build)
Gateway – Central API routing layer
Notice Service – Handles notice-related data
Auth Service – Authentication layer
MongoDB – Database (external)
🐳 Containerization

Each service is containerized using Docker and deployed as:

Kubernetes Deployments
Exposed via Services
🌐 Local Deployment (Minikube)

To run locally:

minikube start
kubectl apply -f k8s/
minikube tunnel
🔗 Access

Frontend is exposed via:

minikube service frontend -n notify
🔄 API Communication

Frontend communicates with backend via Gateway:

const API_URL = "http://127.0.0.1:5003";
🧩 Key Concepts Implemented
Kubernetes Deployments & Services
LoadBalancer services in Minikube
Microservices architecture
API Gateway pattern
Docker multi-stage builds (React → Nginx)
Service-to-service communication
🧠 Challenges Solved
Handling internal vs external networking in Kubernetes
Fixing service port mismatches
Debugging container vs service vs ingress layers
Managing frontend API routing in a clustered environment


## 🌍 Live Demo
http://13.233.149.40:3000
