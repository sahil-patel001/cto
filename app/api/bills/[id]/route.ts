import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const data = await request.json()

    const existingBill = await prisma.bill.findUnique({
      where: { id },
    })

    if (!existingBill || existingBill.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.billItem.deleteMany({
      where: { billId: id },
    })

    const bill = await prisma.bill.update({
      where: { id },
      data: {
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
    console.error('Error updating bill:', error)
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingBill = await prisma.bill.findUnique({
      where: { id },
    })

    if (!existingBill || existingBill.userId !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await prisma.bill.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bill:', error)
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 })
  }
}
