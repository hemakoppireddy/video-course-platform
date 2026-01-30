# Video Course Platform

A multi-page, frontend-only video course platform built with React.  
This project demonstrates media playback, progress tracking, timestamped notes, local data persistence, PDF certificate generation, and full Docker containerization.

---

##  Features

- **Course Catalog**
  - Displays all available courses from static JSON
  - Real-time search filter
  - Thumbnail previews for each course

- **Course Detail Page**
  - Course description and lesson list
  - Live progress tracking with progress bar
  - Certificate unlock at 100% completion

- **Video Player**
  - Resume playback from last saved position
  - Timestamped notes
  - Auto next-lesson navigation
  - Keyboard shortcuts:
    - `Space` → Play/Pause
    - `M` → Mute/Unmute

- **Data Persistence**
  - Progress and notes stored in browser Local Storage
  - Resume learning across sessions

- **Certificate Generator**
  - Generates a downloadable PDF certificate on course completion

- **Containerized Deployment**
  - Fully Dockerized
  - Runs with a single `docker-compose up --build` command

---

##  Tech Stack

- **Frontend:** React (Vite)
- **Routing:** React Router
- **State Management:** Zustand
- **Storage:** Browser Local Storage
- **Video:** HTML5 `<video>` API
- **PDF Generation:** Browser-based PDF export
- **Containerization:** Docker & Docker Compose

---

##  Project Structure

```

video-course-platform/
├── public/
│   ├── api/
│   │   ├── courses.json
│   │   ├── course_1.json
│   │   └── course_2.json
│   ├── videos/
│   └── images/
├── src/
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   ├── CourseDetail.jsx
│   │   └── VideoPlayer.jsx
│   ├── components/
│   │   └── LessonList.jsx
│   ├── store/
│   │   └── useProgressStore.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── styles/
│   ├── utils/
│   │   └── certificate.js
│   ├── App.jsx
│   └── main.jsx
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md

``

---

##  Environment Variables

The project includes a template file:

### `.env.example`
```env
PORT=3000
NODE_ENV=production
````

---

##  Running Locally (Without Docker)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

##  Running with Docker (Recommended)

Make sure Docker Desktop is running.

### Build and start the application

```bash
docker-compose up --build
```

Open in browser:

```
http://localhost:3000
```

---

##  Verification & Testing

### Check Video Player Controls

Open browser console:

```js
window.videoPlayer.togglePlay()
window.videoPlayer.toggleMute()
window.videoPlayer.isPlaying()
window.videoPlayer.isMuted()
```

### Force Course Completion (for testing certificate)

```js
localStorage.setItem("progress-1-101", "58")
localStorage.setItem("progress-1-102", "59")
```

Then open:

```
/courses/1
```

### Test Certificate Generator

```js
window.generateCertificate("Introduction to React", "Test User")
```

---

##  Completion Logic

* Each lesson is assumed to be **60 seconds**
* A lesson is marked complete at **≥ 95% (57 seconds)**
* Course completion is calculated based on completed lessons
* Certificate unlocks at **100% course completion**

---

##  Notes

* This is a **frontend-only application**
* All course data is served from static JSON files
* No backend or database is required
* User progress and notes persist via browser Local Storage

---

##  Architecture Overview

* **Pages** handle routing and layout
* **Components** handle reusable UI elements
* **Zustand Store** centralizes progress and notes logic
* **Hooks** abstract Local Storage interactions
* **Utils** handle PDF certificate generation
* **Docker** ensures reproducible production builds
