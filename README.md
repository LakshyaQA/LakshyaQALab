# LakshyaQALab — Advanced QA Testing Playground

A robust, industry-grade sandbox designed for practicing manual testing and developing automated test suites. Built with **React 19**, **Vite 8**, and **Tailwind CSS v4**, this playground simulates complex real-world UI scenarios, edge cases, and network failures.

> **Live Production:** [lakshyatesthub.vercel.app](https://lakshyatesthub.vercel.app/)  
> **Target Audience:** SDETs, QA Engineers, and Automation Students.

---

## 🚀 Key Features

### 1. Unified QA Toolbox

A floating overlay (`bottom-right`) persistent across all pages that provides:

- **Acceptance Criteria (AC)**: Detailed business logic and validation rules for the current page.
- **Automation Hub (TS)**: Curated test scenarios (Smoke, Regression, Edge) with `data-testid` selectors.
- **AI Master Prompts**: One-click copy for high-quality Playwright/Cypress script generation.

### 2. Secure Login Flow

- **Validation**: Strict alphanumeric username checks and complex password requirements.
- **Security**: 5-attempt rate limiting with a 30-second lockout timer.
- **Automation-Ready**: Integrates Google reCAPTCHA v2 (test site key) for predictable automation logic.

### 3. Productive Dashboard

- **Data Table**: Server-side mock sorting, pagination, and multi-select.
- **File Upload**: Dropzone with size validation (5MB limit) and progress simulation.
- **God Mode (Control Center)**: Real-time sidebar to toggle **Offline Mode**, **500 Server Errors**, and **Slow 3G Network** (3s delay).

### 4. Chaos Form Builder

A testing "boss level" featuring 5+ selectable chaos modes:

- **Label Swap**: Dynamic visual label changes while maintaining stable `data-testid` attributes.
- **Ghost Field**: Unexpected required fields injected dynamically into the DOM.
- **Field Shuffle**: Random re-ordering of input fields.
- **Infinite Spinner**: Simulates stuck UI states to test timeout handling.

### 5. Automation Sandbox

Specialized widgets for extracting complex data:

- **Product Gallery**: Filterable/sortable list of items with "Out of Stock" logic.
- **Custom Date Picker**: Custom-built calendar widget (no native browser pickers).
- **Advanced Controls**: Multi-tag inputs and range sliders.

---

## 🛠️ Tech Stack

| Category         | Technology                               |
| :--------------- | :--------------------------------------- |
| **Framework**    | React 19 (Latest)                        |
| **Build Tool**   | Vite 8 + Rolldown                        |
| **Styling**      | Tailwind CSS v4 + PostCSS                |
| **State**        | Context API (Auth, Network, Logger)      |
| **Animations**   | Framer Motion (60FPS)                    |
| **Testing Spec** | [Playwright TS](https://playwright.dev/) |

---

## 💻 Local Development

### Prerequisites

- Node.js **v22+**
- npm **v10+**

### Setup Steps

1. **Clone the repo**

   ```bash
   git clone https://github.com/LakshyaQA/LakshyaQALab.git
   cd LakshyaQALab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start Dev Server**
   ```bash
   npm run dev
   ```
   The app will start on [http://localhost:5252](http://localhost:5252).

---

## 🚢 Deployment Strategy

The project is hosted on **Vercel** with a dual-branch strategy:

- **`main`**: Production release ([lakshyatesthub.vercel.app](https://lakshyatesthub.vercel.app/)).
- **`master`**: UAT / Feature preview.

Every push to `main` triggers an automated CI/CD pipeline that builds and verifies the distribution bundle.

---

## 📝 Automation Guidelines

All interactive elements use a strict `data-testid` naming convention:

- Inputs: `[data-testid="login-username"]`
- Buttons: `[data-testid="chaos-submit-btn"]`
- Messages: `[data-testid="error-banner"]`

Avoid using CSS selectors or XPaths based on text/position, as the **Chaos Modes** are designed to break those strategies.

---

## 🤝 Contact

- **Lakshya Sharma**: [linkedin.com/in/lakshyasharmaqa](https://linkedin.com/in/lakshyasharmaqa)
- **Email**: lakshyasharmaqa@gmail.com

_Built with ❤️ for the QA Community_
