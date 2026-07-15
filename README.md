# Book Store (BookEase) - MERN Stack Project

BookEase is a full-stack online marketplace built using the MERN (MongoDB, Express, React, Node) stack. The platform allows users to browse and purchase books, enables sellers to manage their catalogs and orders, and provides administrators with control panels to manage accounts, listings, and approvals.

---

## Demo Link

* [Demo](https://drive.google.com/file/d/1b87Ve04_jNn7uJ5jZcU0yjocfj7Lz-4x/view?usp=drive_link)

---

## 📂 Project Phase Documents

All development stages and milestones are documented in the [Phase Wise Documents](Phase%20Wise%20Documents) folder. Below are links to the individual deliverables for each phase:

### 💡 Phase 1: Brainstorming & Idea Generation
* [Brainstorming - Idea Generation.pdf](Phase%20Wise%20Documents/Brainstorming%20-%20Idea%20Generation/Brainstorming%20-%20Idea%20Generation.pdf)
* [Define Problem Statements.pdf](Phase%20Wise%20Documents/Brainstorming%20-%20Idea%20Generation/Define%20Problem%20Statements.pdf)
* [Empathy Map Canvas.pdf](Phase%20Wise%20Documents/Brainstorming%20-%20Idea%20Generation/Empathy%20Map%20Canvas.pdf)

### 📋 Phase 2: Requirement Analysis
* [Data Flow Diagrams and User Stories.pdf](Phase%20Wise%20Documents/Requirement%20Analysis/Data%20Flow%20Diagrams%20and%20User%20Stories.pdf)
* [Solution Requirements.pdf](Phase%20Wise%20Documents/Requirement%20Analysis/Solution%20Requirements.pdf)
* [Technology Stack.pdf](Phase%20Wise%20Documents/Requirement%20Analysis/Technology%20Stack.pdf)

### 🗺️ Phase 3: Project Planning
* [Project Planning.pdf](Phase%20Wise%20Documents/Project%20Planning%20Phase/Project%20Planning.pdf)

### 🎨 Phase 4: Project Design
* [Problem - Solution Fit v1.pdf](Phase%20Wise%20Documents/Project%20Design%20Phase/Problem%20-%20Solution%20Fit%20v1.pdf)
* [Proposed Solution.pdf](Phase%20Wise%20Documents/Project%20Design%20Phase/Proposed%20Solution.pdf)
* [Solution Architecture.pdf](Phase%20Wise%20Documents/Project%20Design%20Phase/Solution%20Architecture.pdf)

### ⚙️ Phase 5: Project Development & Testing
* [User Acceptance Testing FSD.pdf](Phase%20Wise%20Documents/Project%20Developement/User%20Acceptance%20Testing%20FSD.pdf)

---

## 📄 Core Documentation
* **Full FSD Project Documentation (PDF)**: [BookStore_Documentation.pdf](BookStore_Documentation.pdf) (The final structured documentation compiling all schemas, structures, routes, and testing plans)
* **Product Requirement Document (PRD)**: [PRD.txt](PRD.txt)
* **Demo Walkthrough Video**: [Demo.mp4](Demo.mp4)

---

## 🛠️ Project Structure
```
BookStore/
├── Backend/               # Node.js + Express.js + Mongoose server
│   ├── config/            # DB Configs
│   ├── controllers/       # MVC Controllers
│   ├── models/            # MongoDB Schemas
│   └── routes/            # REST API Endpoints
├── Frontend/              # React + Vite client
│   ├── src/
│   │   ├── Admin/         # Admin panels
│   │   ├── Seller/        # Seller panels
│   │   └── User/          # Client panels
└── Phase Wise Documents/  # Phase documentation files
```

---

## 🚀 Quick Start Instructions

### Prerequisites
* Node.js (v18 or newer)
* MongoDB (running locally on port `27017`)

### 1. Setup Backend
```bash
cd Backend
npm install
npm run seed  # Seed the initial books database
npm start     # Starts node server on port 4000
```

### 2. Setup Frontend
```bash
cd Frontend
npm install
npm run dev   # Starts Vite server on port 5173
```
Open your browser and navigate to `http://localhost:5173/` to run the application.
