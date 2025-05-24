# 🚀 Progbattle Project Documentation

## 🧾 Overview

**Progbattle** is a full-stack web application that facilitates coding competitions, personal team challenges, and version-controlled collaboration in a secure and user-friendly environment. It provides a real-time editor, user authentication, Docker-based sandboxed execution, and Git-powered version history.

---

## 🛠️ Technologies Used

### Frontend

- **Framework:** [Next.js](https://nextjs.org/) (React-based)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Version Selector:** Custom dropdown for selecting past versions via Git

### Backend

- **Runtime:** Node.js (with Express)
- **Authentication:** Custom system using session storage for persistent user state
- **ORM:** [Sequelize](https://sequelize.org/)
- **Database:** PostgreSQL (hosted on [Neon](https://neon.tech/))
- **Version Control:** [simple-git](https://github.com/steveukx/git-js)
- **Security:** [Docker](https://www.docker.com/) for executing untrusted user code safely

---

## 🔐 Authentication System

- User sessions are preserved using **session storage** in the browser.
- This solves the issue of **losing user context after page refresh** in single-page applications.

---

## 🗄️ Database

- **PostgreSQL** is used for storing user and team data.
- Data is managed using **Sequelize** ORM.
- The database is hosted on **Neon** for scalability and ease of use.

### Main Tables:
- `Users`
- `Teams`

---

## 💾 Code Storage & Git Integration

- Users write code in a Monaco editor.
- Submitted code is:
  - Stored in the backend under `repos/<team-name>/`
  - Managed using Git via `simple-git`

### Git Features:

- Every submission creates a new **Git commit**
- On the frontend, users can:
  - Select from a list of commits (versions)
  - Load any past version back into the editor

---

## 🧠 Match Execution System

### ✅ Primary Matches (vs Bot)

- Run securely in **Docker containers**
- Prevents malicious code from harming the host server
- Logic handled by:
  - `run_primary_match.py`
  - `engine/run_match.py`
  - `engine1.py`

### ⚔️ Personal Challenges (Team vs Team)

- A team can challenge another team
- Server executes the match logic between both
- Result is saved as a **CSV file**
- CSV is sent to the frontend for **download**

---

## 📁 Backend Folder Structure

```plaintext
backend/
├── engine/
│   ├── run_match.py
│   └── engine1.py
├── run_primary_match.py
├── repos/               # Code files stored here by team
├── controllers/
├── models/
├── routes/
├── database/
├── middleware/
└── server.js
