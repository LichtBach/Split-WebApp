# Profile Page Implementation Plan

## Objective
Create a comprehensive Profile/Settings page (`src/pages/ProfilePage.tsx`) that allows users to manage their personal account, agency details, and preferences.

## Features to Implement

1.  **Header Section**
    -   Title: "Profile & Settings"
    -   Subtitle: "Manage your account, agency details, and preferences."

2.  **Profile Overview Card**
    -   Display User Avatar (use initials or image if available).
    -   Display Name and Role badge.
    -   Display Agency Name.

3.  **Account Settings (Tab 1: Account)**
    -   **Personal Information Form**:
        -   Name (Editable)
        -   Email (Read-only for security, or explicit change flow)
        -   Phone Number (Editable)
        -   Job Title (Editable)
    -   **Security**:
        -   "Change Password" button (opens a modal or section).
        -   2FA Toggle (optional placeholder).

4.  **Agency Details (Tab 2: Agency)**
    -   Agency Name (Read-only from onboarding, or request change).
    -   Website URL.
    -   Brand Colors (Display only, e.g., Primary Color).
    -   "Technical Contact" details.

5.  **Notifications (Tab 3: Notifications)**
    -   **Email Preferences**:
        -   Task Updates (Toggle)
        -   New Deliverables (Toggle)
        -   Billing/Invoice Alerts (Toggle)
        -   Weekly Summaries (Toggle)

6.  **Support & Help (Tab 4: Support)**
    -   **Contact Us**: Direct link to email team (reuse `team@datarevolt.agency`).
    -   **Documentation**: Links to Notion/Help Center.
    -   **System Info**: App Version, Browser Info (for debugging).

## Technical Implementation Steps

### Phase 1: Setup & Routing
1.  Create `src/pages/ProfilePage.tsx` component.
2.  Update `src/router.tsx` to use the new component instead of the placeholder.

### Phase 2: Component Structure
1.  Use `shadcn/ui` **Tabs** component for navigation (Account | Agency | Notifications | Support).
2.  Create sub-components for each tab to keep `ProfilePage.tsx` clean:
    -   `ProfileAccountTab`
    -   `ProfileAgencyTab`
    -   `ProfileNotificationsTab`

### Phase 3: State Management
1.  Connect to `useAuthStore` to Read/Update user data.
2.  Create a local form state (using `react-hook-form` + `zod`) for profile updates.
3.  Mock the API calls for "Save Changes" (since backend might be limited).

### Phase 4: UI/UX Polish
1.  Ensure responsive design (tabs might become a dropdown or vertical list on mobile).
2.  Add success toasts upon saving.
3.  Use existing brand colors (red accents).

## Mock Data Requirements
-   Update `mockData.ts` to include `notificationPreferences` if not present.
-   Ensure `user` object has all necessary fields.

## Timeline
-   **Step 1**: Scaffold Page & Tabs (30 mins)
-   **Step 2**: Build Account Form (45 mins)
-   **Step 3**: Build Agency & Notification Sections (45 mins)
-   **Step 4**: Testing & Refinement (30 mins)
