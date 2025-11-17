# Eurovolt Solar Manufacturing Website

## Overview

Eurovolt is a Flask-based multilingual website for a professional solar equipment manufacturer specializing in solar inverters, MPPT and PWM charge controllers. The application serves as both a corporate website and customer interaction platform, featuring product catalogs, AI-powered customer support via Gemini API, contact management, and comprehensive multilingual support for global markets.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask with SQLAlchemy ORM using DeclarativeBase pattern
- **Database**: SQLite by default, configurable via environment variables for PostgreSQL in production
- **Session Management**: Flask sessions with configurable secret key
- **Form Handling**: WTForms with Flask-WTF for CSRF protection and validation
- **Email Integration**: Flask-Mail configured for SMTP-based email notifications
- **AI Integration**: Google Gemini API for intelligent customer support and solar technology advice

### Frontend Architecture
- **Template Engine**: Jinja2 with Flask's template system
- **CSS Framework**: Bootstrap 5.3.0 for responsive design
- **JavaScript Libraries**: Custom implementations for 360-degree product viewers and AI chatbot
- **Internationalization**: Custom translation system supporting English, Chinese, Spanish, German, and French
- **Interactive Elements**: 360-degree product visualization and real-time AI chat interface

### Data Models
- **ContactInquiry**: Stores customer contact form submissions with multilingual support
- **ChatMessage**: Tracks AI chatbot conversations with session management
- **Database Schema**: Simple relational design with timestamp tracking and language preferences

### Routing Structure
- **Multilingual Routes**: Language parameter support across all endpoints
- **Content Pages**: Home, About, Products, Roadmap, and Contact pages
- **API Endpoints**: AJAX-enabled chat functionality and form processing
- **Static Assets**: Organized CSS, JavaScript, and image resources

### AI-Powered Features
- **Solar Expert System**: Gemini API integration for technical support and product advice
- **Multilingual AI**: Context-aware responses in user's preferred language
- **Session Persistence**: Chat history management for continuous conversations
- **Specialized Knowledge**: Solar technology expertise with Eurovolt product focus

## External Dependencies

### Third-Party APIs
- **Google Gemini API**: AI-powered customer support and technical advice generation
- **Email Services**: SMTP configuration for customer inquiry notifications

### Frontend Libraries
- **Bootstrap 5.3.0**: Responsive UI framework and component library
- **Font Awesome 6.4.0**: Icon library for user interface elements
- **Custom JavaScript**: 360-degree product viewer and chatbot implementations

### Development Tools
- **Flask-SQLAlchemy**: Database ORM and model management
- **WTForms**: Form validation and rendering
- **Flask-WTF**: CSRF protection and Flask integration
- **Werkzeug ProxyFix**: Production deployment middleware for proxy headers

### Infrastructure Requirements
- **Database**: SQLite for development, PostgreSQL recommended for production
- **Environment Variables**: Configuration for API keys, database URLs, and email settings
- **Static File Serving**: CSS, JavaScript, and image assets
- **Session Storage**: Server-side session management for chat functionality