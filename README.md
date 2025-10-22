# Polybots 🤖

**Polybots** is an AI-powered web application builder that transforms natural language prompts into fully functional Next.js applications. Simply describe what you want to build, and Polybots will generate user stories, system architecture, and working code—all within isolated sandboxed environments.

## 🌟 Features

### AI-Powered Code Generation

- **Natural Language Input**: Describe your app idea in plain English
- **Multi-Agent System**: Orchestrated AI agents for user stories, architecture, and code generation
- **Live Preview**: See your generated application running in real-time
- **Code Explorer**: View and explore all generated files with syntax highlighting

### Intelligent Development Workflow

1. **User Stories Generation**: Automatically creates structured user stories with acceptance criteria
2. **System Architecture**: Generates Mermaid diagrams and architectural documentation
3. **Code Implementation**: Builds complete, production-ready Next.js applications
4. **Sandbox Execution**: Runs code in isolated E2B sandboxes for security

### Project Management

- Create multiple projects with unique ideas
- Track message history and iterations
- Switch between different generated fragments
- Preview and code view modes

## 🛠 Tech Stack

### Frontend

- **Next.js 15.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Component library
- **Radix UI** - Accessible primitives
- **Framer Motion** - Animations
- **Mermaid** - Architecture diagrams

### Backend

- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Better Auth** - Authentication
- **Inngest** - Workflow orchestration and agent coordination

### AI & Code Execution

- **@inngest/agent-kit** - Multi-agent orchestration
- **Google Gemini 2.0 Flash** - AI model for generation
- **E2B Code Interpreter** - Sandboxed code execution
- **PrismJS** - Code syntax highlighting

## 🏗 Architecture

Polybots uses a sophisticated multi-agent architecture powered by Inngest:

```mermaid
flowchart TD
    A[User Input] --> B[Inngest Orchestrator]
    B --> C[User Stories Agent]
    B --> D[Architecture Agent]
    B --> E[Code Agent]
    C --> F[Database]
    D --> F
    E --> G[E2B Sandbox]
    G --> H[Live Preview]
    E --> F
    F --> I[Project View]
```

### Agent Workflow

1. **User Stories Agent**

   - Analyzes user prompt
   - Generates structured user stories
   - Creates acceptance criteria
   - Saves to database

2. **Architecture Agent**

   - Takes user stories as input
   - Generates Mermaid diagram
   - Creates architectural documentation
   - Defines data flow and system components

3. **Code Agent**

   - Receives architecture context
   - Creates/updates files in sandbox
   - Installs dependencies
   - Executes terminal commands
   - Generates production-ready code

4. **Supporting Agents**
   - **Fragment Title Generator**: Creates descriptive titles
   - **Response Generator**: Generates user-friendly summaries

## 📁 Project Structure

```
polybots/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── sandbox-templates/         # E2B sandbox configurations
│   └── nextjs/               # Next.js sandbox template
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (home)/          # Home and pricing pages
│   │   ├── api/             # API routes (auth, inngest, trpc)
│   │   └── projects/        # Project pages
│   ├── components/          # Shared components
│   │   ├── ui/             # Shadcn UI components
│   │   ├── code-view/      # Code viewer with syntax highlighting
│   │   └── file-explorer.tsx
│   ├── modules/            # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── home/          # Home page
│   │   ├── projects/      # Project management
│   │   ├── messages/      # Message handling
│   │   └── usage/         # Usage tracking
│   ├── inngest/           # Inngest functions and client
│   │   ├── client.ts     # Inngest client
│   │   ├── functions.ts  # AI agent functions
│   │   └── utils.ts      # Helper utilities
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # Better Auth configuration
│   │   ├── db.ts         # Prisma client
│   │   └── utils.ts      # Helper functions
│   ├── trpc/             # tRPC setup
│   ├── prompt.ts         # AI agent prompts
│   └── types.ts          # TypeScript types
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Google Gemini API key
- E2B API key
- Inngest account (for local development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/polybots.git
   cd polybots
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/polybots"

   # Google Gemini AI
   GEMINI_API_KEY="your-gemini-api-key"

   # E2B Sandbox
   E2B_API_KEY="your-e2b-api-key"

   # Inngest
   INNGEST_EVENT_KEY="your-inngest-event-key"
   INNGEST_SIGNING_KEY="your-inngest-signing-key"

   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"

   # Optional: OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**

   Terminal 1 - Next.js:

   ```bash
   npm run dev
   ```

   Terminal 2 - Inngest Dev Server:

   ```bash
   npm run inngest:dev
   ```

6. **Open the application**

   Visit [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating a Project

1. Navigate to the home page
2. Choose a template or enter a custom prompt
3. Click "Generate" to start the AI workflow
4. Watch as the system generates:
   - User stories with acceptance criteria
   - System architecture diagram
   - Architectural documentation
   - Working code and live preview

### Interacting with Projects

- **Chat Interface**: Send messages to refine or modify your application
- **Live Preview**: See your app running in real-time
- **Code View**: Explore generated files with syntax highlighting
- **File Explorer**: Navigate through the project structure

### Example Prompts

- "Build a Netflix clone with a hero banner and movie sections"
- "Create an admin dashboard with charts and data tables"
- "Build a kanban board with drag-and-drop functionality"
- "Make a Spotify-style music player with playlists"

## 🗄 Database Schema

### Key Models

- **User**: User accounts with authentication
- **Project**: User projects with associated messages
- **Message**: Chat messages (user/assistant)
- **Fragment**: Generated code artifacts with sandbox URLs
- **Usage**: Usage tracking for rate limiting

## 🔧 Configuration

### E2B Sandbox

The project uses E2B for isolated code execution. Sandbox configuration is in `sandbox-templates/nextjs/`:

- `e2b.Dockerfile`: Sandbox environment setup
- `e2b.toml`: E2B configuration
- `compile_page.sh`: Build script

### AI Prompts

All AI agent prompts are defined in `src/prompt.ts`:

- `PROMPT`: Main code generation agent
- `USER_STORIES_PROMPT`: User stories generator
- `ARCHITECTURE_PROMPT`: Architecture diagram generator
- `RESPONSE_PROMPT`: User-facing response generator
- `FRAGMENT_TITLE_PROMPT`: Fragment title generator

## 🎨 Customization

### Adding Templates

Edit `src/constant.ts` to add new project templates:

```typescript
{
  emoji: "🎬",
  title: "Build a Netflix clone",
  prompt: "Your detailed prompt here..."
}
```

### Modifying AI Behavior

Adjust prompts in `src/prompt.ts` to change how agents generate:

- User stories format
- Architecture patterns
- Code generation style
- Response tone

## 🔐 Authentication

Polybots uses Better Auth with support for:

- Email/Password authentication
- OAuth providers (Google, GitHub, etc.)
- Session management
- Protected routes via middleware

## 📊 Usage Tracking

The application includes usage tracking with:

- Point-based system
- Rate limiting via `rate-limiter-flexible`
- Usage queries via tRPC

## 🧪 Development Scripts

```bash
npm run dev              # Start Next.js dev server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run inngest:dev     # Start Inngest dev server
npm run inngest:cli     # Run Inngest CLI
```

## 🚢 Deployment

### Environment Setup

Ensure all environment variables are set in your production environment.

### Database

```bash
npm run postbuild  # Runs Prisma migrations
```

### Inngest

Deploy Inngest functions to production and configure webhooks.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI orchestration by [Inngest](https://www.inngest.com/)
- Code execution by [E2B](https://e2b.dev/)
- AI models by [Google Gemini](https://deepmind.google/technologies/gemini/)

---

**Made with ❤️ by the Polybots Team**
