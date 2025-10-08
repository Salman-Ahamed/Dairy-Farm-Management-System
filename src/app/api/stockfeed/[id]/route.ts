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

    const stockFeed = await prisma.stockFeed.findUnique({
      where: { id: params.id },
    });

    if (!stockFeed) {
      return NextResponse.json(
        { error: "Stock feed not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(stockFeed);
  } catch (error) {
    console.error("Error fetching stock feed:", error);
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

    const quantity = parseFloat(data.quantity);
    const costPerUnit = parseFloat(data.costPerUnit);
    const totalCost = quantity * costPerUnit;

    const stockFeed = await prisma.stockFeed.update({
      where: { id: params.id },
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
        currentStock: data.currentStock
          ? parseFloat(data.currentStock)
          : quantity,
        notes: data.notes || null,
      },
    });

    // Find and update the corresponding finance record
    const financeRecord = await prisma.finance.findFirst({
      where: { referenceNumber: `FEED-${params.id}` },
    });

    if (financeRecord) {
      await prisma.finance.update({
        where: { id: financeRecord.id },
        data: {
          date: new Date(data.purchaseDate),
          description: `${data.feedName} (${data.feedType}) - ${quantity}${
            data.unit || "kg"
          } @ ${costPerUnit}৳/${data.unit || "kg"}${
            data.supplier ? ` from ${data.supplier}` : ""
          }`,
          amount: totalCost,
          notes: data.notes || null,
        },
      });
    }

    return NextResponse.json(stockFeed);
  } catch (error) {
    console.error("Error updating stock feed:", error);
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

    // Find and delete the corresponding finance record first
    const financeRecord = await prisma.finance.findFirst({
      where: { referenceNumber: `FEED-${params.id}` },
    });

    if (financeRecord) {
      await prisma.finance.delete({
        where: { id: financeRecord.id },
      });
    }

    // Delete the stock feed
    await prisma.stockFeed.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Stock feed deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting stock feed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
