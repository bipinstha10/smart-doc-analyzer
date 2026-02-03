# DOCCAT+

A document upload system that categorizes and summarizes uploaded documents using ML.

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) (v18 or above)
- [pnpm](https://pnpm.io/)
- [Python](https://www.python.org/) (v3.9 or above)
- [Git](https://git-scm.com/)

---

## Frontend Setup

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

The frontend will run on `http://localhost:3000` by default.

---

## Backend Setup

**1. Go into the backend folder**

```bash
cd backend
```

**2. Create a virtual environment**

```bash
python -m venv venv
```

**3. Activate the virtual environment**

On Windows:

```bash
venv\Scripts\activate
```

On Mac/Linux:

```bash
source venv/bin/activate
```

**4. Install dependencies**

```bash
pip install -r requirements.txt
```

**5. Start the server**

```bash
uvicorn main:app --reload --port 3000
```

The backend will run on `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| POST   | /upload  | Uploads a document file |

### POST /upload

Accepts a file via `multipart/form-data`.

**Supported file types:** PDF, DOCX, TXT, PNG, JPG, JPEG, GIF

**Request:**

```
Key   → file
Value → your file
```

**Response:**

```json
{
  "id": "unique-file-id.pdf",
  "fileName": "original-name.pdf",
  "message": "File uploaded successfully",
  "uploadedAt": "2026-02-03T12:00:00"
}
```

---

## Running Both Frontend and Backend

Open two terminals:

- **Terminal 1** — run the backend (`cd backend` → `uvicorn main:app --reload --port 3000`)
- **Terminal 2** — run the frontend (`cd frontend` → `pnpm run dev`)

Both must be running at the same time for the upload to work.

---

## Environment Variables

Currently there are no `.env` files. The following values are hardcoded for local development:

| Variable     | Current Value         | Where It Is                      |
| ------------ | --------------------- | -------------------------------- |
| Backend URL  | http://localhost:3000 | frontend/src/services/baseApi.ts |
| Frontend URL | http://localhost:5173 | backend/main.py (CORS)           |

If you need to change these, update the files mentioned above.

---

## .gitignore

Make sure these are in your `.gitignore` so they don't get pushed:

```
# Frontend
node_modules/

# Backend
venv/
uploads/
__pycache__/
.env
```

---

## Contributing

- All team members are currently working on the `main` branch.
- Pull the latest changes before starting work:

```bash
git pull origin main
```

- Commit messages should follow this format:

```
feat: short description    → for new features
fix: short description     → for bug fixes
chore: short description   → for setup or config changes
```

---
