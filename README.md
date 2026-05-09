# DOCCAT+

A document upload system that categorizes and summarizes uploaded documents using machine learning.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Session Management](#session-management)
- [Git Workflow](#git-workflow)
- [Contributing](#contributing)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [pnpm](https://pnpm.io/) (package manager for Node.js)
- [Python](https://www.python.org/) (v3.9 or above)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

---

## Installation

### Clone the Repository

Choose one of the following methods to clone the repository:

**Using HTTPS (Recommended for beginners):**

```bash
git clone https://github.com/bipinstha10/smart-doc-analyzer.git
cd smart-doc-analyzer
```

**Using SSH (Recommended if you have SSH keys configured):**

```bash
git clone git@github.com:bipinstha10/smart-doc-analyzer.git
cd smart-doc-analyzer
```

**Using GitHub CLI (if you have GitHub CLI installed):**

```bash
gh repo clone bipinstha10/smart-doc-analyzer
cd smart-doc-analyzer
```

> **Note:** If you're unsure which method to use, HTTPS is the easiest to get started with. For SSH, you'll need to [set up SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) on your machine first.

---

## Database Setup

The application uses PostgreSQL. Start the database using Docker Compose:

**1. Navigate to the services directory**

```bash
cd services
```

**2. Start the PostgreSQL container**

```bash
docker compose up -d
```

This will start a PostgreSQL database at `localhost:4011` with the following credentials:

- **User:** `username`
- **Password:** `password`
- **Database:** `db_name`

> **Note:** Make sure Docker daemon is running before executing these commands.

---

## Frontend Setup

Navigate to the frontend directory and set up the development environment.

**1. Go into the frontend folder**

```bash
cd frontend
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Start the development server**

```bash
pnpm run dev
```

The frontend will run on `http://localhost:5173` by default.

---

## Backend Setup

Navigate to the backend directory and set up the Python environment.

**1. Go into the backend folder**

```bash
cd backend
```

**2. Create a virtual environment**

```bash
python -m venv venv
```

**3. Activate the virtual environment**

**On Windows:**

```bash
venv\Scripts\activate
```

**On macOS/Linux:**

```bash
source venv/bin/activate
```

**4. Copy the environment file**

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration (especially Google OAuth credentials if needed).

**5. Install dependencies**

```bash
pip install -r requirements.txt
```

**6. Run database migrations**

```bash
alembic upgrade head
```

**7. Start the server**

```bash
python run.py
```

The backend will run on `http://localhost:8000`.

---

## Running the Application

Both the frontend and backend must run simultaneously for the application to work properly.

**Terminal 1 — Database (if not already running):**

```bash
cd services
docker compose up -d
```

**Terminal 2 — Backend:**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 3 — Frontend:**

```bash
cd frontend
pnpm run dev
```

Once all are running, open your browser and navigate to `http://localhost:5173`.

---

## Environment Variables

Both frontend and backend use environment configuration. Start with the provided example files:

**Backend Environment (`.env`)**

Copy `.env.example` to `.env` in the backend directory:

```bash
cd backend
cp .env.example .env
```

Key variables:

| Variable                      | Description                           | Example                                                    |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `DATABASE_URL`                | PostgreSQL connection string          | `postgresql+asyncpg://doccat:doccat@localhost:4011/doccat` |
| `SECRET_KEY`                  | JWT secret key (change in production) | `your-super-secret-key-change-this-12345`                  |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token expiration (minutes)     | `15`                                                       |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Refresh token expiration (days)       | `7`                                                        |
| `GOOGLE_CLIENT_ID`            | Google OAuth Client ID                | From Google Cloud Console                                  |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth Client Secret            | From Google Cloud Console                                  |
| `FRONTEND_URL`                | Frontend URL for CORS                 | `http://localhost:5173`                                    |

**Frontend Environment**

Frontend API calls are configured to use `http://localhost:8000` by default (see `frontend/src/services/baseApi.ts`).

---

## Session Management

The application uses JWT-based authentication with automatic token refresh:

### Token Types

- **Access Token**: Short-lived token for API authentication (default: 15 minutes)
- **Refresh Token**: Long-lived token for obtaining new access tokens (default: 7 days)

### How It Works

1. User logs in or signs up → receives both access and refresh tokens
2. Access token is used for all API requests
3. When access token expires, the frontend automatically uses the refresh token to get a new access token
4. This happens seamlessly without user interruption
5. If refresh token expires, user is logged out

### Adjusting Token Expiration

Edit the backend `.env` file:

```env
ACCESS_TOKEN_EXPIRE_MINUTES=15    # Change access token duration
REFRESH_TOKEN_EXPIRE_DAYS=7       # Change refresh token duration
```

For testing (quick expiration):

```env
ACCESS_TOKEN_EXPIRE_MINUTES=1     # Expires in 1 minute
```

### Token Storage

Tokens are securely stored in the browser's localStorage:

- `access_token` - Used for API requests
- `refresh_token` - Used to refresh access tokens
- `user` - Current user information

---

## .gitignore

Ensure the following items are in your `.gitignore` to prevent committing unwanted files:

```
node_modules/
model/
venv/
uploads/
__pycache__/
*.pyc
.env
.DS_Store
dist/
build/
```

## Git Workflow

### Before You Start

Always pull the latest changes from the main branch:

```bash
git pull origin main
```

### Creating a Feature Branch

**1. Create and switch to a new branch**

Use a descriptive branch name following this pattern: `feature/feature-name`, `fix/bug-name`, or `chore/task-name`

```bash
git checkout -b feature/document-categorization
```

**2. Make your changes**

Edit files, add features, or fix bugs as needed.

**3. Stage your changes**

```bash
git add .
```

Or stage specific files:

```bash
git add frontend/src/components/Upload.tsx backend/main.py
```

**4. Commit your changes**

Follow the commit message format:

```bash
git commit -m "feat: add document categorization feature"
```

**5. Push your branch to the repository**

```bash
git push origin feature/document-categorization
```

### Creating a Pull Request

**1. Go to the repository on GitHub**

**2. You should see a prompt to create a pull request for your recently pushed branch**

**3. Click "Compare & pull request"**

**4. Add a description of your changes** and submit the PR

**5. Wait for review** and address any feedback from team members

### Syncing with Main Branch

If the main branch has been updated while you're working:

```bash
git fetch origin
git rebase origin/main
```

Or merge the latest changes:

```bash
git fetch origin
git merge origin/main
```

### Deleting Your Branch

After your PR is merged, delete the local and remote branches:

```bash
# Delete local branch
git branch -d feature/document-categorization

# Delete remote branch
git push origin --delete feature/document-categorization
```

---

## Contributing

### Commit Message Format

Follow these conventions for commit messages:

- **`feat:`** for new features

  ```bash
  git commit -m "feat: add document categorization"
  ```

- **`fix:`** for bug fixes

  ```bash
  git commit -m "fix: resolve upload timeout issue"
  ```

- **`chore:`** for setup, config, or maintenance changes
  ```bash
  git commit -m "chore: update dependencies"
  ```

### General Guidelines

- Keep commits focused and atomic
- Write descriptive commit messages
- Pull before pushing to avoid conflicts
- Test your changes locally before committing

---

## Troubleshooting

### Port Already in Use

If `http://localhost:5173` or `http://localhost:8000` is already in use:

- **Frontend:** Modify the port in `vite.config.ts`
- **Backend:** Modify the port in `backend/run.py`
- **Database:** Modify the port in `services/docker-compose.yml`

### Database Connection Issues

If you cannot connect to the PostgreSQL database:

1. Ensure Docker is running: `docker ps`
2. Check if the container is running: `docker compose -f services/docker-compose.yml ps`
3. Restart the database: `docker compose -f services/docker-compose.yml restart`
4. Verify the `DATABASE_URL` in `backend/.env`

### Virtual Environment Issues

If the Python virtual environment doesn't activate:

```bash
# Remove and recreate
rm -rf backend/venv
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Database Migration Issues

If you encounter migration errors:

```bash
# Downgrade all migrations (use cautiously)
alembic downgrade base

# Re-run migrations
alembic upgrade head
```

---

## Support

For issues or questions, please open an issue on the repository or contact the team.

---
