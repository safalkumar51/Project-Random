# 🖥️ Project Random  - Backend

Welcome to **Project Random Features** — a **Node.js REST API** designed to power the mobile frontend.  
Built for **scalability, reliability, and developer productivity**.

---

## 🌟 Key Features

### 🚀 RESTful API
* Provides robust endpoints for frontend consumption.

### 🗃️ Centralized Data Management
* Handles data storage and retrieval efficiently.

### 🧹 Developer Experience
* **ESLint + Prettier** for code quality and formatting.  
* **Unit & integration tests** powered by Jest or Mocha.

---

## ⚙️ Tech Stack

### 🧩 Core
* 🟩 **Node.js** – JavaScript runtime
* 🛣️ **Express** – Web framework

### 🗄️ Database
*  🟦 MongoDB 

### 🧪 Testing
* Jest / Mocha – Testing framework

### 🧹 Code Quality
* ESLint + Prettier – Linting & formatting

---

## 🛠 How to Run Locally

### 1. Clone the Repo
```bash
git clone https://github.com/safalkumar51/Project-Random
cd Project-Random
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your configuration:
```
PORT=4000
DB_URL=<your-database-url>
JWT_SECRET=<your-secret>
```

### 4. Run the Server
```bash
npm start
```

### 🧪 Testing
Run test cases with:
```bash
npm test
```

## 📂 Project Structure
```
backend/
│── src/              # Main source code
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   └── utils/        # Utility functions
│
│── tests/            # Unit & integration tests
│── app.js            # Express app entry
│── server.js         # Server bootstrap
│── package.json      # Dependencies & scripts
│── .env.example      # Example environment config
```

## 📖 Available Scripts

- `npm start` – Start the server
- `npm run dev` – Start server with nodemon (hot reload)
- `npm test` – Run Jest/Mocha tests
- `npm run lint` – Run ESLint

---

## 🤝 Contribution

Contributions are welcome! 🎉  
Please follow the existing code style and ensure tests are added for new features.

---

## 📜 License

This project is licensed under the MIT License.

---

## ⭐ Show Your Support

If you find this helpful, give it a ⭐ on GitHub, share it with friends, or contribute to the codebase.  
Your support helps the project grow! 🚀
