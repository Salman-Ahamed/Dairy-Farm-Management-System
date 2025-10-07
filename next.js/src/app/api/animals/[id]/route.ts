import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const animal = await prisma.animal.findUnique({
      where: { id: params.id },
      include: {
        healthRecords: {
          orderBy: { dateOfExamination: "desc" },
          take: 5
        },
        weightRecords: {
          orderBy: { dateOfWeighing: "desc" },
          take: 5
        },
        milkRecords: {
          orderBy: { date: "desc" },
          take: 10
        }
      }
    })

    if (!animal) {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 })
    }

    return NextResponse.json(animal)
  } catch (error) {
    console.error("Error fetching animal:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const animal = await prisma.animal.update({
      where: { id: params.id },
      data: {
        tagNumber: data.tagNumber,
        breed: data.breed,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
        status: data.status,
        currentWeight: data.currentWeight ? parseFloat(data.currentWeight) : null,
        origin: data.origin || null,
        color: data.color || null,
        notes: data.notes || null,
        imageUrl: data.imageUrl || null
      }
    })

    return NextResponse.json(animal)
  } catch (error: any) {
    console.error("Error updating animal:", error)
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Tag number already exists" },
        { status: 400 }
      )
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.animal.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Animal deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting animal:", error)

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Animal not found" }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

