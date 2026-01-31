import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Textile Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional Bill Management System for Textile Business
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Bill Management</h3>
            <p className="text-gray-600">
              Create, manage, and track all your textile bills in one place
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
            <p className="text-gray-600">
              Keep track of customer details and their purchase history
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-indigo-600 text-3xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold mb-2">GST Ready</h3>
            <p className="text-gray-600">
              GST calculations with CGST, SGST, and IGST support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
