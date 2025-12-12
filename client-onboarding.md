# Client Onboarding Flow & Information Requirements

**Version**: 1.1  
**Last Updated**: December 2025  
**Owner**: SplitAgency  
**Status**: Production Ready

---

## Table of Contents

1. [Onboarding Overview](#onboarding-overview)
2. [Pre-Onboarding Client Information](#pre-onboarding-client-information)
3. [Onboarding Flow Steps](#onboarding-flow-steps)
4. [Dashboard Access Setup](#dashboard-access-setup)
5. [Integration Configuration](#integration-configuration)
6. [Training & Documentation](#training--documentation)
7. [Post-Launch Checklist](#post-launch-checklist)
8. [Client Success Metrics](#client-success-metrics)

---

## Onboarding Overview

### Purpose
Ensure seamless dashboard setup for new clients with clear communication of expectations, required integrations, and success metrics.

### Onboarding Timeline
- **Day 1**: Initial information collection
- **Day 2-3**: Dashboard setup and ClickUp integration
- **Day 4-5**: n8n workflow configuration
- **Day 6**: Training and go-live
- **Day 7+**: Monitoring and optimization

### Key Stakeholders
- **Client**: Project owner, decision maker
- **Technical Contact**: ClickUp admin, API access holder
- **SplitAgency**: Implementation manager, technical support

---

## Pre-Onboarding Client Information

### Section 1: Company Information

**What You Need to Collect:**

```typescript
interface ClientCompanyInfo {
  // Basic Information
  companyName: string;
  industry: string; // e.g., "Real Estate", "Finance", "Healthcare"
  numberOfEmployees: number;
  contactEmail: string;
  contactPhone: string;
  
  // Decision Makers
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  
  technicalContact: {
    name: string;
    title: string;
    email: string;
    hasClickUpAdmin: boolean;
    hasN8nAccess: boolean;
  };
  
  // Project Details
  projectName: string;
  projectDescription: string;
  launchDate: string; // ISO format
  budget: number;
  
  // Timeline
  expectedLeadsPerMonth: number;
  expectedCallsPerMonth: number;
  expectedConversionRate: number; // percentage
}
```

**Information Gathering Form:**

```markdown
## Client Information Form

### Company Details
- [ ] Company Name: ________________
- [ ] Industry: ________________
- [ ] Website: ________________
- [ ] Number of Employees: ________________
- [ ] Time Zone: ________________

### Primary Contact
- [ ] Name: ________________
- [ ] Title: ________________
- [ ] Email: ________________
- [ ] Phone: ________________

### Technical Contact
- [ ] Name: ________________
- [ ] Title: ________________
- [ ] Email: ________________
- [ ] ClickUp Admin? YES / NO
- [ ] Can create API tokens? YES / NO

### Project Scope
- [ ] Project Name: ________________
- [ ] Project Description: ________________
- [ ] Desired Launch Date: ________________
- [ ] Estimated Budget: $ ________________

### Expected Metrics
- [ ] Expected Leads/Month: ________________
- [ ] Expected Calls/Month: ________________
- [ ] Target Conversion Rate: ________________%

### Current Workflow
- [ ] Current CRM: ________________
- [ ] Current project management tool: ________________
- [ ] Any existing integrations: ________________
```

---

### Section 2: ClickUp Integration Requirements

**What You Need from Client:**

```typescript
interface ClickUpRequirements {
  // ClickUp Workspace Details
  workspaceId: string;
  workspaceName: string;
  
  // Project/Folder Structure
  projects: Array<{
    folderId: string;
    folderName: string;
    description: string;
  }>;
  
  // Task Configuration
  customFields: Array<{
    fieldId: string;
    fieldName: string;
    fieldType: 'text' | 'number' | 'date' | 'dropdown' | 'email';
    isRequired: boolean;
  }>;
  
  // Status Mapping
  taskStatuses: Array<{
    statusName: string;
    color: string;
    dashboardMapping: 'todo' | 'in_progress' | 'in_review' | 'done' | 'on_hold';
  }>;
  
  // API Access
  apiToken: string;
  apiTokenExpiresAt: string;
}
```

**ClickUp Information Checklist:**

```markdown
## ClickUp Setup Requirements

### Workspace Access
- [ ] ClickUp Workspace ID: ________________
- [ ] Workspace Name: ________________
- [ ] Workspace URL: ________________

### Projects to Track
List all projects/folders that should display in dashboard:

**Project 1**
- [ ] Folder ID: ________________
- [ ] Folder Name: ________________
- [ ] Description: ________________

**Project 2**
- [ ] Folder ID: ________________
- [ ] Folder Name: ________________
- [ ] Description: ________________

### Task Status Mapping
How ClickUp statuses should map to dashboard:

| ClickUp Status | Dashboard Status | Confirm |
|---|---|---|
| Open | To Do | [ ] |
| In Progress | In Progress | [ ] |
| In Review | In Review | [ ] |
| Closed | Done | [ ] |

### Custom Fields Being Used
- [ ] Field Name: ________________ Type: ________________
- [ ] Field Name: ________________ Type: ________________
- [ ] Field Name: ________________ Type: ________________

### API Token Generation
- [ ] Generate ClickUp API token at: https://app.clickup.com/api
- [ ] Token: ________________
- [ ] Token Expiration Date: ________________
- [ ] Store securely (share via: _password_manager_ / _secure_link_)
```

---

### Section 3: Billing & Metrics Configuration

**What You Need to Define:**

```typescript
interface BillingConfiguration {
  // Pricing Model
  pricingModel: 'per_call' | 'per_qualified_lead' | 'per_conversion' | 'hybrid' | 'monthly_flat';
  
  // Cost Structure
  costs: {
    costPerCall: number;
    costPerQualifiedLead: number;
    costPerConversion: number;
    setupFee: number;
    monthlyMinimum: number;
  };
  
  // Metrics to Track
  metricsToTrack: Array<{
    metricName: string;
    metricType: 'calls' | 'duration' | 'leads' | 'conversions' | 'custom';
    dataSource: 'ElevenLabs' | 'ClickUp' | 'Manual' | 'API';
  }>;
  
  // Reporting
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  invoiceDueDate: number; // day of month (1-31)
  invoiceEmail: string;
  invoiceCurrency: 'USD' | 'EUR' | 'GBP';
}
```

**Billing Configuration Form:**

```markdown
## Billing & Pricing Setup

### Pricing Model
- [ ] Per Call: $_______ per call
- [ ] Per Qualified Lead: $_______ per lead
- [ ] Per Conversion: $_______ per conversion
- [ ] Hybrid Model (combination):
  - [ ] Call Cost: $_______
  - [ ] Lead Cost: $_______
  - [ ] Conversion Cost: $_______
- [ ] Monthly Flat Fee: $_______
  - Included: ________________ calls/month
  - Overage: $_______ per additional call

### Additional Fees
- [ ] Setup Fee: $_______
- [ ] Monthly Minimum: $_______
- [ ] Platform Fee: _______%

### Billing Cycle
- [ ] Monthly (due by day _____)
- [ ] Quarterly (due by day _____)
- [ ] Annually (due by day _____)

### Invoice Details
- [ ] Invoice Email: ________________
- [ ] Currency: [ ] USD [ ] EUR [ ] GBP
- [ ] Payment Method: ________________
- [ ] PO Number Required: YES / NO
```

---

### Section 4: AI Voice Agent Configuration

**What You Need from Client:**

```typescript
interface VoiceAgentConfiguration {
  // Agent Identity
  agentName: string;
  agentPersonality: 'professional' | 'friendly' | 'formal' | 'casual';
  agentVoice: {
    voiceId: string; // ElevenLabs voice
    voiceName: string;
    accent: string;
  };
  
  // Call Behavior
  callBehavior: {
    maxCallDuration: number; // seconds
    timeoutAfterSeconds: number;
    retryFailedCalls: boolean;
    retryAttempts: number;
  };
  
  // Data Capture
  fieldsToCapture: Array<{
    fieldName: string;
    fieldType: 'text' | 'email' | 'phone' | 'date' | 'selection';
    isRequired: boolean;
    examples: string[];
  }>;
  
  // Response Scenarios
  leadQualificationCriteria: string; // Description of when lead is "qualified"
  successMetrics: Array<string>;
}
```

**Voice Agent Configuration:**

```markdown
## AI Voice Agent Setup

### Agent Identity
- [ ] Agent Name: ________________
- [ ] Agent Personality: 
  - [ ] Professional
  - [ ] Friendly
  - [ ] Formal
  - [ ] Casual
- [ ] Preferred Voice: ________________
- [ ] Accent: ________________

### Call Behavior
- [ ] Max Call Duration: _______ seconds
- [ ] Timeout After: _______ seconds of silence
- [ ] Retry Failed Calls: YES / NO
  - If yes, max attempts: _______

### Information to Collect from Leads
List all fields the agent should capture:

**Field 1**
- [ ] Field Name: ________________
- [ ] Type: [ ] Text [ ] Email [ ] Phone [ ] Date [ ] Selection
- [ ] Required: [ ] YES [ ] NO
- [ ] Example values: ________________

**Field 2**
- [ ] Field Name: ________________
- [ ] Type: [ ] Text [ ] Email [ ] Phone [ ] Date [ ] Selection
- [ ] Required: [ ] YES [ ] NO
- [ ] Example values: ________________

### Lead Qualification Criteria
What makes a lead "qualified"?
- [ ] Criterion 1: ________________
- [ ] Criterion 2: ________________
- [ ] Criterion 3: ________________
```

---

## Onboarding Flow Steps

### Step 1: Information Collection (Day 1)

**Process:**
1. Send client the information forms above
2. Schedule kickoff call (30 minutes)
3. Collect API tokens securely
4. Verify technical access

**Verification Checklist:**
```typescript
interface Step1Verification {
  ✓ Company information received
  ✓ Primary contact confirmed
  ✓ Technical contact identified
  ✓ ClickUp workspace access verified
  ✓ API tokens received and tested
  ✓ n8n access setup confirmed
  ✓ Project scope defined
}
```

---

### Step 2: Dashboard Account Creation (Day 2)

**Process:**
1. Create Supabase project for client
2. Create client agency profile in database
3. Generate unique dashboard URL
4. Create admin user account

**Code Implementation:**

```typescript
// src/services/onboarding.service.ts
export const createClientAccount = async (clientInfo: ClientCompanyInfo) => {
  try {
    // 1. Create Supabase user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: clientInfo.primaryContact.email,
      password: generateSecurePassword(), // Send via email
      options: {
        data: {
          full_name: clientInfo.primaryContact.name,
        },
      },
    });

    if (authError) throw authError;

    // 2. Create profile with RBAC
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user!.id,
        email: clientInfo.primaryContact.email,
        agency_name: clientInfo.companyName,
        role: 'admin', // First user is always admin
        timezone: clientInfo.timezone || 'UTC',
      });

    if (profileError) throw profileError;

    // 3. Create initial project record
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        agency_id: authData.user!.id,
        name: clientInfo.projectName,
        description: clientInfo.projectDescription,
        status: 'active',
        budget: clientInfo.budget,
        start_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // 4. Create billing record
    const { error: billingError } = await supabase
      .from('billing')
      .insert({
        project_id: projectData.id,
        billing_month: new Date().toISOString().split('T')[0],
        status: 'pending',
      });

    if (billingError) throw billingError;

    return {
      userId: authData.user!.id,
      projectId: projectData.id,
      tempPassword: generateSecurePassword(),
      dashboardUrl: `https://yourdomain.com/?project=${projectData.id}`,
    };
  } catch (error) {
    console.error('Failed to create client account:', error);
    throw error;
  }
};

const generateSecurePassword = (): string => {
  const length = 14;
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};
```

**Welcome Email Template:**

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
    .credentials { background: #f5f5f5; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to AI Receptionist Dashboard! 🎉</h1>
    </div>
    
    <p>Hi {{CLIENT_NAME}},</p>
    
    <p>Your dashboard is ready! Here's everything you need to get started:</p>
    
    <div class="credentials">
      <strong>Dashboard URL:</strong> {{DASHBOARD_URL}}<br>
      <strong>Email:</strong> {{EMAIL}}<br>
      <strong>Temporary Password:</strong> {{TEMP_PASSWORD}}<br>
    </div>
    
    <p><strong>Next Steps:</strong></p>
    <ol>
      <li>Click the button below to access your dashboard</li>
      <li>Log in with the credentials above</li>
      <li>Change your password on first login</li>
      <li>We'll configure your ClickUp integration on {{INTEGRATION_DATE}}</li>
    </ol>
    
    <a href="{{DASHBOARD_URL}}" class="button">Access Your Dashboard</a>
    
    <p><strong>Questions?</strong> Reply to this email or contact support at {{SUPPORT_EMAIL}}</p>
    
    <p>Best regards,<br>SplitAgency Team</p>
  </div>
</body>
</html>
```

---

### Step 3: ClickUp Integration (Day 2-3)

**Process:**
1. Connect ClickUp API to n8n
2. Create webhook listener in n8n
3. Configure task sync to Supabase
4. Test webhook delivery

**n8n Workflow Template:**

```json
{
  "name": "ClickUp to Dashboard Sync",
  "nodes": [
    {
      "name": "ClickUp Trigger",
      "type": "webhook",
      "typeVersion": 1,
      "position": [100, 300],
      "parameters": {
        "path": "clickup-{{PROJECT_ID}}",
        "responseMode": "onReceived",
        "options": {}
      }
    },
    {
      "name": "Process Task Data",
      "type": "code",
      "typeVersion": 1,
      "position": [300, 300],
      "parameters": {
        "jsCode": "// Extract relevant fields from ClickUp webhook\nconst payload = $input.first().json;\nreturn {\n  task_id: payload.body.task_id,\n  event: payload.body.event,\n  status: payload.body.status?.status,\n  title: payload.body.task?.name,\n  due_date: payload.body.task?.due_date,\n  assigned_user: payload.body.task?.assignees?.[0]?.username\n};"
      }
    },
    {
      "name": "Send to Dashboard",
      "type": "httpRequest",
      "typeVersion": 4,
      "position": [500, 300],
      "parameters": {
        "url": "https://yourdomain.com/api/webhooks/clickup",
        "method": "POST",
        "headerParameters": {
          "x-webhook-signature": "{{WEBHOOK_SECRET}}"
        },
        "bodyParameters": "{{ $node['Process Task Data'].json }}"
      }
    }
  ]
}
```

**Integration Verification:**

```markdown
## ClickUp Integration Checklist

- [ ] n8n workflow created
- [ ] ClickUp API token entered in n8n
- [ ] Webhook path configured: `/clickup-{{PROJECT_ID}}`
- [ ] Test event sent from ClickUp to dashboard
- [ ] Task appears in dashboard within 5 seconds
- [ ] Task status update syncs correctly
- [ ] New task creation syncs correctly
- [ ] Error handling verified
```

---

### Step 4: Metrics Configuration (Day 3-4)

**Process:**
1. Configure ElevenLabs AI metrics collection
2. Set up metric tracking in n8n
3. Map metrics to billing structure
4. Create sample dashboard data

**Metrics Configuration:**

```typescript
// src/services/metrics.service.ts
export const setupMetricsTracking = async (projectId: string, config: BillingConfiguration) => {
  // Create metric definitions for this project
  const metricDefinitions = [
    {
      project_id: projectId,
      metric_type: 'calls_made',
      display_name: 'Total Calls Made',
      unit: 'calls',
      track_for_billing: true,
    },
    {
      project_id: projectId,
      metric_type: 'call_duration_mins',
      display_name: 'Total Call Duration',
      unit: 'minutes',
      track_for_billing: config.costs.costPerCall > 0,
    },
    {
      project_id: projectId,
      metric_type: 'qualified_leads',
      display_name: 'Qualified Leads',
      unit: 'leads',
      track_for_billing: config.costs.costPerQualifiedLead > 0,
    },
    {
      project_id: projectId,
      metric_type: 'conversions',
      display_name: 'Conversions',
      unit: 'conversions',
      track_for_billing: config.costs.costPerConversion > 0,
    },
    {
      project_id: projectId,
      metric_type: 'time_saved',
      display_name: 'Human Hours Saved',
      unit: 'hours',
      track_for_billing: false,
    },
  ];

  for (const definition of metricDefinitions) {
    await supabase
      .from('metrics_definitions')
      .insert(definition);
  }
};
```

**n8n ElevenLabs Metrics Workflow:**

```json
{
  "name": "ElevenLabs Metrics to Dashboard",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "Schedule",
      "schedule": "every 5 minutes"
    },
    {
      "name": "Get ElevenLabs Metrics",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.elevenlabs.io/v1/user/subscription",
        "method": "GET",
        "headers": {
          "xi-api-key": "{{ELEVENLABS_API_KEY}}"
        }
      }
    },
    {
      "name": "Process Metrics",
      "type": "code",
      "parameters": {
        "jsCode": "// Transform ElevenLabs data to metrics format\nconst data = $input.first().json;\nreturn {\n  calls_made: data.character_count_used || 0,\n  call_duration_mins: data.character_count_used / 100 || 0, // Approximate\n  timestamp: new Date().toISOString()\n};"
      }
    },
    {
      "name": "Update Dashboard Metrics",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://yourdomain.com/api/metrics/batch",
        "method": "POST",
        "body": "{{ $node['Process Metrics'].json }}"
      }
    }
  ]
}
```

---

### Step 5: Testing & Validation (Day 5)

**Process:**
1. Run end-to-end test
2. Verify all data flows
3. Test dashboard responsiveness
4. Load test with sample data

**Test Scenario:**

```typescript
// tests/onboarding.e2e.test.ts
import { test, expect } from '@playwright/test';

test('Complete onboarding flow', async ({ page }) => {
  // 1. Login with provided credentials
  await page.goto('https://yourdomain.com/login');
  await page.fill('input[type="email"]', 'client@example.com');
  await page.fill('input[type="password"]', 'TEMP_PASSWORD');
  await page.click('button:has-text("Login")');
  
  // 2. Verify dashboard loads
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.locator('h1')).toContainText('Welcome');
  
  // 3. Check project appears
  await page.click('text=Projects');
  await expect(page.locator('text=CLIENT_PROJECT_NAME')).toBeVisible();
  
  // 4. Verify metrics cards appear
  await expect(page.locator('text=Calls Made')).toBeVisible();
  await expect(page.locator('text=Qualified Leads')).toBeVisible();
  
  // 5. Test real-time updates
  // Manually trigger ClickUp event
  const response = await page.context().request.post(
    'https://yourdomain.com/api/webhooks/clickup',
    {
      data: {
        task_id: 'test_task_123',
        event: 'task.updated',
        status: 'in_progress'
      },
      headers: {
        'x-webhook-signature': WEBHOOK_SECRET
      }
    }
  );
  
  expect(response.ok()).toBeTruthy();
  
  // 6. Wait for UI update
  await page.waitForTimeout(2000);
  await expect(page.locator('text=test_task_123')).toBeVisible();
  
  // 7. Verify billing calculations
  await page.click('text=Billing');
  const totalCostElement = page.locator('[data-testid="total-cost"]');
  expect(await totalCostElement.textContent()).toContain('$');
});
```

**Validation Checklist:**

```markdown
## Onboarding Validation

### Dashboard Access
- [ ] Login works with temp password
- [ ] Forced password change on first login
- [ ] Dashboard loads within 2 seconds
- [ ] All sections visible and accessible

### Data Integration
- [ ] ClickUp tasks appear in dashboard
- [ ] Real-time task updates within 5 seconds
- [ ] Metrics display correctly formatted
- [ ] Billing calculations accurate

### Mobile Experience
- [ ] Dashboard responsive on mobile
- [ ] Charts display correctly
- [ ] Navigation accessible on small screens

### Performance
- [ ] Page load time < 3 seconds
- [ ] Charts render smoothly
- [ ] No console errors
- [ ] No memory leaks detected
```

---

### Step 6: Client Training & Launch (Day 6)

**Training Materials:**

1. **Getting Started Guide** (PDF)
   - Dashboard overview
   - How to interpret metrics
   - How to access billing
   - Support contact information

2. **Video Tutorials** (3-5 minutes each)
   - Dashboard navigation
   - Metrics explanation
   - Billing review
   - Troubleshooting common issues

3. **Interactive Demo**
   - Live walkthrough of dashboard
   - Q&A session
   - Access to support channels

**Launch Meeting Agenda:**

```markdown
## Client Launch Meeting (60 minutes)

### 1. Welcome & Overview (10 min)
- Brief recap of integration
- What dashboard shows
- How they'll use it

### 2. Dashboard Walkthrough (20 min)
- Projects section
- Tasks management
- Metrics visualization
- Billing page
- Settings/Profile

### 3. Key Metrics Explained (15 min)
- Calls Made
- Average Call Duration
- Qualified Leads
- Conversions
- Cost per metric
- ROI calculation

### 4. Billing Deep Dive (10 min)
- How costs are calculated
- Monthly invoice process
- Payment terms
- Adjustments/credits process

### 5. Q&A (5 min)
- Address concerns
- Clarify any confusion
- Provide support resources
```

---

## Dashboard Access Setup

### Access Control Levels

```typescript
interface AccessControlLevels {
  admin: {
    // Full access
    canViewAllData: true,
    canEditProjects: true,
    canEditTasks: true,
    canViewBilling: true,
    canEditBilling: true,
    canManageUsers: true,
    canConfigureIntegrations: true,
  },
  project_manager: {
    // Operational access
    canViewAllData: true,
    canEditProjects: true,
    canEditTasks: true,
    canViewBilling: true,
    canEditBilling: false,
    canManageUsers: false,
    canConfigureIntegrations: false,
  },
  viewer: {
    // Read-only access
    canViewAllData: true,
    canEditProjects: false,
    canEditTasks: false,
    canViewBilling: true,
    canEditBilling: false,
    canManageUsers: false,
    canConfigureIntegrations: false,
  },
}
```

### Adding Team Members

**Process:**

```typescript
// src/services/users.service.ts
export const inviteTeamMember = async (
  invitedBy: string, // admin user ID
  email: string,
  role: 'admin' | 'project_manager' | 'viewer',
  projectId: string
) => {
  // 1. Create invite token
  const inviteToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const { error: inviteError } = await supabase
    .from('invitations')
    .insert({
      email,
      role,
      project_id: projectId,
      invited_by: invitedBy,
      token: inviteToken,
      expires_at: expiresAt,
    });

  if (inviteError) throw inviteError;

  // 2. Send invite email
  await sendInviteEmail(email, inviteToken, projectId, role);

  return { inviteToken, expiresAt };
};
```

**Team Member Invitation Email:**

```html
<!DOCTYPE html>
<html>
<body>
  <h2>You're Invited to SplitAgency Dashboard</h2>
  
  <p>{{INVITER_NAME}} has invited you to view the {{PROJECT_NAME}} dashboard.</p>
  
  <p>Your role: <strong>{{ROLE}}</strong></p>
  
  <p>
    <a href="https://yourdomain.com/accept-invite?token={{INVITE_TOKEN}}">
      Accept Invitation
    </a>
  </p>
  
  <p>This invitation expires in 7 days.</p>
  
  <p>Questions? Contact {{SUPPORT_EMAIL}}</p>
</body>
</html>
```

---

## Integration Configuration

### ClickUp to Dashboard Integration Checklist

**Before Onboarding:**
```
- [ ] ClickUp account created with projects defined
- [ ] API token generated and tested
- [ ] n8n instance ready (self-hosted or cloud)
- [ ] Webhook secret generated
```

**During Onboarding:**
```
- [ ] ClickUp API token added to n8n
- [ ] n8n workflow created and activated
- [ ] Test task created in ClickUp
- [ ] Dashboard receives webhook within 5 seconds
- [ ] Task appears correctly formatted in dashboard
- [ ] Status changes sync in real-time
```

**After Onboarding:**
```
- [ ] Monitor webhook delivery rate (target: 99.9%)
- [ ] Weekly sync verification
- [ ] Monthly performance review
```

---

### ElevenLabs Integration Checklist

**Before Onboarding:**
```
- [ ] ElevenLabs account created
- [ ] API key generated
- [ ] Voice agent configured
- [ ] Agent ID documented
```

**During Onboarding:**
```
- [ ] n8n workflow connects to ElevenLabs API
- [ ] Metrics flow configured (calls, duration, etc.)
- [ ] Dashboard displays mock metrics for testing
- [ ] Calculate cost per call based on ElevenLabs usage
```

**After Onboarding:**
```
- [ ] Real calls trigger metric updates
- [ ] Billing calculations verified
- [ ] Dashboard displays live metrics
```

---

## Training & Documentation

### Client Documentation Package

**1. Quick Start Guide**
```markdown
# Quick Start: 5 Minute Setup

## Login
1. Go to [Dashboard URL]
2. Use credentials from welcome email
3. Change password on first login

## Your First Look
- **Projects**: Active campaigns
- **Tasks**: Specific actions
- **Metrics**: Performance data
- **Billing**: Costs and invoices

## Key Numbers to Watch
- Calls Made: Total volume of AI calls
- Qualified Leads: Leads that met criteria
- Average Call Duration: How long calls lasted
- Conversion Rate: % of leads that converted
- Total Cost: Monthly spend
```

**2. Metrics Reference**
```markdown
# Understanding Your Metrics

## Calls Made
- **What it is**: Total number of AI voice calls made
- **Why it matters**: Indicates campaign volume
- **How it's used for billing**: Cost per call × Calls Made

## Qualified Leads
- **What it is**: Leads that met your qualification criteria
- **Why it matters**: Shows quality vs quantity
- **How it's used for billing**: Cost per lead × Qualified Leads

## Average Call Duration
- **What it is**: Average length of calls in minutes
- **Why it matters**: Longer calls = more engagement
- **Benchmark**: 3-7 minutes is typical

## Conversion Rate
- **What it is**: % of leads that became customers
- **Why it matters**: ROI indicator
- **Formula**: (Conversions / Qualified Leads) × 100

## Cost Metrics
- **Cost per Call**: Total spent / Total calls
- **Cost per Lead**: Total spent / Qualified leads
- **Cost per Conversion**: Total spent / Conversions
```

**3. Support Guide**
```markdown
# Getting Support

## Dashboard Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser
- Email support@splitagency.com

## ClickUp Sync Issues
- Verify ClickUp API token is active
- Check n8n workflow is enabled
- Review error logs in n8n

## Billing Questions
- Review invoice breakdown in billing page
- Contact billing@splitagency.com

## Feature Requests
- Email feature-requests@splitagency.com
- Include use case and priority
```

---

## Post-Launch Checklist

### First Week After Launch

```markdown
## Week 1 Post-Launch

### Daily (First 3 Days)
- [ ] Monitor webhook delivery
- [ ] Check for any error messages
- [ ] Verify metrics updating
- [ ] Confirm billing calculations

### Weekly Tasks
- [ ] Schedule check-in call with client
- [ ] Review dashboard activity
- [ ] Verify performance metrics
- [ ] Check for support tickets

### Send Client Summary Email
- Date range reviewed
- Key metrics achieved
- Any issues identified
- Recommended optimizations
```

**Week 1 Check-in Email Template:**

```html
<!DOCTYPE html>
<html>
<body>
  <h2>Welcome Week 1 Summary! 📊</h2>
  
  <p>Hi {{CLIENT_NAME}},</p>
  
  <p>Your dashboard has been live for one week. Here's how things are going:</p>
  
  <h3>Performance Summary</h3>
  <ul>
    <li><strong>Total Calls Made:</strong> {{TOTAL_CALLS}}</li>
    <li><strong>Qualified Leads:</strong> {{QUALIFIED_LEADS}}</li>
    <li><strong>Average Call Duration:</strong> {{AVG_DURATION}} minutes</li>
    <li><strong>Conversion Rate:</strong> {{CONVERSION_RATE}}%</li>
    <li><strong>Current Cost:</strong> ${{TOTAL_COST}}</li>
  </ul>
  
  <h3>System Health</h3>
  <ul>
    <li>Uptime: 100%</li>
    <li>Webhook Delivery: 99.8%</li>
    <li>Average Response Time: 245ms</li>
  </ul>
  
  <h3>Next Steps</h3>
  <p>Let's schedule a follow-up call to review results and discuss optimizations.</p>
  
  <p>
    <a href="{{CALENDAR_LINK}}">Schedule a Call</a>
  </p>
  
  <p>Questions? Reply to this email or contact {{SUPPORT_EMAIL}}</p>
</body>
</html>
```

### Monthly Review Process

```markdown
## Monthly Dashboard Review

### 1. Performance Analysis (30 min)
- Review all key metrics
- Compare to targets
- Identify trends

### 2. Billing Review (15 min)
- Verify invoice accuracy
- Discuss any adjustments
- Confirm next month forecast

### 3. Optimization Discussion (15 min)
- What's working well?
- What could improve?
- Any changes needed?

### 4. Questions & Support (15 min)
- Address any concerns
- Provide guidance
- Plan next month
```

---

## Client Success Metrics

### Define Success for Each Client

```typescript
interface ClientSuccessMetrics {
  // Performance KPIs
  targetCallsPerMonth: number;
  targetConversionRate: number; // percentage
  targetLeadCost: number; // $ per lead
  targetROI: number; // percentage
  
  // Engagement KPIs
  dashboardLoginFrequency: 'weekly' | 'monthly' | 'as-needed';
  supportTicketVolume: 'low' | 'medium' | 'high';
  
  // Satisfaction KPIs
  npsScore: number; // 0-10
  clientRetention: boolean;
  upsellOpportunity: boolean;
}
```

### Success Criteria Checklist

```markdown
## Client Success Tracking

### 30-Day Goals
- [ ] System stability: 99%+ uptime
- [ ] At least 50% of projected calls made
- [ ] Metrics displaying accurately
- [ ] Client comfortable with dashboard
- [ ] Zero critical support tickets

### 90-Day Goals
- [ ] 80%+ of projected calls made
- [ ] Conversion rate within 10% of target
- [ ] Monthly cost within budget
- [ ] Client seeing measurable ROI
- [ ] Positive feedback received

### 6-Month Goals
- [ ] Consistent performance metrics
- [ ] Predictable billing
- [ ] High dashboard engagement
- [ ] Client willing to refer
- [ ] Renewal ready
```

### Red Flags & Intervention

```markdown
## Red Flags - Immediate Action Required

- [ ] Webhook failures >1% per day
- [ ] Metrics not updating for >2 hours
- [ ] Billing discrepancies
- [ ] Client filing support tickets
- [ ] Missing onboarding requirements
- [ ] Performance below 50% of targets

## Intervention Plan
1. Contact client within 24 hours
2. Diagnose root cause
3. Implement fix
4. Verify resolution
5. Follow up within 48 hours
```

---

## Onboarding Document Tracking

### Send Clients All Documents

```markdown
# Documents to Send to Each New Client

1. ✓ Welcome Email (with login credentials)
2. ✓ Quick Start Guide (PDF)
3. ✓ Metrics Reference (PDF)
4. ✓ Support Guide (PDF)
5. ✓ API Documentation (link)
6. ✓ FAQ (link)
7. ✓ Contact Information Sheet

# Checklist Folders (in client portal)
1. ✓ Information Collection Form (completed)
2. ✓ ClickUp Integration Checklist (completed)
3. ✓ Billing Configuration (finalized)
4. ✓ Training & Launch Plan (scheduled)
5. ✓ Post-Launch Review (pending)
```

---

## Support Resources

### Client Support Channels

```markdown
# Getting Help

## Email Support
- General: support@splitagency.com
- Billing: billing@splitagency.com
- Technical: tech-support@splitagency.com
- Success: success@splitagency.com

## Response Time SLA
- Critical (system down): 1 hour
- High (major feature broken): 4 hours
- Medium (feature working partially): 24 hours
- Low (questions/guidance): 48 hours

## Knowledge Base
https://help.splitagency.com

## Status Page
https://status.splitagency.com
```

---

**End of Onboarding Documentation**

**Questions?** Contact your Success Manager or email success@splitagency.com

**Version History**
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Initial documentation |
| 1.1 | Dec 2025 | Added onboarding flow & client information |