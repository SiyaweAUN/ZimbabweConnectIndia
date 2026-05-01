# 🎓 ZimbabweConnectIndia

> The premier platform helping Zimbabwean students apply to study in India with **up to 75% scholarship** opportunities.

---

## 🌍 Overview

**ZimbabweConnectIndia** is a full-stack web application that bridges talented Zimbabwean students with top Indian universities. It provides scholarship matching, application tracking, document management, and admin tools — all in one professional platform.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🏠 **Home Page** | Hero section, benefits, university showcase, CTA |
| ℹ️ **About Page** | Mission, team, application process, partner universities |
| 🔐 **Auth System** | JWT-based register/login with bcrypt hashing |
| 🎓 **Student Dashboard** | Profile, applications, scholarship tracking |
| 🛡️ **Admin Dashboard** | Manage applicants, approve/reject, scholarships, messages |
| 💬 **Contact Page** | Form, WhatsApp button, social links, FAQ |
| 🏆 **Scholarships** | Browsable, filterable scholarship listings |
| 🌙 **Dark Mode** | Full dark/light theme support |
| 📱 **Responsive** | Mobile-first, works on all screen sizes |

---

## 🛠️ Tech Stack

```
Frontend:   React 18 · Tailwind CSS · React Router v6 · React Hook Form · Framer Motion
Backend:    Node.js · Express.js · MongoDB (Mongoose) · JWT · bcryptjs
Security:   Helmet · CORS · Rate Limiting · Input Validation (express-validator)
DevOps:     Docker · Docker Compose · nginx
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v18+ 
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Install

```bash
git clone https://github.com/your-repo/ZimbabweConnectIndia.git
cd ZimbabweConnectIndia
```

**Backend setup:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
```

**Frontend setup:**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your values
```

---

### 2. Configure Environment Variables

**`backend/.env`** — minimum required:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/zimbabwe_connect_india
JWT_SECRET=your_super_secret_key_at_least_32_chars_long
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
ADMIN_SECRET=your_admin_registration_secret
```

**`frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### 3. Seed the Database

```bash
cd backend
node config/seed.js
```

This creates:
- 4 sample scholarships (including featured ones)
- Admin account: `admin@zimbabweconnectindia.com` / `Admin@1234`
- Test student: `student@test.com` / `Student@1234`

---

### 4. Start Both Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev      # with nodemon (auto-restart)
# or
npm start        # production mode
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

Open **http://localhost:3000** 🎉

---

## 🐳 Docker Compose (Recommended)

Run the entire stack with one command:

```bash
# From the project root
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| MongoDB | localhost:27017 |

To stop:
```bash
docker-compose down
```

To reset all data:
```bash
docker-compose down -v
```

---

## ☁️ GitHub + Vercel Deployment

### 1) Initialize Git and push to GitHub

From project root:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

> If your repo already exists locally as a Git repo, skip `git init` and just set/update `origin`.

---

### 2) Deploy Backend API (required first)

This app is full-stack. Vercel will host the React frontend, but the Express API should be deployed separately (Render, Railway, Fly.io, or your VPS).

Use backend environment variables:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<strong_secret_32+_chars>
JWT_EXPIRE=7d
CLIENT_URL=https://<your-frontend-domain>.vercel.app
ADMIN_SECRET=<your_admin_secret>
NODE_ENV=production
```

After backend deploy, copy your API base URL (example: `https://zci-api.onrender.com/api`).

---

### 3) Deploy Frontend on Vercel

1. Import your GitHub repo in Vercel.
2. In project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
3. Add environment variable in Vercel:

```env
REACT_APP_API_URL=https://<your-backend-domain>/api
```

4. Deploy.

---

### 4) Final production checks

- Open frontend URL and verify login/register/contact.
- Confirm backend CORS `CLIENT_URL` exactly matches your Vercel domain.
- Seed production DB if needed:

```bash
cd backend
node config/seed.js
```

---

## 📁 Project Structure

```
ZimbabweConnectIndia/
├── backend/
│   ├── config/
│   │   └── seed.js              # Database seeder
│   ├── middleware/
│   │   └── auth.js              # JWT protect + restrict middleware
│   ├── models/
│   │   ├── User.js              # Student & Admin model
│   │   ├── Application.js       # Application model
│   │   └── Scholarship.js       # Scholarship + ContactMessage models
│   ├── routes/
│   │   ├── auth.js              # Register, login, profile
│   │   ├── users.js             # Student profile management
│   │   ├── applications.js      # Application CRUD
│   │   ├── scholarships.js      # Public scholarship listing
│   │   ├── contact.js           # Contact form submission
│   │   └── admin.js             # Full admin management
│   ├── uploads/                 # Uploaded documents (gitignored)
│   ├── server.js                # Express app entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js        # Sticky nav with dark mode toggle
│   │   │   └── Footer.js        # Full footer with links
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Global auth state
│   │   │   └── ThemeContext.js  # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Home.js          # Landing page
│   │   │   ├── About.js         # About us
│   │   │   ├── Login.js         # Sign in
│   │   │   ├── Register.js      # Sign up with password strength
│   │   │   ├── Dashboard.js     # Student dashboard
│   │   │   ├── AdminDashboard.js # Admin panel
│   │   │   ├── Scholarships.js  # Browse scholarships
│   │   │   ├── Contact.js       # Contact + WhatsApp
│   │   │   └── NotFound.js      # 404 page
│   │   ├── utils/
│   │   │   └── api.js           # Axios instance with JWT interceptor
│   │   ├── App.js               # Routes + auth guards
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Tailwind + custom CSS
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new student | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/auth/me` | Get current user | 🔒 JWT |
| PUT | `/api/auth/profile` | Update profile | 🔒 JWT |
| POST | `/api/auth/change-password` | Change password | 🔒 JWT |

### Applications
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/applications` | List own applications | 🔒 Student |
| POST | `/api/applications` | Create application | 🔒 Student |
| GET | `/api/applications/:id` | Get single application | 🔒 Student |
| PUT | `/api/applications/:id` | Update draft | 🔒 Student |
| POST | `/api/applications/:id/submit` | Submit application | 🔒 Student |
| DELETE | `/api/applications/:id` | Delete draft | 🔒 Student |

### Scholarships (Public)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/scholarships` | List active scholarships | Public |
| GET | `/api/scholarships/:id` | Get scholarship | Public |

### Contact
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact` | Submit contact message | Public |

### Admin (admin role required)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/students` | List all students |
| GET | `/api/admin/applications` | List all applications |
| PATCH | `/api/admin/applications/:id/status` | Update application status |
| GET | `/api/admin/scholarships` | List all scholarships |
| POST | `/api/admin/scholarships` | Create scholarship |
| PUT | `/api/admin/scholarships/:id` | Update scholarship |
| DELETE | `/api/admin/scholarships/:id` | Delete scholarship |
| GET | `/api/admin/messages` | List contact messages |
| PATCH | `/api/admin/messages/:id/reply` | Reply to message |

---

## 🗄️ Database Models

### User
```
firstName, lastName, email, password (bcrypt), phone, role (student|admin),
dateOfBirth, nationality, passportNumber, highSchool, highSchoolGrade,
preferredCourse, preferredUniversity, englishProficiency, documents{}, 
isActive, isVerified, lastLogin
```

### Application
```
student (ref), scholarship (ref), targetUniversity, targetCourse, targetDegree,
intakeYear, intakeSemester, status (draft→submitted→under_review→approved|rejected|...),
scholarshipStatus, scholarshipPercentage, documents{}, adminNotes[], 
studentNotes, applicationNumber (auto: ZCI-2025-00001)
```

### Scholarship
```
name, description, university, coveragePercentage, coverageType,
eligibilityCriteria[], requiredDocuments[], courses[], degreeLevel[],
availableSlots, filledSlots, deadline, isActive, isFeatured
```

### ContactMessage
```
name, email, phone, subject, message, category, status (new|read|replied),
adminReply{ message, repliedBy, repliedAt }, ipAddress
```

---

## 🔐 Security Features

- ✅ Passwords hashed with **bcrypt** (12 salt rounds)
- ✅ **JWT** tokens with configurable expiry
- ✅ **Helmet** HTTP security headers
- ✅ **Rate limiting** on all API routes (100/15min) and auth routes (20/15min)
- ✅ **CORS** restricted to configured client URL
- ✅ **Input validation** via express-validator on all POST/PUT routes
- ✅ **Role-based access control** (student vs admin)
- ✅ Password never returned in API responses (`select: false`)
- ✅ Auto-logout on 401 responses (expired/invalid token)

---

## 📞 Default Contact Info

Update these in `backend/.env` and `frontend/.env`:
- WhatsApp: `+263 78 906 0918`
- Email: `info@zimbabweconnectindia.com`
- Offices: Harare, Zimbabwe & New Delhi, India

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © ZimbabweConnectIndia

---

> Built with ❤️ to connect Zimbabwe 🇿🇼 and India 🇮🇳 through education.
