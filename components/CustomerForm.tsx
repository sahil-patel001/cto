'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer } from '@prisma/client'

interface CustomerFormProps {
  customer?: Customer
}

export default function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    gstNumber: customer?.gstNumber || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = customer ? `/api/customers/${customer.id}` : '/api/customers'
      const method = customer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/customers/${result.id}`)
        router.refresh()
      } else {
        alert('Failed to save customer')
      }
    } catch (error) {
      console.error('Error saving customer:', error)
      alert('Failed to save customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GST Number
          </label>
          <input
            type="text"
            value={formData.gstNumber}
            onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., 22AAAAA0000A1Z5"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
