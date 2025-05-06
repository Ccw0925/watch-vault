# Go + Next.js + SQLite Template

A modern full-stack web application boilerplate combining:

- **Go** (Golang) for backend APIs
- **Next.js** (React) for frontend
- **SQLite** for simple, file-based persistence
- **TanStack React Query** for frontend data fetching and caching
- **ShadCN UI** for styled, accessible React components

## 🔧 Tech Stack

| Layer     | Technology               |
|-----------|--------------------------|
| Backend   | Go                       |
| Frontend  | Next.js (React 18+)      |
| Database  | SQLite                   |
| UI Kit    | ShadCN UI                |
| Data Sync | TanStack React Query     |

## 🗂 Project Structure

project-root/
├── backend/ # Go backend (API, DB models, etc.)
├── frontend/ # Next.js frontend app
└── README.md

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Setup the Backend (Go)
```bash
cd backend
go mod tidy
go run main.go
```
### 3. Setup the Frontend (Next.js)
```bash
cd ../frontend
yarn
yarn dev
```

## 🙌 Acknowledgements

- [Go](https://go.dev/)
- [Next.js](https://nextjs.org/)
- [TanStack Query](https://tanstack.com/query)
- [ShadCN UI](https://ui.shadcn.com/)
- [SQLite](https://github.com/mattn/go-sqlite3)
