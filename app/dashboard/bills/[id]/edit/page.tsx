import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import BillForm from '@/components/BillForm'

export default async function EditBillPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { userId } = await auth()
  const { id } = await params

  if (!userId) {
    return null
  }

  const [bill, customers] = await Promise.all([
    prisma.bill.findUnique({
      where: { id },
      include: {
        items: true,
      },
    }),
    prisma.customer.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ])

  if (!bill || bill.userId !== userId) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Bill</h1>
        <p className="text-gray-600">Update bill details - {bill.billNumber}</p>
      </div>

      <BillForm customers={customers} userId={userId} bill={bill} />
    </div>
  )
}
