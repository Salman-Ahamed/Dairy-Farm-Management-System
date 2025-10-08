import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weightRecords = await prisma.animalWeight.findMany({
      include: {
        animal: true,
      },
      orderBy: { dateOfWeighing: "desc" },
    });

    return NextResponse.json(weightRecords);
  } catch (error) {
    console.error("Error fetching weight records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const weightRecord = await prisma.animalWeight.create({
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

    return NextResponse.json(weightRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating weight record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
