# Textile Dashboard - Bill Management System

A professional CMS dashboard for textile businesses with comprehensive bill management features.

## Features

- 🔐 **Authentication**: Clerk-based authentication with sign-up and sign-in
- 📊 **Bill Management**: Create, edit, view, and delete textile bills
- 👥 **Customer Management**: Maintain customer database with contact details
- 🧾 **GST Ready**: Support for CGST, SGST, and IGST calculations
- 💰 **Financial Tracking**: Dashboard with revenue and bill statistics
- 🖨️ **Invoice Printing**: Print-ready invoice views
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Clerk account (for authentication)

### Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/textile_db?schema=public"

# Clerk Authentication (Get these from https://dashboard.clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Set up Clerk:

- Go to [Clerk Dashboard](https://dashboard.clerk.com/)
- Create a new application
- Copy your publishable key and secret key to the `.env` file
- Make sure to enable Email/Password authentication

5. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init
```

6. (Optional) Seed the database with sample data:

```bash
# You can manually add customers and bills through the UI
```

7. Run the development server:

```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Important Notes

- **Clerk Keys**: You MUST replace the placeholder Clerk keys in `.env` with your actual keys from the Clerk dashboard. The application will not work without valid Clerk credentials.
- **Database**: Make sure PostgreSQL is running and the DATABASE_URL is correct before running migrations.
- **Build**: The build will fail if Clerk keys are not set. This is expected behavior for security.

## Database Schema

### Customer
- Name, phone, email, address, GST number
- Linked to multiple bills

### Bill
- Bill number (auto-generated starting from BILL-00001)
- Customer details
- Bill date and status (Draft, Finalized, Paid, Cancelled)
- Tax calculations (CGST, SGST, IGST)
- Discount support
- Notes

### BillItem
- Fabric type and description
- Quantity and unit (Meter, Yard, Piece, Kg)
- Rate and calculated amount

## Usage

### Creating a Bill

1. Navigate to "Bills" → "Create Bill"
2. Select or create a customer inline
3. Add bill items with fabric details:
   - Fabric type (e.g., Cotton, Silk, Polyester)
   - Description (optional)
   - Quantity and unit
   - Rate per unit
4. Configure GST percentages (CGST, SGST, or IGST)
5. Add discount if applicable
6. Add notes (optional)
7. Save as draft or finalize

### Managing Customers

1. Navigate to "Customers"
2. Add new customers with:
   - Name and phone (required)
   - Email, address, GST number (optional)
3. View customer details and bill history
4. Edit customer information anytime

### Dashboard Overview

View key metrics:
- Total bills count
- Total customers
- Revenue statistics (from Finalized and Paid bills)
- Recent bills list with quick actions

### Bill Statuses

- **Draft**: Bill is being created/edited
- **Finalized**: Bill is complete and ready
- **Paid**: Payment received
- **Cancelled**: Bill cancelled

## API Routes

The application includes RESTful API endpoints:

- `POST /api/bills` - Create new bill
- `PUT /api/bills/[id]` - Update existing bill
- `DELETE /api/bills/[id]` - Delete bill
- `POST /api/customers` - Create new customer
- `PUT /api/customers/[id]` - Update customer

## Deployment

### Database

Deploy your PostgreSQL database on platforms like:
- [Supabase](https://supabase.com/) - Free PostgreSQL hosting
- [Railway](https://railway.app/) - Easy PostgreSQL deployment
- [Neon](https://neon.tech/) - Serverless PostgreSQL

Update the `DATABASE_URL` in your production environment variables.

### Application

Deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - DATABASE_URL
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - Clerk route variables
4. Deploy

Alternatively, use:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- Any Node.js hosting platform

## Development

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### Build fails with Clerk error
- Ensure you've added valid Clerk keys to `.env`
- Verify keys are correctly copied from Clerk dashboard

### Database connection fails
- Check if PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### Prisma client errors
- Run `npx prisma generate` to regenerate client
- Run `npx prisma migrate deploy` to apply migrations

## Project Structure

```
textile-dashboard/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── sign-in/          # Authentication pages
│   ├── sign-up/
│   └── layout.tsx        # Root layout with Clerk provider
├── components/           # Reusable components
├── lib/                  # Utilities (Prisma client)
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── .env                  # Environment variables (not in git)
```

## License

MIT

## Support

For issues or questions:
1. Check the documentation
2. Review Clerk documentation for auth issues
3. Check Prisma documentation for database issues
