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

    const healthRecord = await prisma.animalHealth.findUnique({
      where: { id: params.id },
      include: {
        animal: true,
      },
    });

    if (!healthRecord) {
      return NextResponse.json(
        { error: "Health record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error("Error fetching health record:", error);
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

    const healthRecord = await prisma.animalHealth.update({
      where: { id: params.id },
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

    return NextResponse.json(healthRecord);
  } catch (error) {
    console.error("Error updating health record:", error);
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

    await prisma.animalHealth.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Error deleting health record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
