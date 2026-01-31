# Textile Dashboard - Setup Guide

This guide will walk you through setting up the Textile Dashboard application from scratch.

## Prerequisites

Before you begin, ensure you have:

1. **Node.js 18+** installed ([Download](https://nodejs.org/))
2. **PostgreSQL** database running locally or access to a hosted PostgreSQL instance
3. A **Clerk account** (free) for authentication ([Sign up](https://clerk.com/))

## Step 1: Clone and Install

```bash
# Navigate to the project directory
cd textile-dashboard

# Install dependencies
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` due to React 19 compatibility with some dependencies.

## Step 2: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a new database:

```sql
CREATE DATABASE textile_db;
```

3. Note your connection string:
```
postgresql://username:password@localhost:5432/textile_db
```

### Option B: Cloud PostgreSQL (Recommended for production)

**Using Supabase (Free tier available):**

1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection string" (URI mode)

**Using Neon:**

1. Go to [neon.tech](https://neon.tech/)
2. Create a new project
3. Copy the connection string

**Using Railway:**

1. Go to [railway.app](https://railway.app/)
2. Create a new PostgreSQL database
3. Copy the DATABASE_URL from variables

## Step 3: Set Up Clerk Authentication

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com/)
2. Click "Add application"
3. Name it "Textile Dashboard"
4. Enable "Email" as an authentication method
5. Click "Create application"
6. On the API Keys page, copy:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

## Step 4: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and fill in your values:

```env
# Database - Replace with your actual database URL
DATABASE_URL="postgresql://username:password@localhost:5432/textile_db"

# Clerk Authentication - Replace with your actual keys from Clerk dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx

# These can stay as-is
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Important:** Never commit your `.env` file to Git. It contains sensitive information.

## Step 5: Initialize the Database

1. Generate Prisma Client:

```bash
npm run db:generate
```

2. Create the database tables:

```bash
npm run db:migrate
```

When prompted for a migration name, enter: `init`

This will:
- Create the `customers` table
- Create the `bills` table
- Create the `bill_items` table
- Create the `BillStatus` enum

## Step 6: Verify Setup

1. Start the development server:

```bash
npm run dev
```

2. Open your browser to [http://localhost:3000](http://localhost:3000)

3. You should see the landing page with "Sign In" and "Sign Up" buttons

4. Click "Sign Up" and create a test account

5. After signing up, you should be redirected to the dashboard

## Step 7: Create Your First Bill

1. From the dashboard, click "Create Bill"
2. Click "+ New Customer" to add a customer:
   - Name: Test Customer
   - Phone: 1234567890
   - (Optional) Email, Address, GST Number
3. Add bill items:
   - Fabric Type: Cotton
   - Quantity: 100
   - Unit: Meter
   - Rate: 50
4. Configure tax (default is 2.5% CGST + 2.5% SGST = 5% GST)
5. Click "Create Bill"
6. View your generated invoice!

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Test connection with: `psql "your_database_url_here"`

### Issue: "Clerk publishable key is invalid"

**Solution:**
- Verify you copied the FULL key from Clerk dashboard
- Ensure there are no extra spaces in `.env`
- Make sure you're using keys from the same Clerk application

### Issue: "Prisma Client is not generated"

**Solution:**
```bash
npm run db:generate
```

### Issue: "Table does not exist"

**Solution:**
```bash
npm run db:migrate
```

### Issue: Build fails

**Solution:**
- This is expected if Clerk keys are not set
- The app works fine in development mode with `npm run dev`
- For production build, ensure all environment variables are properly set

## Database Management

### View database in Prisma Studio

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all tables
- Edit data directly
- Test queries

### Reset database (WARNING: Deletes all data)

```bash
npx prisma migrate reset
```

### Push schema changes without migration

```bash
npm run db:push
```

## Production Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/)
3. Click "Import Project"
4. Select your repository
5. Add environment variables:
   - DATABASE_URL (your production database)
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - (and all other Clerk URLs)
6. Deploy!

### Deploy Database

For production, use:
- **Supabase** (Free tier available)
- **Neon** (Free tier available)
- **Railway** (Trial available)
- **AWS RDS**, **Google Cloud SQL**, or **Azure Database**

## Next Steps

1. **Customize**: Update colors, branding, and styles
2. **Add features**: Reports, inventory management, etc.
3. **Configure Clerk**: Add more auth methods (Google, etc.)
4. **Set up backups**: Configure database backups
5. **Add monitoring**: Set up error tracking

## Getting Help

- **Clerk Issues**: [Clerk Documentation](https://clerk.com/docs)
- **Prisma Issues**: [Prisma Documentation](https://www.prisma.io/docs)
- **Next.js Issues**: [Next.js Documentation](https://nextjs.org/docs)

## Security Best Practices

1. ✅ Never commit `.env` file
2. ✅ Use strong database passwords
3. ✅ Enable 2FA on Clerk dashboard
4. ✅ Regularly update dependencies
5. ✅ Use HTTPS in production
6. ✅ Set up database backups
7. ✅ Monitor for suspicious activity

Congratulations! Your Textile Dashboard is now set up and ready to use. 🎉
