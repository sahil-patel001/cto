# Textile Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update these values:

```env
# 1. Database URL (required)
DATABASE_URL="postgresql://username:password@localhost:5432/textile_db"

# 2. Clerk Keys (required - get from https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
CLERK_SECRET_KEY=sk_test_your_actual_key
```

**⚠️ Important:** You MUST replace the placeholder Clerk keys with real ones from [Clerk Dashboard](https://dashboard.clerk.com/). The app won't work without them.

### 3. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:migrate
```

When prompted for migration name, enter: `init`

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Account & Start Using

1. Click "Sign Up" and create an account
2. You'll be redirected to the dashboard
3. Click "Create Bill" to create your first textile bill
4. Add customers and bill items
5. View generated invoices

## 📋 Prerequisites Checklist

- ✅ Node.js 18+ installed
- ✅ PostgreSQL database running (or cloud database URL)
- ✅ Clerk account created and app configured
- ✅ Environment variables set in `.env`

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL, then:
createdb textile_db
```

### Option 2: Supabase (Free)
1. Go to [supabase.com](https://supabase.com/)
2. Create project
3. Copy database URL from Settings → Database

### Option 3: Neon (Free)
1. Go to [neon.tech](https://neon.tech/)
2. Create project
3. Copy connection string

## 🔐 Clerk Setup Steps

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Click "Add application"
3. Name: "Textile Dashboard"
4. Enable "Email" authentication
5. Create application
6. Copy both keys from API Keys page
7. Paste into `.env` file

## ✅ Verify Installation

Everything working if you can:
- ✅ Sign up for an account
- ✅ Access the dashboard
- ✅ Create a customer
- ✅ Create a bill
- ✅ View the invoice

## 🆘 Common Issues

**"Cannot connect to database"**
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env`

**"Clerk publishable key is invalid"**
- Make sure you copied the FULL key from Clerk
- Remove any extra spaces in `.env`

**"Prisma Client not generated"**
```bash
npm run db:generate
```

**"Table does not exist"**
```bash
npm run db:migrate
```

## 📚 Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup instructions
- Read [README.md](README.md) for full documentation
- Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture details

## 🎯 What You Can Do

- ✅ Create and manage textile bills
- ✅ Track customers and their purchases
- ✅ Calculate GST (CGST, SGST, IGST)
- ✅ Generate printable invoices
- ✅ View revenue statistics
- ✅ Manage bill status (Draft/Finalized/Paid/Cancelled)

## 🛠️ Useful Commands

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open database GUI

# Code Quality
npm run lint         # Check code quality
npm run build        # Test production build
```

Happy billing! 🎉
