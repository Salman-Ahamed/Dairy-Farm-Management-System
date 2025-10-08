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

    const milkRecord = await prisma.milkRecord.findUnique({
      where: { id: params.id },
      include: {
        animal: true,
      },
    });

    if (!milkRecord) {
      return NextResponse.json(
        { error: "Milk record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(milkRecord);
  } catch (error) {
    console.error("Error fetching milk record:", error);
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

    const morningYield = data.morningYield ? parseFloat(data.morningYield) : 0;
    const afternoonYield = data.afternoonYield
      ? parseFloat(data.afternoonYield)
      : 0;
    const eveningYield = data.eveningYield ? parseFloat(data.eveningYield) : 0;
    const totalYield = morningYield + afternoonYield + eveningYield;

    const milkRecord = await prisma.milkRecord.update({
      where: { id: params.id },
      data: {
        animalId: data.animalId,
        date: new Date(data.date),
        morningYield: morningYield || null,
        afternoonYield: afternoonYield || null,
        eveningYield: eveningYield || null,
        totalYield,
        quality: data.quality || "GOOD",
        fatContent: data.fatContent ? parseFloat(data.fatContent) : null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(milkRecord);
  } catch (error) {
    console.error("Error updating milk record:", error);
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

    await prisma.milkRecord.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Milk record deleted successfully" });
  } catch (error) {
    console.error("Error deleting milk record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
