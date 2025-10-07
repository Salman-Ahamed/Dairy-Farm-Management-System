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
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const where: any = {}

    if (search) {
      where.OR = [
        { tagNumber: { contains: search } },
        { breed: { contains: search } },
        { color: { contains: search } }
      ]
    }

    if (status) {
      where.status = status
    }

    const animals = await prisma.animal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        milkRecords: {
          take: 1,
          orderBy: { date: "desc" }
        }
      }
    })

    return NextResponse.json(animals)
  } catch (error) {
    console.error("Error fetching animals:", error)
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

    const animal = await prisma.animal.create({
      data: {
        tagNumber: data.tagNumber,
        breed: data.breed,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
        status: data.status || "ACTIVE",
        currentWeight: data.currentWeight ? parseFloat(data.currentWeight) : null,
        origin: data.origin || null,
        color: data.color || null,
        notes: data.notes || null,
        imageUrl: data.imageUrl || null
      }
    })

    return NextResponse.json(animal, { status: 201 })
  } catch (error: any) {
    console.error("Error creating animal:", error)
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag number already exists" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

