# Deployment Guide - FraudSense

This guide explains how to deploy the **Frontend to Vercel** and the **Backend to a GCP VM**.

---

## 1. Backend: GCP VM Setup

### A. Create VM & Static IP
1.  Go to the [GCP Console](https://console.cloud.google.com/).
2.  Navigate to **Compute Engine > VM Instances**.
3.  Create an instance (e.g., `e2-small` is usually enough).
4.  **Crucial**: Under **Firewall**, check both **"Allow HTTP traffic"** and **"Allow HTTPS traffic"**.
5.  Go to **VPC Network > IP Addresses** and reserve a **Static External IP** for your instance.

### B. DNS Configuration
1.  Point your domain or subdomain (e.g., `api.yourdomain.com`) to your VM's **Static IP** using an **A Record**.

### C. Install Docker on VM
Connect to your VM via SSH and run:
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
# Logout and log back in to apply group changes
```

### D. Deploy Backend
1.  Copy the `backend` folder to the VM (via `git clone` or `scp`).
2.  Create a `.env` file in the `backend` folder on the VM with your production secrets.
3.  Update the `Caddyfile` with your actual domain and email.
4.  Run the deployment script:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

---

## 2. Frontend: Vercel Setup

### A. Deploy to Vercel
1.  Push your code to a GitHub/GitLab repository.
2.  Connect the repository to **Vercel**.
3.  Set the **Root Directory** to `frontend`.

### B. Environment Variables
In the Vercel Project Settings, add the following environment variable:
- `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com` (Your backend domain with https)

---

## 3. Post-Deployment Verification

### Backend Health Check
Visit `https://api.yourdomain.com/api/health` in your browser. It should return `{"status":"ok", ...}`.

### Frontend
Visit your Vercel URL and ensure you can log in and view scenarios.

### Troubleshooting
- **CORS Errors**: Ensure `CORS_ORIGIN` in the backend `.env` matches your Vercel URL (e.g., `https://fraudsense.vercel.app`).
- **SSL Issues**: Check Caddy logs on the VM: `docker compose logs caddy`.
- **Mixed Content**: Ensure the frontend is calling the backend via `https`, not `http`.
