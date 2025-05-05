# RoofMaster 24-7 Training Platform

A comprehensive training platform built with Next.js and TypeScript for RoofMaster 24-7, featuring role-based dashboards for sales representatives and administrators. This platform helps roofing sales professionals improve their skills through structured training modules, interactive content, and performance tracking.

## Project Overview

The RoofMaster 24-7 Training Platform provides a comprehensive learning environment for roofing sales professionals with:

- Role-based access (sales representative and administrator roles)
- Structured training video modules with progress tracking
- Interactive content organized by skill level and topic
- Clean, responsive interface optimized for all devices
- Performance tracking and certification path

## Tech Stack

- **Frontend**: Next.js with TypeScript and Pages Router
- **Styling**: Tailwind CSS with Typography plugin
- **Authentication & Backend**: Supabase (simulated in this PoC)
- **State Management**: React Context API

## Features Implemented

### Authentication
- Login page with role-based authentication
- Sales representative and administrator role separation
- Secure authentication context for managing user state

### Layout & Navigation
- Responsive sidebar navigation that works on all device sizes
- Clean, modern UI with consistent styling throughout
- Proper flexbox and grid-based layouts for optimal content display
- Intuitive navigation between different sections

### Dashboard
- Overview of training progress with visual indicators
- Quick access to training modules
- Performance metrics and completion statistics

### Training Modules
- Interactive video player with progress tracking
- Side-by-side layout for video and content
- Collapsible sections for module information
- Note-taking capabilities while watching videos
- Module resources with downloadable materials

### Admin Features
- User management interface
- Training statistics overview
- Content management tools

## Project Structure

```
my-app/
├── pages/              # Next.js pages for routing
│   ├── _app.tsx        # Custom App with global providers/layout
│   ├── index.tsx       # Login page
│   ├── dashboard.tsx   # User dashboard page
│   ├── admin/          # Admin-specific pages
│   │   └── index.tsx   # Admin dashboard page (protected)
│   └── training/       # Training-related pages for users
│       ├── videos.tsx      # Page to list & play training videos
│       ├── sops.tsx        # Page to view SOP documents
│       ├── ai-training.tsx # Page for AI voice conversation training (mocked)
│       └── results.tsx     # Page showing AI evaluation results (mocked)
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Dashboard layout component (common to user/admin)
│   └── ...             # Other components
├── lib/                
│   ├── supabaseClient.ts # Supabase client initialization and config
│   ├── AuthContext.tsx   # Authentication context provider
│   └── data.ts          # Mock data for users, modules, SOPs, scenarios, etc.
├── public/             # Public assets
│   └── videos/         # Sample video files or placeholders
└── styles/             
    └── globals.css     # Global styles (includes Tailwind imports)
```

## Recent Improvements

### Layout & Navigation
- **Responsive Design**: Improved the layout to be fully responsive across all device sizes
- **Sidebar Navigation**: Enhanced the sidebar with proper styling and responsive behavior
- **Content Layout**: Implemented proper flexbox and grid layouts for consistent content display

### Training Modules
- **Video Player**: Redesigned the video player with a more compact, efficient layout
- **Side-by-Side Content**: Implemented a side-by-side layout for video and module information
- **Collapsible Sections**: Added collapsible sections for better content organization
- **Progress Tracking**: Added visual progress indicators for module completion

## Current Issues

- **TypeScript Errors**: Some TypeScript errors in the training videos page need to be resolved
- **Mock Data**: The platform currently uses static mock data instead of real backend integration
- **Video Content**: Video files are simple placeholders and don't contain actual training content

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/roofmaster247.git
   cd roofmaster247
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/pages`: Next.js pages including the main dashboard and training modules
- `/components`: Reusable UI components
- `/styles`: Global CSS and Tailwind configuration
- `/public`: Static assets including images and videos

## Demo Accounts

- **User**: alice@example.com (password: any)
- **Admin**: bob@example.com (password: any)

## Roadmap & Next Steps

### Phase 1: Core Platform (Current)
- Create modern dashboard UI
- Implement sales training module with video content
- Design responsive, glass-morphism interface
- Fix remaining syntax errors in dashboard.tsx
- Complete user authentication flow
- Implement basic progress tracking

### Phase 2: Enhanced Learning Experience
- Develop additional training modules
- Create SOP library and downloadable resources
- Add quiz functionality for knowledge checks
- Implement module completion tracking
- Design certification system

### Phase 3: AI Integration
- Develop AI conversation simulation engine
- Create scoring rubrics and feedback mechanisms
- Implement practice scenarios for common objections
- Build performance analytics dashboard

### Phase 4: Manager & Admin Tools
- Develop team management interface
- Create content management system
- Implement advanced analytics and reporting
- Add user role management

### Phase 5: Integration & Expansion
- CRM integration capabilities
- Calendar and scheduling features
- Mobile app development
- API for third-party extensions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary and confidential.

## Note

This is currently under active development. In a production environment, additional steps will be needed:
- Set up proper authentication with Supabase
- Configure secure environment variables
- Implement comprehensive error handling
- Add automated testing
- Deploy to a production-ready hosting service
