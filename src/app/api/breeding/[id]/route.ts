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

    const breedingRecord = await prisma.breeding.findUnique({
      where: { id: params.id },
      include: {
        maleAnimals: {
          include: { animal: true },
        },
        femaleAnimals: {
          include: { animal: true },
        },
      },
    });

    if (!breedingRecord) {
      return NextResponse.json(
        { error: "Breeding record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(breedingRecord);
  } catch (error) {
    console.error("Error fetching breeding record:", error);
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

    // Delete existing animal relations
    await prisma.breedingMaleAnimal.deleteMany({
      where: { breedingId: params.id },
    });
    await prisma.breedingFemaleAnimal.deleteMany({
      where: { breedingId: params.id },
    });

    // Update breeding record with new data
    const breedingRecord = await prisma.breeding.update({
      where: { id: params.id },
      data: {
        dateOfBreeding: new Date(data.dateOfBreeding),
        expectedDelivery: data.expectedDelivery
          ? new Date(data.expectedDelivery)
          : null,
        actualDelivery: data.actualDelivery
          ? new Date(data.actualDelivery)
          : null,
        breedingMethod: data.breedingMethod,
        outcome: data.outcome || "PENDING",
        numberOfOffspring: data.numberOfOffspring
          ? parseInt(data.numberOfOffspring)
          : null,
        cost: data.cost ? parseFloat(data.cost) : null,
        notes: data.notes || null,
        maleAnimals: {
          create:
            data.maleAnimalIds?.map((id: string) => ({ animalId: id })) || [],
        },
        femaleAnimals: {
          create:
            data.femaleAnimalIds?.map((id: string) => ({ animalId: id })) || [],
        },
      },
    });

    return NextResponse.json(breedingRecord);
  } catch (error) {
    console.error("Error updating breeding record:", error);
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

    // Delete relations first
    await prisma.breedingMaleAnimal.deleteMany({
      where: { breedingId: params.id },
    });
    await prisma.breedingFemaleAnimal.deleteMany({
      where: { breedingId: params.id },
    });

    // Delete breeding record
    await prisma.breeding.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Breeding record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting breeding record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
