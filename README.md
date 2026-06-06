# TaskFlow - MERN Stack CI/CD Learning Project

TaskFlow is a simple task management web application designed to demonstrate the setup and usage of **GitHub Actions** for Continuous Integration (CI) and Continuous Delivery/Deployment (CD) pipelines.

## Project Structure

```text
mern-pipeline-app/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow configuration
├── client/                     # Frontend (React + Vite + TypeScript)
│   ├── src/                    # React components, styles, and logic
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── models/                 # Mongoose models (Task.js)
│   ├── routes/                 # Express API routes (tasks.js)
│   ├── tests/                  # Integration tests (Jest + Supertest)
│   ├── app.js                  # Main Express app configuration
│   ├── server.js               # Express listener entry point
│   └── package.json
└── README.md                   # This documentation
```

---

## Local Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (running locally or a MongoDB Atlas URI)

### Running the Backend (`server/`)
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   ```
4. Start the backend:
   - Development mode (with nodemon): `npm run dev`
   - Production mode: `npm start`
   - Run linter: `npm run lint`
   - Run tests: `npm run test`

### Running the Frontend (`client/`)
1. Navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Run tests:
   ```bash
   npm run test
   ```

---

## Understanding the CI/CD Pipeline

The GitHub Actions CI/CD pipeline is defined in [ci.yml](file:///.github/workflows/ci.yml). It executes automatically whenever code is pushed to the `main` branch or a Pull Request (PR) is created.

### Pipeline Stages

1. **Checkout Code**: Retrieves the repository code from GitHub.
2. **Setup Node.js**: Installs the specified version of Node.js.
3. **Backend CI Job**:
   - Installs server dependencies (`npm ci`).
   - Runs linter checks (`npm run lint`).
   - Executes backend unit/integration tests (`npm run test`).
4. **Frontend CI Job**:
   - Installs client dependencies (`npm ci`).
   - Runs frontend linter checks.
   - Executes frontend unit tests (`npm run test`).
   - Verifies the production build compiles (`npm run build`).

### How to Test the Pipeline in GitHub
To see the CI/CD pipeline in action on your own GitHub account:
1. Create a new, blank repository on [GitHub](https://github.com).
2. Initialize Git in this project directory:
   ```bash
   git init
   ```
3. Add files and commit:
   ```bash
   git add .
   git commit -m "feat: initial commit with MERN stack and CI/CD"
   ```
4. Rename default branch to `main`:
   ```bash
   git branch -M main
   ```
5. Link your local repo to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   ```
6. Push to GitHub:
   ```bash
   git push -u origin main
   ```
7. Visit the **Actions** tab in your GitHub repository to see the pipeline running!
