# ClickUp Integration Research & Implementation Guide

## Your ClickUp Hierarchy

```
Workspace (Team)
└── Space (Client Space - one per client)
    ├── DATA Folder
    │   ├── Task List 1
    │   └── Task List 2
    ├── PMK Folder (Paid Marketing)
    │   └── Task Lists...
    ├── DMK Folder (Digital Marketing)
    │   └── Task Lists...
    ├── SEO Folder
    │   └── Task Lists...
    ├── SM Folder (Social Media)
    │   └── Task Lists...
    └── CONTENT Folder
        └── Task Lists...
```

## Join Key Strategy for Welcome Flow → ClickUp Connection

### Option 1: Space ID as Join Key (Recommended)
When a client completes the onboarding flow, we need to link their account to their ClickUp Space.

**Implementation:**
1. **Pre-create the ClickUp Space** for the client before they complete onboarding
2. **Store the Space ID** as a custom field in the onboarding form (hidden or entered by admin)
3. **On form completion**, save the mapping: `client_email → clickup_space_id`

```typescript
// Example join key structure
interface ClientClickUpMapping {
    clientId: string           // From our auth system
    clientEmail: string        // Primary identifier
    clickupSpaceId: string     // ClickUp Space ID for this client
    clickupTeamId: string      // Your DRA workspace ID (constant)
    createdAt: Date
}
```

### Option 2: Custom Field in ClickUp
Create a custom field in ClickUp that stores the client's email/ID, then query by that field.

### Option 3: Space Name Matching
Name ClickUp Spaces with a consistent pattern (e.g., "CLIENT-{company_name}") and match by name.

---

## ClickUp API Endpoints for Your Structure

### 1. Get All Spaces in Workspace (for admin view)
```
GET /api/v2/team/{team_id}/space
```

### 2. Get Folders in a Space (departments: DATA, PMK, etc.)
```
GET /api/v2/space/{space_id}/folder
```

### 3. Get Lists in a Folder
```
GET /api/v2/folder/{folder_id}/list
```

### 4. Get Tasks from a List
```
GET /api/v2/list/{list_id}/task
```

### 5. Get All Tasks in a Folder (across all lists)
We need to iterate through lists and aggregate tasks.

---

## Data Mapping: ClickUp → Dashboard

### Project Status
- **Source**: Space metadata + aggregated task counts
- **Mapping**:
  - `progress` = (completed tasks / total tasks) × 100
  - `health` = based on overdue tasks and blockers

### Blockers
- **Source**: Tasks with "blocker" tag OR custom "Blocked" status
- **Query**: Filter tasks by tag or status

### Deliverables
- **Source**: Tasks with "deliverable" tag OR tasks in a "Deliverables" list
- **Mapping**:
  - `status`: ClickUp status → our status (to review → in_review)
  - `dueDate`: ClickUp due_date
  - `fileUrl`: From task attachments

### Team Members (Assignees)
- **Source**: Task assignees across the Space
- **Alternative**: Store team members in a config

---

## Department Folder → Dashboard Section Mapping

| ClickUp Folder | Dashboard Display |
|----------------|-------------------|
| DATA | Primary project tasks (GA4, GTM, Analytics) |
| PMK | Paid Marketing deliverables |
| DMK | Digital Marketing tasks |
| SEO | SEO tasks & reports |
| SM | Social Media content |
| CONTENT | Content deliverables |

---

## Implementation: ClickUp Service Updates

### Fetching Tasks from Your Hierarchy

```typescript
// Get all tasks for a client's Space
async function getSpaceTasks(spaceId: string): Promise<ClickUpTask[]> {
    // 1. Get all folders in the space
    const folders = await getFolders(spaceId);
    
    // 2. For each folder, get all lists
    const allTasks: ClickUpTask[] = [];
    
    for (const folder of folders) {
        const lists = await getLists(folder.id);
        
        for (const list of lists) {
            const tasks = await getTasks(list.id, { include_closed: true });
            
            // Add folder/department info to each task
            tasks.forEach(task => {
                task._department = folder.name; // DATA, PMK, etc.
            });
            
            allTasks.push(...tasks);
        }
    }
    
    return allTasks;
}
```

### Filtering by Department

```typescript
function getTasksByDepartment(tasks: ClickUpTask[], department: string): ClickUpTask[] {
    return tasks.filter(task => task._department === department);
}

// Get DATA department tasks (analytics/GTM work)
const dataTasks = getTasksByDepartment(allTasks, 'DATA');
```

---

## Webhook Integration (Real-time Updates)

ClickUp supports webhooks to notify your app when:
- Tasks are created/updated/deleted
- Status changes
- Assignee changes
- Due date changes

**Webhook Setup:**
```
POST /api/v2/team/{team_id}/webhook
{
    "endpoint": "https://your-app.com/api/clickup-webhook",
    "events": [
        "taskCreated",
        "taskUpdated",
        "taskDeleted",
        "taskStatusUpdated"
    ],
    "space_id": "{client_space_id}"  // Filter to specific client
}
```

---

## Database Schema for Client-ClickUp Mapping

```sql
CREATE TABLE client_clickup_mapping (
    id UUID PRIMARY KEY,
    client_id UUID REFERENCES users(id),
    clickup_space_id VARCHAR(50) NOT NULL,
    clickup_team_id VARCHAR(50) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_email)
);
```

---

## Onboarding Flow Integration

### Step 1: Admin Creates ClickUp Space
Before client onboarding, admin creates:
1. New Space in ClickUp named `{CompanyName}`
2. Department folders: DATA, PMK, DMK, SEO, SM, CONTENT
3. Initial task lists

### Step 2: Admin Generates Onboarding Link
Generate a unique onboarding URL with the Space ID embedded:
```
https://onboarding.datarevolt.agency/welcome?space={SPACE_ID}
```

### Step 3: Client Completes Onboarding
When client submits the welcome flow:
1. Extract `space` param from URL
2. Create user account with email
3. Save mapping: `email → space_id`
4. Dashboard fetches data from that specific Space

### Step 4: Dashboard Data Loading
```typescript
async function loadDashboardData(clientEmail: string) {
    // 1. Get client's ClickUp Space ID from database
    const mapping = await getClientClickUpMapping(clientEmail);
    
    // 2. Fetch tasks from their Space
    const tasks = await getSpaceTasks(mapping.clickupSpaceId);
    
    // 3. Transform to dashboard format
    return {
        projectStatus: calculateProjectStatus(tasks),
        blockers: filterBlockers(tasks),
        deliverables: filterDeliverables(tasks),
        timeline: generateTimeline(tasks),
    };
}
```

---

## Environment Variables Required

```env
# ClickUp API (DRA's workspace)
VITE_CLICKUP_API_TOKEN=pk_xxx_xxxx        # Your API token
VITE_CLICKUP_TEAM_ID=12345678             # Your workspace ID

# Database (for client mappings)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## Next Steps

1. **Update Welcome Flow** - Add hidden `spaceId` field that can be passed via URL
2. **Create Database Table** - For client-ClickUp mapping
3. **Build API Endpoints** - To save and retrieve mappings
4. **Update ClickUp Service** - To fetch from your hierarchy structure
5. **Add Webhook Handler** - For real-time updates
6. **Create Admin Panel** - To manage client spaces (optional)

---

## API Rate Limits

ClickUp API has rate limits:
- **Free/Unlimited plans**: 100 requests per minute
- **Business plans**: 10,000 requests per minute

Consider caching frequently accessed data (spaces, folders) and only fetching tasks on demand.
