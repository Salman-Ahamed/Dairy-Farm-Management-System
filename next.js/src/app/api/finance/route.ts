import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    const where: any = {}
    if (type) {
      where.type = type
    }

    const financeRecords = await prisma.finance.findMany({
      where,
      orderBy: { date: "desc" }
    })

    return NextResponse.json(financeRecords)
  } catch (error) {
    console.error("Error fetching finance records:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const financeRecord = await prisma.finance.create({
      data: {
        date: new Date(data.date),
        type: data.type,
        category: data.category,
        description: data.description,
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod || null,
        referenceNumber: data.referenceNumber || null,
        notes: data.notes || null
      }
    })

    return NextResponse.json(financeRecord, { status: 201 })
  } catch (error) {
    console.error("Error creating finance record:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

