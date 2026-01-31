import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: {
        select: { bills: true },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
          <p className="text-gray-600">Manage your customer database</p>
        </div>
        <Link
          href="/dashboard/customers/new"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
        >
          + Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">👥</div>
            <p className="text-xl mb-2">No customers yet</p>
            <p className="mb-6">Add your first customer to get started!</p>
            <Link
              href="/dashboard/customers/new"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              Add Customer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    GST Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Bills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {customer.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {customer.gstNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {customer._count.bills}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
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
