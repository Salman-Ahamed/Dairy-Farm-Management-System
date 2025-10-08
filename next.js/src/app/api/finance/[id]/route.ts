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

    const financeRecord = await prisma.finance.findUnique({
      where: { id: params.id },
    });

    if (!financeRecord) {
      return NextResponse.json(
        { error: "Finance record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(financeRecord);
  } catch (error) {
    console.error("Error fetching finance record:", error);
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

    const financeRecord = await prisma.finance.update({
      where: { id: params.id },
      data: {
        date: new Date(data.date),
        type: data.type,
        category: data.category,
        description: data.description,
        amount: parseFloat(data.amount),
        paymentMethod: data.paymentMethod || null,
        referenceNumber: data.referenceNumber || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(financeRecord);
  } catch (error) {
    console.error("Error updating finance record:", error);
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

    await prisma.finance.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Finance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting finance record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
