import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weightRecord = await prisma.animalWeight.findUnique({
      where: { id: params.id },
      include: {
        animal: true,
      },
    });

    if (!weightRecord) {
      return NextResponse.json(
        { error: "Weight record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(weightRecord);
  } catch (error) {
    console.error("Error fetching weight record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const weightRecord = await prisma.animalWeight.update({
      where: { id: params.id },
      data: {
        animalId: data.animalId,
        dateOfWeighing: new Date(data.dateOfWeighing),
        weight: parseFloat(data.weight),
        height: data.height ? parseFloat(data.height) : null,
        bodyCondition: data.bodyCondition || null,
        notes: data.notes || null,
      },
    });

    // Update animal's current weight
    await prisma.animal.update({
      where: { id: data.animalId },
      data: { currentWeight: parseFloat(data.weight) },
    });

    return NextResponse.json(weightRecord);
  } catch (error) {
    console.error("Error updating weight record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.animalWeight.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Weight record deleted successfully" });
  } catch (error) {
    console.error("Error deleting weight record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
