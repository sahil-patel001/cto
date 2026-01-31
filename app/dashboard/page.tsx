import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const [totalBills, totalCustomers, recentBills] = await Promise.all([
    prisma.bill.count({
      where: { userId },
    }),
    prisma.customer.count(),
    prisma.bill.findMany({
      where: { userId },
      include: {
        customer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),
  ])

  const totalRevenue = await prisma.bill.aggregate({
    where: {
      userId,
      status: { in: ['FINALIZED', 'PAID'] },
    },
    _sum: {
      totalAmount: true,
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your textile business management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Bills</p>
              <p className="text-3xl font-bold text-gray-900">{totalBills}</p>
            </div>
            <div className="text-4xl">📄</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{totalRevenue._sum.totalAmount?.toLocaleString('en-IN') || '0'}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bills</h2>
            <Link
              href="/dashboard/bills"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {recentBills.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No bills yet. Create your first bill to get started!</p>
              <Link
                href="/dashboard/bills/new"
                className="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Create Bill
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Bill Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/bills/${bill.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {bill.billNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {bill.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(bill.billDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          bill.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : bill.status === 'FINALIZED'
                            ? 'bg-blue-100 text-blue-800'
                            : bill.status === 'DRAFT'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
