import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import CustomerForm from '@/components/CustomerForm'

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await prisma.customer.findUnique({
    where: { id },
  })

  if (!customer) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Customer</h1>
        <p className="text-gray-600">Update customer details - {customer.name}</p>
      </div>

      <CustomerForm customer={customer} />
    </div>
  )
}
