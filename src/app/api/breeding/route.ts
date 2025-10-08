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

    const breedingRecords = await prisma.breeding.findMany({
      include: {
        maleAnimals: {
          include: { animal: true },
        },
        femaleAnimals: {
          include: { animal: true },
        },
      },
      orderBy: { dateOfBreeding: "desc" },
    });

    return NextResponse.json(breedingRecords);
  } catch (error) {
    console.error("Error fetching breeding records:", error);
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

    const breedingRecord = await prisma.breeding.create({
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

    return NextResponse.json(breedingRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating breeding record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
