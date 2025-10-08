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

    const stockFeed = await prisma.stockFeed.findMany({
      orderBy: { purchaseDate: "desc" },
    });

    return NextResponse.json(stockFeed);
  } catch (error) {
    console.error("Error fetching stock feed:", error);
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

    const quantity = parseFloat(data.quantity);
    const costPerUnit = parseFloat(data.costPerUnit);
    const totalCost = quantity * costPerUnit;

    const stockFeed = await prisma.stockFeed.create({
      data: {
        feedName: data.feedName,
        feedType: data.feedType,
        quantity,
        unit: data.unit || "kg",
        purchaseDate: new Date(data.purchaseDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        supplier: data.supplier || null,
        costPerUnit,
        totalCost,
        minimumStock: data.minimumStock ? parseFloat(data.minimumStock) : null,
        currentStock: quantity,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(stockFeed, { status: 201 });
  } catch (error) {
    console.error("Error creating stock feed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
