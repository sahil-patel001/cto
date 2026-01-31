import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function BillsPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const bills = await prisma.bill.findMany({
    where: { userId },
    include: {
      customer: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bills</h1>
          <p className="text-gray-600">Manage all your textile bills</p>
        </div>
        <Link
          href="/dashboard/bills/new"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
        >
          + Create Bill
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {bills.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-xl mb-2">No bills yet</p>
            <p className="mb-6">Create your first bill to get started!</p>
            <Link
              href="/dashboard/bills/new"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Create Bill
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bills.map((bill) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/bills/${bill.id}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
