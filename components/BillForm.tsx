'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Customer } from '@prisma/client'

interface BillItem {
  fabricType: string
  description?: string | null
  quantity: number
  unit: string
  rate: number
  amount: number
}

interface Bill {
  id: string
  customerId: string
  billDate: Date
  cgst: number
  sgst: number
  igst: number
  discount: number
  notes: string | null
  status: string
  items: BillItem[]
}

interface BillFormProps {
  customers: Customer[]
  userId: string
  bill?: Bill
}

export default function BillForm({ customers, userId, bill }: BillFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showNewCustomer, setShowNewCustomer] = useState(false)

  const [formData, setFormData] = useState({
    customerId: bill?.customerId || '',
    billDate: bill?.billDate
      ? new Date(bill.billDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    cgst: bill?.cgst || 2.5,
    sgst: bill?.sgst || 2.5,
    igst: bill?.igst || 0,
    discount: bill?.discount || 0,
    notes: bill?.notes || '',
    status: bill?.status || 'DRAFT',
  })

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    gstNumber: '',
  })

  const [items, setItems] = useState<BillItem[]>(
    bill?.items || [
      { fabricType: '', description: '', quantity: 0, unit: 'Meter', rate: 0, amount: 0 },
    ]
  )

  const addItem = () => {
    setItems([
      ...items,
      { fabricType: '', description: '', quantity: 0, unit: 'Meter', rate: 0, amount: 0 },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof BillItem, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? Number(value) : updatedItems[index].quantity
      const rate = field === 'rate' ? Number(value) : updatedItems[index].rate
      updatedItems[index].amount = quantity * rate
    }

    setItems(updatedItems)
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const cgstAmount = (subtotal * formData.cgst) / 100
    const sgstAmount = (subtotal * formData.sgst) / 100
    const igstAmount = (subtotal * formData.igst) / 100
    const discountAmount = (subtotal * formData.discount) / 100
    const total = subtotal + cgstAmount + sgstAmount + igstAmount - discountAmount

    return { subtotal, cgstAmount, sgstAmount, igstAmount, discountAmount, total }
  }

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      })

      if (response.ok) {
        const customer = await response.json()
        setFormData({ ...formData, customerId: customer.id })
        setShowNewCustomer(false)
        setNewCustomer({ name: '', phone: '', email: '', address: '', gstNumber: '' })
        router.refresh()
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      alert('Failed to create customer')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const totals = calculateTotals()

      const billData = {
        ...formData,
        userId,
        items,
        subtotal: totals.subtotal,
        totalAmount: totals.total,
      }

      const url = bill ? `/api/bills/${bill.id}` : '/api/bills'
      const method = bill ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/bills/${result.id}`)
        router.refresh()
      } else {
        alert('Failed to save bill')
      }
    } catch (error) {
      console.error('Error saving bill:', error)
      alert('Failed to save bill')
    } finally {
      setLoading(false)
    }
  }

  const totals = calculateTotals()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Customer Details</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
            </label>
            {showNewCustomer ? (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="Name *"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="GST Number"
                  value={newCustomer.gstNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, gstNumber: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCustomer}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Create Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCustomer(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCustomer(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 whitespace-nowrap"
                >
                  + New Customer
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Date
              </label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="FINALIZED">Finalized</option>
                <option value="PAID">Paid</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bill Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fabric Type
                  </label>
                  <input
                    type="text"
                    value={item.fabricType}
                    onChange={(e) => updateItem(index, 'fabricType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Cotton"
                    required
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={item.description || ''}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Optional"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) => updateItem(index, 'unit', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Meter">Meter</option>
                    <option value="Yard">Yard</option>
                    <option value="Piece">Piece</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={item.rate}
                    onChange={(e) => updateItem(index, 'rate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="px-3 py-2 border rounded-lg bg-gray-100 font-medium">
                    ₹{item.amount.toFixed(2)}
                  </div>
                </div>
              </div>

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Tax & Discount</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CGST (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.cgst}
              onChange={(e) => setFormData({ ...formData, cgst: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SGST (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.sgst}
              onChange={(e) => setFormData({ ...formData, sgst: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IGST (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.igst}
              onChange={(e) => setFormData({ ...formData, igst: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows={3}
            placeholder="Any additional notes..."
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>

        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>

          {totals.cgstAmount > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>CGST ({formData.cgst}%):</span>
              <span>₹{totals.cgstAmount.toFixed(2)}</span>
            </div>
          )}

          {totals.sgstAmount > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>SGST ({formData.sgst}%):</span>
              <span>₹{totals.sgstAmount.toFixed(2)}</span>
            </div>
          )}

          {totals.igstAmount > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>IGST ({formData.igst}%):</span>
              <span>₹{totals.igstAmount.toFixed(2)}</span>
            </div>
          )}

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount ({formData.discount}%):</span>
              <span>-₹{totals.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-xl font-bold text-gray-900">
              <span>Total:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving...' : bill ? 'Update Bill' : 'Create Bill'}
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
