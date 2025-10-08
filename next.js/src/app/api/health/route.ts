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

    const healthRecords = await prisma.animalHealth.findMany({
      include: {
        animal: true,
      },
      orderBy: { dateOfExamination: "desc" },
    });

    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error("Error fetching health records:", error);
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

    const healthRecord = await prisma.animalHealth.create({
      data: {
        animalId: data.animalId,
        dateOfExamination: new Date(data.dateOfExamination),
        disease: data.disease,
        symptoms: data.symptoms || null,
        treatment: data.treatment || null,
        medication: data.medication || null,
        veterinarian: data.veterinarian || null,
        cost: data.cost ? parseFloat(data.cost) : null,
        nextCheckupDate: data.nextCheckupDate
          ? new Date(data.nextCheckupDate)
          : null,
        status: data.status || "UNDER_TREATMENT",
        notes: data.notes || null,
      },
    });

    return NextResponse.json(healthRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating health record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
