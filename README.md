# DOCCAT+

A document upload system that categorizes and summarizes uploaded documents using machine learning.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Git Workflow](#git-workflow)
- [Contributing](#contributing)

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or above)
- [pnpm](https://pnpm.io/) (package manager for Node.js)
- [Python](https://www.python.org/) (v3.9 or above)
- [Git](https://git-scm.com/)

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

**4. Install dependencies**

```bash
pip install -r requirements.txt
```

**5. Start the server**

```bash
uvicorn main:app --reload
```

The backend will run on `http://localhost:8000`.

---

## Running the Application

Both the frontend and backend must run simultaneously for the application to work properly.

**Terminal 1 — Backend:**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**

```bash
cd frontend
pnpm run dev
```

Once both are running, open your browser and navigate to `http://localhost:5173`.

---

## Environment Variables

Currently, there are no `.env` files configured. The following values are hardcoded for local development:

| Variable     | Current Value         | Location                           |
| ------------ | --------------------- | ---------------------------------- |
| Backend URL  | http://localhost:8000 | `frontend/src/services/baseApi.ts` |
| Frontend URL | http://localhost:5173 | `backend/main.py` (CORS config)    |

### To Change These Values:

Update the files mentioned above with your custom values. In a production environment, consider using `.env` files for secure configuration management.

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

- **Frontend:** Modify the port in the Vite config
- **Backend:** Run `uvicorn main:app --reload --port 8001`

### Virtual Environment Issues

If the Python virtual environment doesn't activate:

```bash
# Remove and recreate
rm -rf venv
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
```

---

## Support

For issues or questions, please open an issue on the repository or contact the team.

---
