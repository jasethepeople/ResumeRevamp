# ResumeAI - AI-Powered Resume Optimization Platform

## Overview

ResumeAI is a modern web application that leverages artificial intelligence to help users optimize their resumes for better ATS (Applicant Tracking System) compatibility and job market success. The platform analyzes resume content, provides ATS scoring, generates improvement suggestions, and offers AI-powered optimization capabilities. Users can upload resumes, receive detailed feedback, apply AI optimizations, and download improved versions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design system including CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type validation and data parsing
- **Storage**: In-memory storage implementation with interface for future database integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM with Neon Database serverless driver
- **Schema Design**: Structured tables for users, resumes, and related metadata stored as JSONB
- **Migration System**: Drizzle Kit for database schema migrations and management

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Security**: Basic authentication structure in place for user management
- **User Context**: User identification system for resume ownership and access control

### AI Integration Services
- **OpenAI Integration**: GPT-4o model for resume analysis, optimization, and content generation
- **ATS Scoring**: AI-powered analysis to evaluate resume compatibility with applicant tracking systems
- **Content Optimization**: Intelligent suggestions for improving resume content, keywords, and formatting
- **Suggestions Engine**: AI-generated recommendations for resume improvements based on target job fields

### Document Processing
- **PDF Generation**: Puppeteer-based service for converting optimized resume data to professional PDF format
- **Resume Parsing**: Custom parser for extracting structured data from resume content
- **Content Analysis**: AI-powered analysis of resume sections including skills, experience, and achievements

## External Dependencies

### Cloud Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **OpenAI API**: GPT-4o model access for AI-powered resume analysis and optimization
- **Replit Infrastructure**: Development environment with integrated deployment and hosting

### Third-Party APIs
- **OpenAI Chat Completions**: Core AI functionality for resume analysis and content generation
- **Database Connection**: Serverless PostgreSQL through Neon's connection string

### Development Tools
- **Puppeteer**: Headless Chrome automation for PDF generation
- **Vite Plugins**: Development experience enhancements including error overlays and hot module replacement
- **TypeScript Compiler**: Full-stack type checking and compilation

### UI Component Libraries
- **Radix UI**: Accessible component primitives for complex UI interactions
- **Lucide React**: Consistent icon system throughout the application
- **Embla Carousel**: Touch-friendly carousel components for content display

### Form and Data Handling
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation
- **Date-fns**: Date manipulation and formatting utilities