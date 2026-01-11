# Montra - Student Finance Application

![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge) ![Version](https://img.shields.io/badge/Version-v1.2.0-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

> **Montra** is a sophisticated, full-featured financial tracking platform engineered specifically for the student demographic. Recognizing the unique financial challenges faced by students such as irregular income, tight budget constraints, and the need for long-term savings planning—Montra provides a robust solution to master personal finance.
>

---

## Project Overview

| Property | Details |
| :--- | :--- |
| **Project Name** | Montra Student Finance |
| **Development Status** | Stable Release |
| **Primary Stack** | React, TypeScript, Vite, Firebase |
| **Styling Architecture** | Tailwind CSS |
| **Current Version** | v1.2.0 |

---

## Application Features

The following modules are implemented to support financial management and data analysis.

| Feature | Description | Status |
| :--- | :--- | :--- |
| **Dashboard** | Provides a high-level overview of financial metrics, including recent activity and balance summaries. | ![Stable](https://img.shields.io/badge/status-Stable-success?style=flat-square) |
| **Budgets** | Enables users to define and monitor monthly spending limits to ensure financial discipline. | ![Stable](https://img.shields.io/badge/status-Stable-success?style=flat-square) |
| **Goals** | Facilitates the creation and tracking of specific savings targets. | ![Stable](https://img.shields.io/badge/status-Stable-success?style=flat-square) |
| **Transactions** | Maintains a comprehensive ledger of all income and expenditure events with categorization. | ![Stable](https://img.shields.io/badge/status-Stable-success?style=flat-square) |
| **Authentication** | Secure identity management (Sign Up/Login) integrated with Firebase Authentication. | ![Stable](https://img.shields.io/badge/status-Stable-success?style=flat-square) |
| **Settings** | Configuration interface for user preferences and account management. | ![In Progress](https://img.shields.io/badge/status-In_Development-orange?style=flat-square) |

---

## Technology Stack

The project leverages a modern, component-based architecture to ensure performance and maintainability.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)

| Category | Technology | Usage Context |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Core library for constructing the user interface. |
| **Build System** | **Vite** | Next-generation frontend tooling for rapid development and optimized builds. |
| **Language** | **TypeScript** | Statically typed superset of JavaScript for enhanced code reliability. |
| **Styling** | **Tailwind CSS** | Utility-first framework for responsive and consistent design systems. |
| **Iconography** | **Lucide React** | Scalable vector icons for interface elements. |
| **Backend / Auth** | **Firebase** | Backend-as-a-Service providing authentication and Firestore database connectivity. |
| **Data Visualization** | **Recharts** | Library for rendering composable charts within React components. |
| **Routing** | **React Router** | Client-side routing for seamless navigation. |

---

## Project Structure

```bash
Montra/
├── frontend/                  # Main Client Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── contexts/          # Global state management
│   │   ├── pages/             # Route-level components (Views)
│   │   │   ├── Auth.tsx       # Authentication forms
│   │   │   ├── Dashboard.tsx  # Main user dashboard
│   │   │   └── ...
│   │   ├── services/          # Firebase service integrations
│   │   ├── App.tsx            # Main Application entry point
│   │   └── main.tsx           # DOM renderer
│   ├── tailwind.config.js     # Styling configuration
│   └── vite.config.ts         # Build configuration
├── backend/                   # Cloud Functions (Reserved)
└── db/                        # Database Schema Documentation
```

---

## Getting Started

Instructions for setting up the development environment and running the application locally.

### 1. Prerequisites
*   **Node.js**: Latest Long Term Support (LTS) version.
*   **npm**: Node Package Manager (included with Node.js).

### 2. Installation

| Step | Action | Command |
| :--- | :--- | :--- |
| **1. Clone** | Retrieve the repository. | `git clone <repository-url>` |
| **2. Navigate** | Enter the project directory. | `cd frontend` |
| **3. Install** | Install dependencies. | `npm install` |

### 3. Development Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the local development server at `http://localhost:5173`. |
| `npm run build` | Compiles the application for production deployment. |
| `npm run preview` | Serves the production build locally for testing. |

---


