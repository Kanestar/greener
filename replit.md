# SmartGreener - Full-Stack Park Management Prototype

## Overview

SmartGreener is a comprehensive full-stack web application for smart park management, built with modern technologies to provide AI-powered park usage predictions, community event management, and real-time IoT sensor monitoring. The application serves as a prototype for municipal park management systems, enabling administrators to optimize park resources and enhance visitor experiences.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with full CRUD operations
- **Validation**: Zod for request/response validation
- **Storage**: In-memory storage implementation with interface for easy database migration

## Key Components

### Data Models
- **Parks**: Core park information including location, status, and maintenance details
- **Events**: Community events with signup functionality and categories
- **Feedback**: User-generated feedback with social interaction features
- **Usage Predictions**: AI-generated park usage forecasts
- **IoT Sensor Data**: Real-time sensor readings for park monitoring

### UI Components
- **Dashboard**: Main interface with comprehensive park overview
- **Park Cards**: Individual park status and information displays
- **Event Management**: Event creation, viewing, and signup functionality
- **Feedback System**: Community feedback with like/reply interactions
- **AI Predictions**: Usage prediction displays with confidence metrics
- **Stats Cards**: Key performance indicators and metrics

### Machine Learning Integration
- **ML Predictor**: Rule-based prediction system for park usage
- **IoT Simulator**: Simulated sensor data generation
- **Prediction Factors**: Time-based, weather-based, and usage pattern analysis

## Data Flow

1. **Data Collection**: IoT sensors (simulated) collect environmental and usage data
2. **ML Processing**: Prediction algorithms analyze historical and real-time data
3. **API Layer**: Express.js serves processed data through RESTful endpoints
4. **Frontend Display**: React components consume API data and present insights
5. **User Interaction**: Admin actions trigger database updates and re-calculations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific tooling

## Deployment Strategy

### Development Environment
- **Platform**: Replit workspace with monorepo structure
- **Hot Reload**: Vite development server with HMR
- **Database**: Neon Database with connection pooling
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Client Build**: Vite builds React app to static files
- **Server Build**: esbuild compiles Express server to single file
- **Database Migrations**: Drizzle Kit handles schema migrations
- **Static Serving**: Express serves built client files

### Build Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both client and server
- `npm run start`: Production server startup
- `npm run db:push`: Database schema synchronization

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```