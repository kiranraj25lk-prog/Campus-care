# CampusCare – College Complaint Management System

An institutional full-stack web application designed for engineering colleges and university campuses to streamline student grievance redressal. Connects students directly with campus maintenance, IT networking, hostel management, and academic administration with real-time tracking, department routing, and analytical oversight.

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Recharts, Lucide React
- **Backend:** Node.js, Express REST API
- **Database:** SQLite (embedded via `better-sqlite3` for zero-setup execution)
- **Authentication:** Role-Based Access Control (Student, Admin) with JSON Web Tokens (JWT) and bcrypt password hashing
- **File Uploads:** Multer for optional photographic complaint evidence stored in `/server/uploads`

---

## 🎨 Design System

- **Sidebar Theme:** Dark navy (`#0B1F3A`)
- **Active Navigation & Primary Action Buttons:** Cobalt blue (`#1D63E9`)
- **Card Styling:** White `rounded-xl` cards with soft shadows (`shadow-soft`)
- **Page Background:** Light gray (`#F3F5F9`)
- **Typography:** Inter (`font-sans`)
- **Status Badges:**
  - `Pending`: Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - `In Progress`: Blue (`bg-blue-50 text-blue-700 border-blue-200`)
  - `Resolved`: Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
- **Priority Badges:**
  - `High`: Red (`bg-rose-50 text-rose-700 border-rose-200`)
  - `Medium`: Amber (`bg-amber-50 text-amber-700 border-amber-200`)
  - `Low`: Slate / Gray (`bg-slate-100 text-slate-700 border-slate-200`)
- **Design Principles:**
  - Rectangular buttons (`rounded-lg`, no pill-shaped buttons)
  - No purple gradients or distracting cursor animations
  - Real campus copy and authentic university administrative terminology
  - Verified SVG favicon and connected institution domain metadata (`campuscare.edu`)
  - Dedicated Privacy Policy and Terms & Conditions pages

---

## 👥 Demo Login Credentials

The system includes pre-seeded accounts and realistic campus complaints across multiple departments:

| Role | Name | Email Address | Password | Branch / Division |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Dr. Arvind Sharma | `admin@campuscare.edu` | `Admin@123` | Grievance Redressal Committee |
| **Student** | Kiran Kumar | `kiran@student.college.edu` | `Student@123` | Computer Science (6th Sem) |
| **Student** | Rahul S | `rahul@student.college.edu` | `Student@123` | Electronics & Comm. (4th Sem) |
| **Student** | Ananya | `ananya@student.college.edu` | `Student@123` | Information Science (6th Sem) |
| **Student** | Suman | `suman@student.college.edu` | `Student@123` | Mechanical Engg. (8th Sem) |
| **Student** | Vivek | `vivek@student.college.edu` | `Student@123` | Civil Engineering (4th Sem) |
| **Student** | Priya | `priya@student.college.edu` | `Student@123` | Electrical & Electronics (2nd Sem) |

*Tip: The login page includes instant **"Student Demo"** and **"Admin Demo"** quick-fill buttons for one-click access.*

---

## 📱 Page & Screen Overview

1. **Public Landing Page (`/`)**
   - Institutional header with logo, navigation links, and login/register actions.
   - Hero section with campus architecture overlay and headline: *"Raise Your Concern, Make a Better Campus"*.
   - 4 Feature cards: **Submit Complaint**, **Track Status**, **Quick Resolution**, and **Better Campus**.
   - Grievance Redressal process walkthrough, Service Level Agreement (SLA) targets, FAQ accordion, and campus contact details.
   - Comprehensive footer with institutional notices, Privacy Policy, and Terms links.

2. **Student Dashboard (`/student/dashboard`)**
   - Dark navy sidebar (`#0B1F3A`) collapsing into a hamburger drawer on mobile.
   - Top bar with notification bell (interactive dropdown with unread badges) and user chip (Name, Branch, Semester).
   - Welcome banner and 4 Stat Cards (**Total Complaints**, **Pending Review**, **In Progress**, **Resolved**).
   - Recent Complaints table (ID, Title, Category, Date, Status, View Action) with "View All" link.

3. **Submit New Complaint (`/student/new-complaint`)**
   - Title input with character validation.
   - Category dropdown: *Classroom, Hostel, Wi-Fi/Network, Canteen, Electrical, Plumbing, Academic/Faculty, Other*.
   - Detailed description textarea.
   - Priority selection (*Low, Medium, High*, defaults to Medium).
   - Optional photo upload with client-side preview and Multer storage.
   - Auto-generated Complaint ID (`C1001`, `C1002`, `C1023`...) and timestamp in `DD-MM-YYYY` format.

4. **My Complaints (`/student/complaints`)**
   - Filter tabs: **All**, **Pending**, **In Progress**, and **Resolved** with real-time ticket counters.
   - Real-time search bar (by complaint ID, title, or category).
   - Detailed modal viewing full description, uploaded image, 3-step status timeline tracker, and official administrative remarks.
   - Student withdraw/delete capability for Pending tickets.

5. **Admin Dashboard (`/admin/dashboard`)**
   - 4 Stat Cards: Total Complaints, Pending Review, In Progress, Resolved.
   - **Complaints by Category** Recharts Pie Chart with customized palette.
   - **Monthly Complaints** Recharts Bar Chart comparing monthly logged volume vs. resolved tickets.
   - Recent grievances table with quick review action.

6. **Admin – All Complaints Management (`/admin/complaints`)**
   - Filter controls: Status, Category, Priority, and Department.
   - Search bar across Complaint ID, Title, or Student Name.
   - **"Assign Complaint"** quick modal for direct departmental routing.
   - Management modal: change status, assign department, and record official administrative remarks.

7. **Departments Management (`/admin/departments`)**
   - Cards displaying workload, officer in charge, and pending/resolved counts.
   - Add new department modal.

8. **Campus User Directory (`/admin/users`)**
   - Verified student directory with branch filters, role indicators, and complaint filing metrics.

9. **Reports & Audit (`/admin/reports`)**
   - SLA clearance percentage, average turnaround time (38.4h), and department breakdown.
   - One-click **Export Full Report (CSV)** download.

10. **Institutional Policies**
    - **Privacy Policy (`/privacy`)**: Student records confidentiality and data retention guidelines.
    - **Terms & Conditions (`/terms`)**: Acceptable use policy and disciplinary regulations against false reporting.

---

## 🚀 Running the Project

### Prerequisites
Node.js (v18 or higher) and npm installed.

### 1. Database Setup & Seeding
```bash
cd server
npm run seed
```
*Seeds the SQLite database with 1 administrator, 6 students, 4 departments, ~22 complaints, and notifications.*

### 2. Start the Backend API
```bash
cd server
npm start
```
*Server starts on `http://localhost:5001`.*

### 3. Start the Frontend Client
```bash
cd client
npm run dev
```
*Vite development server runs on `http://localhost:3000` with API proxying.*

### 4. Direct Production Run (Both Frontend & Backend on Port 5001)
```bash
cd client && npm run build
cd ../server && npm start
```
*Open `http://localhost:5001` in your browser.*

---

## 📂 Project Directory Structure

```
campuscare/
├── package.json
├── .env.example
├── README.md
├── server/
│   ├── package.json
│   ├── .env
│   ├── uploads/                # Multer image storage
│   ├── campuscare.sqlite       # SQLite database file
│   └── src/
│       ├── config.js
│       ├── server.js           # Express app & static client serving
│       ├── db/
│       │   ├── index.js        # SQLite tables & ID generator (C1001...)
│       │   └── seed.js         # Rich initial dataset
│       ├── middleware/
│       │   ├── auth.js         # JWT verification & role guards
│       │   └── upload.js       # Multer file storage
│       ├── routes/
│       │   ├── auth.js         # Login, register, profile
│       │   ├── complaints.js   # Complaint CRUD, status, assignment
│       │   ├── departments.js  # Campus departments
│       │   ├── users.js        # User directory
│       │   ├── stats.js        # Overview, category pie, monthly bar
│       │   └── notifications.js # Notifications and mark read
│       └── utils/
│           └── date.js         # DD-MM-YYYY formatters
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── public/
    │   └── favicon.svg         # College shield favicon
    └── src/
        ├── main.jsx
        ├── App.jsx             # Router and auth guards
        ├── index.css
        ├── api/client.js       # Fetch client with token header
        ├── context/
        │   ├── AuthContext.jsx
        │   └── ToastContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Sidebar.jsx     # Navy #0B1F3A sidebar
        │   ├── Topbar.jsx      # Notifications & user chip
        │   ├── StatCard.jsx
        │   ├── StatusBadge.jsx
        │   ├── PriorityBadge.jsx
        │   └── Modal.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── PrivacyPolicyPage.jsx
            ├── TermsPage.jsx
            ├── student/
            │   ├── StudentDashboard.jsx
            │   ├── NewComplaintPage.jsx
            │   ├── MyComplaintsPage.jsx
            │   └── StudentProfilePage.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AllComplaintsPage.jsx
                ├── DepartmentsPage.jsx
                ├── UsersPage.jsx
                └── ReportsPage.jsx
```
