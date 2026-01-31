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

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        gstNumber: data.gstNumber || null,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
