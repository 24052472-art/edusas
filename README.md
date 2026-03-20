# EduHub — Academic Knowledge Platform

A production-ready SaaS platform for structured academic content sharing, built with Next.js 15, Firebase, Tailwind CSS, and Framer Motion.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Copy `.env.local.example` to `.env.local` and fill in your Firebase project credentials:

```bash
cp .env.local .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket name |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Accessing Each Role

EduHub has four roles: **Student**, **Teacher**, **Admin**, and **Super Admin**.

### Flow for new users

1. Visit [http://localhost:3000/login](http://localhost:3000/login)
2. Click **Continue with Google** and sign in
3. On the **Onboarding** screen, choose your role:
   - **Student** → redirects to `/student/dashboard`
   - **Teacher** → redirects to `/teacher/dashboard`
   - **Admin** → redirects to `/admin/dashboard`
4. Your role is saved in Firestore and applied on every subsequent login

### Direct dashboard URLs

| Role | Dashboard URL |
|---|---|
| Student | `/student/dashboard` |
| Teacher | `/teacher/dashboard` |
| Admin / Super Admin | `/admin/dashboard` |

> **Note:** All dashboards are protected. Visiting a dashboard URL without being logged in redirects to `/login`. Visiting a dashboard for a different role (e.g. a student visiting `/admin/dashboard`) redirects to the correct dashboard for that user's role.

### Changing a user's role

An Admin can change any user's role from the **Admin Dashboard → Users** tab:

1. Log in as Admin and navigate to `/admin/dashboard`
2. Click the **Users** tab
3. Use the role dropdown next to any user to reassign their role

To promote a user to **Super Admin**, an existing Admin or Super Admin must update that user's Firestore document directly (field `role: "super_admin"`), or use the role dropdown in the Users tab.

---

## 📄 Key Pages

| Page | URL | Access |
|---|---|---|
| Landing / Discovery | `/` | Public |
| Note detail | `/notes/[noteId]` | Public (preview); login to download |
| Login | `/login` | Public |
| Onboarding (role picker) | `/onboarding` | First-time login only |
| Student Dashboard | `/student/dashboard` | Student |
| Teacher Dashboard | `/teacher/dashboard` | Teacher, Admin |
| Teacher Upload | `/teacher/upload` | Teacher, Admin |
| Teacher Profile | `/teacher/profile/[teacherId]` | Public |
| Admin Dashboard | `/admin/dashboard` | Admin, Super Admin |
| Admin — Users | `/admin/users` | Admin, Super Admin |
| Admin — Teachers | `/admin/teachers` | Admin, Super Admin |
| Admin — Moderation | `/admin/moderation` | Admin, Super Admin |
| Admin — Analytics | `/admin/analytics` | Admin, Super Admin |
| Admin — Upload | `/admin/upload` | Admin, Super Admin |

---

## 🏗️ Project Structure

```
edusas/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Landing page, note detail
│   ├── (auth)/             # Login, onboarding
│   ├── (student)/          # Student dashboard
│   ├── (teacher)/          # Teacher dashboard, upload, profile
│   └── (admin)/            # Admin dashboard and sub-pages
├── components/
│   ├── ui/                 # Button, Card, Modal, Badge, etc.
│   ├── layout/             # Navbar, Sidebar, Footer, BottomNav
│   ├── dashboard/          # StudentDashboard, TeacherDashboard, AdminDashboard
│   ├── landing/            # LandingPage, SearchHero, BranchExplorer
│   ├── notes/              # NoteCard, PDFViewer
│   ├── teacher/            # TeacherCard, FollowButton
│   └── notifications/      # NotificationBell, NotificationDropdown
├── services/
│   ├── core/               # firebase.ts, authService.ts, storageService.ts
│   └── modules/            # notesService, usersService, teachersService, …
├── hooks/                  # useAuth, useNotes, useTeachers, useNotifications
├── types/                  # user.ts, note.ts, teacher.ts, branch.ts, …
└── lib/                    # utils.ts, constants.ts, validations.ts
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **State**: React Context + Zustand
