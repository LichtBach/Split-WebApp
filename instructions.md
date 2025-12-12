# AI Receptionist Agency Dashboard - Technical Directives & Instructions

**Version**: 1.0  
**Last Updated**: December 2025  
**Owner**: SplitAgency  
**Status**: Production Ready

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack & Architecture](#technology-stack--architecture)
3. [Environment Setup](#environment-setup)
4. [Database Schema & Configuration](#database-schema--configuration)
5. [Frontend Architecture](#frontend-architecture)
6. [Authentication & Security](#authentication--security)
7. [Real-time Data Integration](#real-time-data-integration)
8. [n8n Webhook Integration](#n8n-webhook-integration)
9. [Dashboard Components](#dashboard-components)
10. [API Routes & Endpoints](#api-routes--endpoints)
11. [Deployment Instructions](#deployment-instructions)
12. [Testing & Quality Assurance](#testing--quality-assurance)
13. [Monitoring & Debugging](#monitoring--debugging)
14. [Troubleshooting Guide](#troubleshooting-guide)

---

## Project Overview

### Purpose
Build a SaaS dashboard for AI receptionist and appointment-setting services. The platform provides real-time visibility into:
- Active projects and task status
- Performance metrics (calls made, qualified leads, conversions)
- Billing and cost tracking
- Analytics and reporting

### Business Model
- Clients receive dashboard access upon project activation
- Metrics tied to billing (cost per call, cost per qualified lead)
- Real-time data sync from ClickUp via n8n webhooks
- Multiple client support with role-based access control

### Key Integrations
- **ClickUp**: Project and task management (webhook source)
- **n8n**: Workflow orchestration and webhook receiver
- **ElevenLabs**: AI voice agent metrics (via n8n)
- **Supabase**: Database, authentication, real-time subscriptions

---

## Technology Stack & Architecture

### Frontend Stack
```
React 18 (TypeScript) → Vite → Vercel (deployment)
├── State Management: Zustand
├── Data Fetching: TanStack Query v5
├── Routing: TanStack Router v1
├── UI Components: shadcn/ui
├── Styling: Tailwind CSS v4
├── Charts: Recharts
├── Forms: React Hook Form + Zod
├── Authentication: Supabase Auth
└── Real-time: Supabase Realtime
```

### Backend Architecture
```
Supabase (PostgreSQL) ← n8n Webhooks (ClickUp)
├── Authentication: JWT tokens + session management
├── Database: PostgreSQL with Row Level Security
├── Real-time: LISTEN/NOTIFY for subscriptions
├── Webhooks: Signed requests from n8n
└── API: Auto-generated REST API
```

### Infrastructure
```
├── Frontend: Vercel (auto-deploy from Git)
├── Backend: Supabase Cloud
├── Workflows: n8n (self-hosted or cloud)
├── Version Control: GitHub/GitLab
├── CI/CD: GitHub Actions
└── Monitoring: Sentry + Supabase logs
```

### Development Tools
```
├── Package Manager: pnpm
├── Bundler: Vite
├── Linter: ESLint
├── Formatter: Prettier
├── Testing: Vitest + React Testing Library
├── E2E: Playwright
└── Git Hooks: Husky + lint-staged
```

---

## Environment Setup

### Prerequisites
- Node.js 18+
- pnpm (install via `npm install -g pnpm`)
- Git
- Supabase account (free tier available)
- n8n instance (self-hosted or cloud)
- ClickUp account with API access

### Initial Setup

#### 1. Create Supabase Project
```bash
# Go to https://supabase.com and create new project
# Note down:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### 2. Clone Repository & Install Dependencies
```bash
git clone <your-repo-url>
cd ai-receptionist-dashboard
pnpm install
```

#### 3. Create Environment Variables
```bash
# Create .env.local in project root
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBHOOK_SECRET=your-n8n-webhook-secret
VITE_APP_NAME=AI Receptionist Dashboard
VITE_LOG_LEVEL=debug
EOF
```

#### 4. Create `.env.example` for Documentation
```bash
# .env.example - commit this to Git (without secrets)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WEBHOOK_SECRET=your-webhook-secret-here
VITE_APP_NAME=AI Receptionist Dashboard
VITE_LOG_LEVEL=debug
```

#### 5. Local Development
```bash
# Start development server
pnpm dev

# Open http://localhost:5173 in browser
```

---

## Database Schema & Configuration

### Supabase Setup

#### 1. Create Auth Configuration
```sql
-- Enable email provider (default in Supabase)
-- Go to: Project Settings → Authentication → Email
-- Configure: 
-- - Enable email/password authentication
-- - SMTP settings (optional for custom emails)
-- - Redirect URLs: http://localhost:5173, https://yourdomain.com
```

#### 2. Create Tables

```sql
-- profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  agency_name text NOT NULL,
  role text NOT NULL DEFAULT 'viewer', -- admin, project_manager, viewer
  avatar_url text,
  timezone text DEFAULT 'UTC',
  notification_email boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- projects table
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'active', -- active, on-hold, completed, archived
  clickup_folder_id text UNIQUE,
  start_date date,
  end_date date,
  budget numeric(12, 2),
  spent numeric(12, 2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- tasks table
CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  clickup_task_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo', -- todo, in_progress, in_review, done, on_hold
  priority text DEFAULT 'medium', -- low, medium, high, urgent
  assigned_to text,
  due_date date,
  time_tracked_minutes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- metrics table
CREATE TABLE public.metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  metric_type text NOT NULL, -- calls_made, call_duration_mins, qualified_leads, conversions, etc
  value numeric(10, 2) NOT NULL,
  metadata jsonb DEFAULT '{}', -- Additional context
  recorded_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- billing table
CREATE TABLE public.billing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  billing_month date NOT NULL,
  calls_made integer DEFAULT 0,
  qualified_leads integer DEFAULT 0,
  conversions integer DEFAULT 0,
  minutes_called numeric(10, 2) DEFAULT 0,
  cost_per_call numeric(6, 2),
  cost_per_lead numeric(6, 2),
  total_cost numeric(12, 2) DEFAULT 0,
  status text DEFAULT 'pending', -- pending, sent, paid
  invoice_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- webhooks_log table (for debugging)
CREATE TABLE public.webhooks_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type text NOT NULL, -- clickup_task_update, clickup_task_create, etc
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'success', -- success, failed, retrying
  error_message text,
  retry_count integer DEFAULT 0,
  received_at timestamp with time zone DEFAULT now()
);
```

#### 3. Add Indexes for Performance
```sql
CREATE INDEX idx_profiles_agency_id ON public.profiles(id);
CREATE INDEX idx_projects_agency_id ON public.projects(agency_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_clickup_id ON public.tasks(clickup_task_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_metrics_project_id ON public.metrics(project_id);
CREATE INDEX idx_metrics_type ON public.metrics(metric_type);
CREATE INDEX idx_billing_project_id ON public.billing(project_id);
CREATE INDEX idx_billing_month ON public.billing(billing_month);
CREATE INDEX idx_webhooks_type ON public.webhooks_log(webhook_type);
```

#### 4. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks_log ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile + admins see all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Projects: Users see projects from their agency
CREATE POLICY "Users can view agency projects" ON public.projects
  FOR SELECT USING (
    agency_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks: Users see tasks from their agency projects
CREATE POLICY "Users can view agency tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id 
      AND (p.agency_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Metrics: Users see metrics from their agency projects
CREATE POLICY "Users can view agency metrics" ON public.metrics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = metrics.project_id 
      AND (p.agency_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- Similar policies for billing and webhooks_log...
```

#### 5. Enable Realtime Subscriptions
```sql
-- Go to Supabase Dashboard: Realtime → Add Publication
-- Enable realtime on these tables:
-- - projects
-- - tasks
-- - metrics
-- - billing

-- Or via SQL:
BEGIN;
  DROP publication IF EXISTS "supabase_realtime" CASCADE;
  CREATE publication "supabase_realtime" FOR TABLE public.projects, public.tasks, public.metrics, public.billing;
COMMIT;
```

---

## Frontend Architecture

### Project Structure
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── ProjectCard.tsx
│   ├── tasks/
│   │   ├── TaskList.tsx
│   │   ├── TaskDetail.tsx
│   │   └── TaskStatusBadge.tsx
│   ├── metrics/
│   │   ├── MetricCard.tsx
│   │   ├── ChartContainer.tsx
│   │   ├── CallsChart.tsx
│   │   ├── ConversionsChart.tsx
│   │   └── CostChart.tsx
│   ├── billing/
│   │   ├── BillingDashboard.tsx
│   │   ├── InvoiceList.tsx
│   │   └── CostBreakdown.tsx
│   └── common/
│       ├── Loading.tsx
│       ├── Error.tsx
│       └── Toast.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   ├── useTasks.ts
│   ├── useMetrics.ts
│   └── useSupabaseRealtime.ts
├── services/
│   ├── supabase.ts
│   ├── auth.service.ts
│   ├── projects.service.ts
│   ├── tasks.service.ts
│   ├── metrics.service.ts
│   └── webhooks.service.ts
├── store/
│   ├── authStore.ts
│   ├── projectStore.ts
│   └── uiStore.ts
├── types/
│   ├── index.ts
│   ├── auth.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── metrics.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── calculations.ts
│   └── logger.ts
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── ProjectsPage.tsx
│   ├── ProjectDetail.tsx
│   ├── TasksPage.tsx
│   ├── MetricsPage.tsx
│   ├── BillingPage.tsx
│   └── NotFound.tsx
├── App.tsx
└── main.tsx
```

### Key Patterns

#### 1. Authentication Flow
```typescript
// src/hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  };

  return { user, loading, login };
};
```

#### 2. Real-time Subscriptions
```typescript
// src/hooks/useSupabaseRealtime.ts
export const useSupabaseRealtime = (table: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    supabase
      .from(table)
      .select()
      .then(({ data }) => {
        setData(data);
        setLoading(false);
      });

    // Subscribe to real-time changes
    const subscription = supabase
      .from(table)
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          setData((prev) => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setData((prev) =>
            prev.map((item) => (item.id === payload.new.id ? payload.new : item))
          );
        } else if (payload.eventType === 'DELETE') {
          setData((prev) => prev.filter((item) => item.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table]);

  return { data, loading };
};
```

#### 3. Data Fetching with TanStack Query
```typescript
// src/hooks/useProjects.ts
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select()
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

#### 4. State Management with Zustand
```typescript
// src/store/authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

---

## Authentication & Security

### Supabase Auth Setup

#### 1. JWT Configuration
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
```

#### 2. Session Management
```typescript
// Handle token refresh automatically
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  if (event === 'SIGNED_OUT') {
    // Clear stored data
    localStorage.clear();
  }
});
```

#### 3. Protected Routes
```typescript
// src/components/auth/ProtectedRoute.tsx
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (!user) {
    navigate('/login');
    return null;
  }

  return <>{children}</>;
};
```

### Security Best Practices

#### 1. Input Validation (Zod)
```typescript
// src/utils/validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name required'),
  description: z.string().optional(),
  status: z.enum(['active', 'on-hold', 'completed', 'archived']),
});
```

#### 2. API Request Headers
```typescript
// Add JWT token to all requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${session.access_token}`,
};
```

#### 3. Webhook Signature Verification
```typescript
// src/services/webhooks.service.ts
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return hmac === signature;
};
```

#### 4. Environment Variables
```bash
# .gitignore - Never commit secrets
.env.local
.env.*.local
*.key
```

---

## Real-time Data Integration

### Supabase Realtime Configuration

#### 1. Enable Channel
```typescript
// src/services/supabase.ts
const channel = supabase
  .channel('public:tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks',
    },
    (payload) => {
      console.log('Task change:', payload);
      // Update UI
    }
  )
  .subscribe();
```

#### 2. Multi-table Subscription
```typescript
export const useTaskMetrics = (projectId: string) => {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    // Subscribe to metrics table
    const subscription = supabase
      .channel(`metrics:project_${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'metrics',
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          setMetrics((prev) => ({
            ...prev,
            [payload.new.metric_type]: payload.new.value,
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  return metrics;
};
```

#### 3. Handling Disconnections
```typescript
// Retry connection with exponential backoff
const reconnect = async (attempt = 0) => {
  try {
    await supabase.realtime.connect();
  } catch (error) {
    const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
    setTimeout(() => reconnect(attempt + 1), delay);
  }
};
```

---

## n8n Webhook Integration

### Webhook Receiver Setup

#### 1. Create API Endpoint (Vercel Serverless Function)
```typescript
// api/webhooks/clickup.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '@/services/supabase';
import { verifyWebhookSignature } from '@/services/webhooks.service';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify signature
  const signature = req.headers['x-webhook-signature'] as string;
  const secret = process.env.WEBHOOK_SECRET!;
  
  if (!verifyWebhookSignature(JSON.stringify(req.body), signature, secret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const { event_type, task_id, status, title, due_date, assigned_user } = req.body;

    // Log webhook for debugging
    await supabase.from('webhooks_log').insert({
      webhook_type: 'clickup_task_update',
      payload: req.body,
      status: 'processing',
    });

    if (event_type === 'task.updated') {
      // Update task in database
      const { error } = await supabase
        .from('tasks')
        .update({
          status: mapClickUpStatus(status),
          title,
          due_date,
          assigned_to: assigned_user,
          updated_at: new Date().toISOString(),
        })
        .eq('clickup_task_id', task_id);

      if (error) throw error;

      // Realtime update will automatically notify clients
      return res.status(200).json({ success: true, message: 'Task updated' });
    }

    return res.status(400).json({ error: 'Unknown event type' });
  } catch (error) {
    console.error('Webhook error:', error);
    
    // Log error
    await supabase.from('webhooks_log').insert({
      webhook_type: 'clickup_task_update',
      payload: req.body,
      status: 'failed',
      error_message: (error as Error).message,
    });

    return res.status(500).json({ error: 'Internal server error' });
  }
};

const mapClickUpStatus = (clickupStatus: string): string => {
  const statusMap: Record<string, string> = {
    'open': 'todo',
    'in progress': 'in_progress',
    'in review': 'in_review',
    'closed': 'done',
  };
  return statusMap[clickupStatus] || 'todo';
};
```

#### 2. Configure n8n Webhook Node
```json
{
  "node": "Webhook",
  "settings": {
    "http_method": "POST",
    "path": "webhooks/clickup",
    "response_mode": "last_node",
    "authentication": "custom",
    "headers": {
      "x-webhook-signature": "{{ $env.WEBHOOK_SECRET }}"
    }
  },
  "workflow": [
    {
      "node": "ClickUp Trigger",
      "listen_for": ["task.updated", "task.created"]
    },
    {
      "node": "HTTP Request",
      "method": "POST",
      "url": "https://yourdomain.com/api/webhooks/clickup",
      "body": {
        "event_type": "{{ $node.Trigger.json.event }}",
        "task_id": "{{ $node.Trigger.json.task_id }}",
        "status": "{{ $node.Trigger.json.status }}",
        "title": "{{ $node.Trigger.json.title }}",
        "due_date": "{{ $node.Trigger.json.due_date }}",
        "assigned_user": "{{ $node.Trigger.json.assigned_user }}"
      }
    }
  ]
}
```

#### 3. Webhook Security
```typescript
// Generate webhook secret (do once, store in .env)
import crypto from 'crypto';
const secret = crypto.randomBytes(32).toString('hex');
console.log('WEBHOOK_SECRET=' + secret);

// Sign n8n outgoing requests
const signature = crypto
  .createHmac('sha256', process.env.WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest('hex');
```

---

## Dashboard Components

### Key Metrics Dashboard
```typescript
// src/components/metrics/MetricCard.tsx
export const MetricCard = ({
  title,
  value,
  unit,
  trend,
  icon,
}: {
  title: string;
  value: number | string;
  unit?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold mt-2">
          {value}
          {unit && <span className="text-sm ml-1">{unit}</span>}
        </p>
        {trend && (
          <p className={`text-sm mt-1 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </p>
        )}
      </div>
      {icon && <div className="text-3xl">{icon}</div>}
    </div>
  </div>
);
```

### Charts with Recharts
```typescript
// src/components/metrics/CallsChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const CallsChart = ({ data }: { data: any[] }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Calls Made Over Time</h3>
    <LineChart width={800} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="calls"
        stroke="#2563eb"
        dot={{ r: 4 }}
        isAnimationActive={true}
      />
    </LineChart>
  </div>
);
```

### Task Management
```typescript
// src/components/tasks/TaskList.tsx
export const TaskList = ({ projectId }: { projectId: string }) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select()
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-2">
      {tasks?.map((task) => (
        <div key={task.id} className="flex items-center justify-between p-4 border rounded">
          <div>
            <h4 className="font-semibold">{task.title}</h4>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
          <TaskStatusBadge status={task.status} />
        </div>
      ))}
    </div>
  );
};
```

---

## API Routes & Endpoints

### REST API Endpoints (via Supabase)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List all projects | ✓ |
| GET | `/projects/:id` | Get project details | ✓ |
| POST | `/projects` | Create new project | ✓ |
| PUT | `/projects/:id` | Update project | ✓ |
| DELETE | `/projects/:id` | Delete project | ✓ |
| GET | `/projects/:id/tasks` | Get tasks for project | ✓ |
| GET | `/metrics?project_id=:id` | Get metrics for project | ✓ |
| GET | `/billing/:id` | Get billing data | ✓ |
| POST | `/webhooks/clickup` | Receive ClickUp updates | ✓ (signature) |

### Supabase Query Examples

```typescript
// Get projects with real-time subscription
const { data, error } = await supabase
  .from('projects')
  .select(`
    id, name, status, created_at,
    tasks(id, title, status)
  `)
  .eq('agency_id', userId)
  .order('created_at', { ascending: false });

// Get metrics with aggregation
const { data } = await supabase
  .from('metrics')
  .select('metric_type, value')
  .eq('project_id', projectId)
  .gte('recorded_at', '2024-12-01');

// Complex filter with RLS
const { data } = await supabase
  .from('billing')
  .select()
  .eq('project_id', projectId)
  .in('status', ['sent', 'paid']);
```

---

## Deployment Instructions

### Vercel Deployment (Frontend)

#### 1. Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# Set up environment variables in Vercel dashboard
# Settings → Environment Variables
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_WEBHOOK_SECRET=...
```

#### 2. Configure Build Settings
```bash
# vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_key"
  }
}
```

#### 3. Domain & SSL
```bash
# Add custom domain
vercel domains add yourdomain.com

# SSL auto-configured with Let's Encrypt
```

### Supabase Configuration

#### 1. Update Redirect URLs
```
Settings → Authentication → URL Configuration
Site URL: https://yourdomain.com
Redirect URLs:
- https://yourdomain.com/auth/callback
- https://yourdomain.com/
```

#### 2. Enable Required APIs
```
Settings → API
- Enable Realtime
- Configure CORS: https://yourdomain.com
```

#### 3. Backup & Recovery
```bash
# Automatic daily backups enabled on Pro plan
# Manual backup:
# Settings → Backups → Create backup
```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## Testing & Quality Assurance

### Unit Tests (Vitest)
```typescript
// src/__tests__/formatters.test.ts
import { formatCurrency, formatDuration } from '@/utils/formatters';
import { describe, it, expect } from 'vitest';

describe('formatters', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format duration in minutes', () => {
    expect(formatDuration(125)).toBe('2h 5m');
  });
});
```

### Integration Tests
```typescript
// src/__tests__/auth.integration.test.ts
import { supabase } from '@/services/supabase';
import { describe, it, expect } from 'vitest';

describe('Authentication', () => {
  it('should sign up new user', async () => {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'Test1234!',
    });
    expect(error).toBeNull();
    expect(data.user?.email).toBe('test@example.com');
  });
});
```

### E2E Tests (Playwright)
```typescript
// tests/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test('should display dashboard after login', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.fill('input[type="email"]', 'user@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Login")');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### Run Tests
```bash
# Unit tests
pnpm test

# Coverage report
pnpm test:coverage

# E2E tests
pnpm test:e2e

# Lint
pnpm lint

# Format
pnpm format
```

---

## Monitoring & Debugging

### Sentry Error Tracking
```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.Replay(),
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 0.1,
});
```

### Logging Strategy
```typescript
// src/utils/logger.ts
export const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.VITE_LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
    Sentry.captureException(error);
  },
};
```

### Supabase Logs
```bash
# View logs in Supabase dashboard
Settings → Logs → API
Settings → Logs → Realtime
Settings → Logs → Authentication
```

### Performance Monitoring
```typescript
// Measure page load time
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log('Page load time: ' + pageLoadTime + 'ms');
});
```

---

## Troubleshooting Guide

### Issue: Realtime Updates Not Working

**Symptoms**: Changes in Supabase not reflecting in UI

**Solutions**:
1. Check Supabase Realtime is enabled:
   ```bash
   Settings → Realtime → Verify enabled
   ```
2. Verify subscription channel name matches table:
   ```typescript
   const channel = supabase.channel('public:tasks'); // correct format
   ```
3. Check Row Level Security isn't blocking:
   ```sql
   SELECT * FROM public.tasks; -- test query with direct access
   ```

### Issue: Webhook Not Receiving Events

**Symptoms**: n8n workflow not triggering on ClickUp events

**Solutions**:
1. Verify webhook URL is accessible:
   ```bash
   curl -X POST https://yourdomain.com/api/webhooks/clickup \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```
2. Check n8n workflow is active (toggle switch)
3. Review logs in n8n:
   ```
   Workflow → Logs → Filter by webhook node
   ```
4. Test ClickUp integration:
   ```
   ClickUp Settings → Integrations → Webhooks → Send Test
   ```

### Issue: Slow Chart Performance

**Symptoms**: Charts lag with large datasets

**Solutions**:
1. Implement data windowing:
   ```typescript
   const windowedData = data.slice(-90); // Last 90 days
   ```
2. Use debouncing for updates:
   ```typescript
   import { debounce } from 'lodash-es';
   const updateChart = debounce((newData) => {
     setChartData(newData);
   }, 500);
   ```
3. Switch from SVG to Canvas:
   ```typescript
   <LineChart ... isAnimationActive={false}>
   ```

### Issue: Authentication Token Expired

**Symptoms**: Logged out unexpectedly, API errors with 401

**Solutions**:
1. Ensure token refresh is enabled:
   ```typescript
   auth: {
     autoRefreshToken: true,
     persistSession: true,
   }
   ```
2. Check browser storage:
   ```javascript
   localStorage.getItem('sb-auth-token')
   ```
3. Clear session and re-login:
   ```typescript
   await supabase.auth.signOut();
   ```

### Issue: High Database Query Costs

**Symptoms**: Unexpected high usage charges

**Solutions**:
1. Check for N+1 queries:
   ```typescript
   // BAD: N+1 query
   for (const project of projects) {
     const tasks = await supabase.from('tasks').select().eq('project_id', project.id);
   }
   
   // GOOD: Single query
   const { data } = await supabase
     .from('projects')
     .select('*, tasks(*)');
   ```
2. Add database indexes:
   ```sql
   CREATE INDEX idx_tasks_project_id ON tasks(project_id);
   ```
3. Implement pagination:
   ```typescript
   const start = (page - 1) * limit;
   const { data } = await supabase
     .from('tasks')
     .select()
     .range(start, start + limit - 1);
   ```

### Issue: CORS Errors

**Symptoms**: Browser blocks requests from frontend

**Solutions**:
1. Verify CORS configuration in Supabase:
   ```
   Settings → API → CORS
   Add: https://yourdomain.com
   ```
2. Check headers in requests:
   ```typescript
   // Supabase automatically adds correct headers
   // Verify in browser DevTools → Network
   ```

---

## Maintenance & Updates

### Regular Tasks

**Daily**:
- Monitor Sentry for errors
- Check database backups completed
- Review webhook logs for failures

**Weekly**:
- Update npm dependencies: `pnpm update`
- Review performance metrics
- Test all critical user flows

**Monthly**:
- Security audit (npm audit)
- Performance optimization
- Data cleanup (archive old metrics)
- Billing review

### Dependency Updates
```bash
# Check for outdated packages
pnpm outdated

# Update safely
pnpm update --interactive

# Update major versions
pnpm upgrade
```

### Database Maintenance
```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT * FROM metrics WHERE project_id = '...';

-- Vacuum to reclaim space (runs automatically on free tier)
VACUUM ANALYZE;

-- Remove old webhook logs
DELETE FROM webhooks_log 
WHERE received_at < NOW() - INTERVAL '90 days';
```

---

## Additional Resources

- **Supabase Documentation**: https://supabase.com/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **n8n Documentation**: https://docs.n8n.io
- **TypeScript**: https://www.typescriptlang.org

---

**Version History**
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial documentation |

**Questions?** Refer to the troubleshooting section or contact DevOps team.