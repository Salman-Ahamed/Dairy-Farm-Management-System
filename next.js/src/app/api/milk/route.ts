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

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const where: any = {};
    if (date) {
      where.date = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const milkRecords = await prisma.milkRecord.findMany({
      where,
      include: {
        animal: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(milkRecords);
  } catch (error) {
    console.error("Error fetching milk records:", error);
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

    const morningYield = data.morningYield ? parseFloat(data.morningYield) : 0;
    const afternoonYield = data.afternoonYield
      ? parseFloat(data.afternoonYield)
      : 0;
    const eveningYield = data.eveningYield ? parseFloat(data.eveningYield) : 0;
    const totalYield = morningYield + afternoonYield + eveningYield;

    const milkRecord = await prisma.milkRecord.create({
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

    return NextResponse.json(milkRecord, { status: 201 });
  } catch (error) {
    console.error("Error creating milk record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
