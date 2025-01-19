# Sleep Consultant Platform

A platform connecting sleep specialists with caregivers to provide personalized sleep guidance.

## Routes & Components Documentation

### 1. Home Page
Route: home  
Path: /  
Component: HomePage  
Location: app/page.tsx  
Purpose: Landing page with split view for specialists and caregivers  
Dependencies:
- framer-motion
- next/navigation
- lucide-react

Related Components: None  
Business Logic:
- Split screen UI for specialist/caregiver paths
- Navigation to respective login pages

### 2. Specialist Login
Route: specialist-login  
Path: /login/specialist  
Component: SpecialistLoginPage  
Location: app/login/specialist/page.tsx  
Purpose: Authentication page for sleep specialists  
Dependencies:
- @/hooks/use-auth
- @/hooks/use-toast
- @/components/ui/*

Related Components:
- ThemeProvider
- Toast

Business Logic:
- Email/password authentication
- Form validation
- Error handling
- Redirect to dashboard on success

API Endpoints:
- POST /auth/sign_in (via Supabase client)

### 3. Caregiver Login
Route: caregiver-login  
Path: /login/caregiver  
Component: CaregiverLoginPage  
Location: app/login/caregiver/page.tsx  
Purpose: Authentication page for caregivers  
Dependencies:
- @/hooks/use-auth
- @/hooks/use-toast
- @/components/ui/*

Related Components:
- ThemeProvider
- Toast

Business Logic:
- Email/password authentication
- Form validation
- Error handling
- Redirect to dashboard on success

API Endpoints:
- POST /auth/sign_in (via Supabase client)

### 4. Caregiver Signup
Route: caregiver-signup  
Path: /signup  
Component: CaregiverSignupPage  
Location: app/signup/page.tsx  
Purpose: Registration page for invited caregivers  
Dependencies:
- @hookform/resolvers/zod
- @/lib/supabase
- @/hooks/use-toast

Related Components:
- Form components
- Toast

Business Logic:
- Invitation validation
- Form validation with zod
- Account creation
- Profile creation
- Invitation status update

API Endpoints:
- GET /rest/v1/caregiver_invitations (validate invitation)
- POST /auth/sign_up (create account)
- POST /rest/v1/caregivers (create profile)
- PATCH /rest/v1/caregiver_invitations (update invitation)

### 5. Dashboard Layout
Route: dashboard-layout  
Path: /dashboard/*  
Component: DashboardLayout  
Location: app/dashboard/layout.tsx  
Purpose: Common layout for authenticated dashboard views  
Dependencies:
- @/hooks/use-auth
- next-themes
- lucide-react

Related Components:
- ThemeToggle

Business Logic:
- Authentication check
- Theme switching
- Navigation management
- Sign out functionality

API Endpoints:
- POST /auth/sign_out (via Supabase client)

### 6. Dashboard Home
Route: dashboard-home  
Path: /dashboard  
Component: DashboardPage  
Location: app/dashboard/page.tsx  
Purpose: Main dashboard view for specialists  
Dependencies:
- @/components/invite-caregiver-dialog
- lucide-react

Related Components:
- InviteCaregiverDialog

Business Logic:
- Display caregiver list
- Caregiver invitation flow

## Shared Components

### InviteCaregiverDialog
Location: components/invite-caregiver-dialog.tsx  
Purpose: Modal for inviting new caregivers  
Dependencies:
- @/hooks/use-auth
- @/hooks/use-toast
- @/lib/supabase

Business Logic:
- Form validation
- Invitation creation
- Email sending
- Duplicate invitation handling

API Endpoints:
- POST /rest/v1/rpc/invite_caregiver
- POST /functions/v1/invite_caregiver

### ThemeProvider
Location: components/theme-provider.tsx  
Purpose: Application-wide theme management  
Dependencies:
- next-themes

Business Logic:
- Theme persistence
- System theme detection
- Theme switching

## Database Types Setup

### 1. Generate Database Types

To generate TypeScript types for your Supabase database:

1. Install Supabase CLI globally:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Generate types:
```bash
supabase gen types typescript --project-id your-project-id > types/database.types.ts
```

Replace `your-project-id` with your actual Supabase project ID.

### 2. Using Generated Types

The project includes type helpers in `lib/supabase.ts` for better type safety when working with Supabase:

```typescript
// Type helpers for Supabase responses
type DbResult<T> = T extends PromiseLike<infer U> ? U : never
type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
type DbResultErr = {
  code: string
  details: string
  hint: string
  message: string
}
```

Example usage:

```typescript
// Query with type safety
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Infer the type from the query result
type Result = DbResultOk<typeof data>
```

### 3. Type-Safe Database Schema

The `types/database.types.ts` file contains your database schema types:

```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
      }
      // Add other tables here
    }
  }
}
```

### 4. Environment Variables

Required environment variables for Supabase connection:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Type-Safe Queries

Example of type-safe database queries:

```typescript
// Get typed response
const { data: users, error } = await supabase
  .from('users')
  .select('*')
type Users = DbResultOk<typeof users>

// Insert with type checking
const { data: newUser, error } = await supabase
  .from('users')
  .insert({
    email: 'user@example.com'
  })
  .select()
type NewUser = DbResultOk<typeof newUser>

// Update with type safety
const { data: updatedUser, error } = await supabase
  .from('users')
  .update({ email: 'new@example.com' })
  .eq('id', 'user-id')
  .select()
type UpdatedUser = DbResultOk<typeof updatedUser>
```

### 6. Session Management

The project includes helper functions for session management:

```typescript
// Check if session is valid
const isValid = await isValidSession()

// Refresh the current session
const session = await refreshSession()
```

## Best Practices

1. Always use type helpers for database operations
2. Keep database types up to date with your schema
3. Handle errors appropriately using the `DbResultErr` type
4. Use the provided session management helpers
5. Never expose sensitive credentials in client-side code

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT