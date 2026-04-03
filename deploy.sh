#!/bin/bash

set -euo pipefail

echo "🚀 Deploying to Kubernetes..."

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/notice-service.yaml
kubectl apply -f k8s/gateway.yaml
kubectl apply -f k8s/frontend.yaml

echo "✅ Deployment complete"
