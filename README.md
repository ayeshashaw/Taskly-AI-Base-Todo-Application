# 📝 Taskly AI Base Todo Application

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.2-646cff?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ecf8e?style=for-the-badge&logo=supabase)
![AI Powered](https://img.shields.io/badge/AI-Gemini-4285f4?style=for-the-badge&logo=google)

A modern, AI-powered task management application with intelligent task suggestions, real-time analytics, and seamless user experience.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🤖 AI-Powered Task Generation
- **Smart Suggestions**: Enter a goal and get 3-5 AI-generated task breakdowns
- **Detailed Descriptions**: Each suggestion includes both title and description
- **Instant Integration**: Click any suggestion to auto-fill your task form

### 📊 Comprehensive Task Management
- **Task Board**: Kanban-style visualization with drag-and-drop support
- **Status Tracking**: Monitor tasks across Not Started, In Progress, and Completed states
- **Activity Analytics**: Weekly activity charts with color-coded status indicators
- **Calendar View**: Visual timeline of all your tasks

### 🔐 Secure Authentication
- **User Registration & Login**: Powered by Supabase authentication
- **Protected Routes**: Secure access to dashboard and task management
- **Session Management**: Persistent login with automatic token refresh

### 🌍 Internationalization
- **Multi-Language Support**: Currently supports English and Hindi
- **Easy Language Switching**: Toggle between languages with a single click
- **Fully Translated UI**: All interface elements adapt to selected language

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and hover effects
- **Intuitive Interface**: Clean, modern design with excellent usability

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, React Router DOM, React Datepicker |
| **State Management** | React Context API |
| **Backend Services** | Supabase (Auth + Database) |
| **AI Integration** | Google Gemini API |
| **Internationalization** | react-i18next |
| **Build Tool** | Vite |
| **Styling** | CSS3 with modern features |

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google Gemini API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/todo-application.git
cd todo-application
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### Getting Your API Keys:

**Supabase:**
1. Visit [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy your Project URL and anon/public key

**Google Gemini:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the generated key

### Step 4: Database Setup
Run the following SQL in your Supabase SQL editor:

```sql
-- Create todos table
create table todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text default 'not_started',
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on todos for delete
  using (auth.uid() = user_id);
```

### Step 5: Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📖 Usage

### Getting Started

1. **Create an Account**
   - Navigate to the registration page
   - Enter your email and password
   - Verify your email (if required by Supabase settings)

2. **Login**
   - Use your credentials to access the dashboard
   - Your session will persist across browser refreshes

3. **Add Tasks**
   - Click "Add Task" in the sidebar
   - Enter a task title (e.g., "Learn React")
   - Wait for AI suggestions to appear below the title field
   - Click any suggestion to auto-fill the form, or continue manually
   - Set due date and status
   - Click "Save Task"

4. **Manage Tasks**
   - View all tasks in the Task Board
   - Drag tasks between status columns
   - Click to edit or delete tasks
   - Track your progress in the Activity Widget

5. **Language Switching**
   - Click the language switcher in the top-right corner
   - Choose between English and Hindi

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AddTask.jsx     # Task creation form with AI suggestions
│   ├── TaskBoard.jsx   # Kanban board view
│   ├── ActivityWidget.jsx  # Weekly activity chart
│   ├── CalendarWidget.jsx  # Calendar view
│   └── Sidebar.jsx     # Navigation sidebar
├── pages/              # Route-level components
│   ├── Dashboard.jsx   # Main dashboard page
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   └── Register.jsx    # Registration page
├── context/            # React Context providers
│   └── TodoContext.jsx # Global todo state management
├── utils/              # Utility functions
│   └── taskGenerator.js # AI task generation logic
├── database/           # Database configuration
│   └── superbaseClient.js # Supabase client setup
├── locales/            # Translation files
│   ├── en/            # English translations
│   └── hi/            # Hindi translations
└── App.jsx            # Root component with routing
```

---

## 🎯 Key Features Explained

### AI Task Generator
The AI task generator uses Google's Gemini API to break down goals into actionable tasks:

```javascript
// Example: Enter "Build a portfolio website"
// AI generates:
[
  {
    title: "Design website layout and structure",
    description: "Create wireframes and decide on sections..."
  },
  {
    title: "Set up development environment",
    description: "Install necessary tools and frameworks..."
  },
  // ... more suggestions
]
```

### Activity Tracking
Visual analytics showing:
- Tasks completed per day over the last 7 days
- Color-coded status breakdown
- Today's activity summary
- Weekly trends

### Protected Routes
Routes automatically redirect unauthenticated users to the login page, ensuring secure access to your personal tasks.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI task generation
- [Vite](https://vitejs.dev/) - Build tool
- [react-i18next](https://react.i18next.com/) - Internationalization

---

<div align="center">

Made with ❤️ by [Your Name]

[⬆ Back to Top](#-smart-todo-application)

</div>
