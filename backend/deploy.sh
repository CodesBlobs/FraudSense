#!/bin/bash

# Configuration
PROJECT_DIR="/home/$(whoami)/FraudSense/backend"

# Navigate to project directory
cd "$PROJECT_DIR" || { echo "❌ Directory $PROJECT_DIR not found"; exit 1; }

# Pull latest changes (assuming the project is a git repo on the VM)
# If you are not using Git on the VM, you can skip this and just scp the files
# echo "🔄 Pulling latest changes..."
# git pull

# Build and restart containers
echo "🚀 Restarting containers..."
docker compose up -d --build

# Clean up old images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo "✅ Deployment complete!"
docker compose ps
