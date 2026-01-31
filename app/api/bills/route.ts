import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const lastBill = await prisma.bill.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    const billNumber = lastBill
      ? `BILL-${(parseInt(lastBill.billNumber.split('-')[1]) + 1).toString().padStart(5, '0')}`
      : 'BILL-00001'

    const bill = await prisma.bill.create({
      data: {
        billNumber,
        customerId: data.customerId,
        billDate: new Date(data.billDate),
        subtotal: data.subtotal,
        cgst: data.cgst,
        sgst: data.sgst,
        igst: data.igst,
        discount: data.discount,
        totalAmount: data.totalAmount,
        notes: data.notes,
        status: data.status,
        userId,
        items: {
          create: data.items.map((item: {
            fabricType: string
            description?: string
            quantity: number
            unit: string
            rate: number
            amount: number
          }) => ({
            fabricType: item.fabricType,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    })

    return NextResponse.json(bill)
  } catch (error) {
    console.error('Error creating bill:', error)
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 })
  }
}
