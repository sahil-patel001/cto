import CustomerForm from '@/components/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Customer</h1>
        <p className="text-gray-600">Fill in the customer details</p>
      </div>

      <CustomerForm />
    </div>
  )
}
