import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import BillForm from '@/components/BillForm'

export default async function NewBillPage() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const customers = await prisma.customer.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Bill</h1>
        <p className="text-gray-600">Fill in the details to create a new textile bill</p>
      </div>

      <BillForm customers={customers} userId={userId} />
    </div>
  )
}
