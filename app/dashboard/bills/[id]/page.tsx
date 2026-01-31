import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BillActions from '@/components/BillActions'

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  const { id } = await params

  if (!userId) {
    return null
  }

  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      customer: true,
      items: true,
    },
  })

  if (!bill || bill.userId !== userId) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{bill.billNumber}</h1>
          <p className="text-gray-600">Bill details and invoice</p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/bills/${bill.id}/edit`}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Edit Bill
          </Link>
          <BillActions billId={bill.id} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">INVOICE</h2>
              <p className="text-gray-600">{bill.billNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold">
                {new Date(bill.billDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill To:</h3>
              <div className="text-gray-900">
                <p className="font-semibold">{bill.customer.name}</p>
                <p className="text-sm">{bill.customer.phone}</p>
                {bill.customer.email && <p className="text-sm">{bill.customer.email}</p>}
                {bill.customer.address && (
                  <p className="text-sm mt-1">{bill.customer.address}</p>
                )}
                {bill.customer.gstNumber && (
                  <p className="text-sm mt-1">GST: {bill.customer.gstNumber}</p>
                )}
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
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
            </div>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="pb-2">Item Details</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-3">
                      <p className="font-medium text-gray-900">{item.fabricType}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3 text-right text-gray-900">
                      ₹{item.rate.toFixed(2)}
                    </td>
                    <td className="py-3 text-right font-medium text-gray-900">
                      ₹{item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>

              {bill.cgst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>CGST ({bill.cgst}%):</span>
                  <span>₹{((bill.subtotal * bill.cgst) / 100).toFixed(2)}</span>
                </div>
              )}

              {bill.sgst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>SGST ({bill.sgst}%):</span>
                  <span>₹{((bill.subtotal * bill.sgst) / 100).toFixed(2)}</span>
                </div>
              )}

              {bill.igst > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>IGST ({bill.igst}%):</span>
                  <span>₹{((bill.subtotal * bill.igst) / 100).toFixed(2)}</span>
                </div>
              )}

              {bill.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount ({bill.discount}%):</span>
                  <span>-₹{((bill.subtotal * bill.discount) / 100).toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span>₹{bill.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {bill.notes && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes:</h3>
              <p className="text-gray-700">{bill.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 pt-6 border-t print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            Print Invoice
          </button>
          <Link
            href="/dashboard/bills"
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Back to Bills
          </Link>
        </div>
      </div>
    </div>
  )
}
