# SENAI Project Management System

## Overview

This is a React-based project management system designed for SENAI (Brazilian technical education institution) students and faculty. The application provides a comprehensive dashboard for managing academic projects, tracking weekly schedules, viewing professor information, and monitoring notifications throughout the semester. The system follows a structured 11-week academic calendar with specific deliverables and evaluation criteria for each week.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for consistency across frontend and backend
- **API Design**: RESTful API endpoints following standard HTTP conventions
- **Data Storage**: In-memory storage implementation with interface for easy database migration
- **Session Management**: Express sessions with PostgreSQL session store configuration

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Four main entities:
  - **Projects**: Core project information including title, description, theme, architecture, and technologies
  - **Weekly Schedule**: Time-based project milestones with tasks, deliverables, and evaluation criteria
  - **Professors**: Faculty information with specialties and expertise areas
  - **Notifications**: System alerts with priority levels and read status tracking
- **Migration System**: Drizzle Kit for schema migrations and database management

### Development Environment
- **Hot Module Replacement**: Vite middleware integration for development server
- **Error Handling**: Runtime error overlays and comprehensive error boundaries
- **Code Quality**: TypeScript strict mode with path mapping for clean imports
- **Asset Management**: Vite-based asset optimization with proper alias resolution

### UI/UX Design System
- **Component Library**: Comprehensive shadcn/ui implementation with consistent theming
- **Design Tokens**: CSS custom properties for colors, spacing, and typography
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: ARIA labels and semantic HTML structure throughout components
- **Theme Support**: Light/dark mode capability with CSS variable-based theming

### Data Flow Architecture
- **Client-Server Communication**: REST API with JSON payloads
- **Caching Strategy**: React Query for intelligent data caching and background updates
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks
- **Loading States**: Skeleton loaders and loading indicators for better UX

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL database driver for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/**: Complete suite of accessible UI primitives
- **class-variance-authority**: Utility for creating variant-based component APIs
- **date-fns**: Modern date utility library for date formatting and calculations

### Development Tools
- **tsx**: TypeScript execution engine for development server
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database migration and schema management tool
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced DX

### UI Components
- **cmdk**: Command palette component for search functionality
- **embla-carousel-react**: Touch-friendly carousel implementation
- **wouter**: Minimalist routing library for React applications
- **lucide-react**: Consistent icon library with React components

### Database and Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **zod**: TypeScript-first schema validation library
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation