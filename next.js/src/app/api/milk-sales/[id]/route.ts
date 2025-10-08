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

    const milkSale = await prisma.milkSale.findUnique({
      where: { id: params.id },
    });

    if (!milkSale) {
      return NextResponse.json(
        { error: "Milk sale not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(milkSale);
  } catch (error) {
    console.error("Error fetching milk sale:", error);
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
    const pricePerLiter = parseFloat(data.pricePerLiter);
    const totalAmount = quantity * pricePerLiter;

    const milkSale = await prisma.milkSale.update({
      where: { id: params.id },
      data: {
        saleDate: new Date(data.saleDate),
        quantity,
        pricePerLiter,
        totalAmount,
        buyer: data.buyer || null,
        paymentStatus: data.paymentStatus || "PENDING",
        paymentMethod: data.paymentMethod || null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(milkSale);
  } catch (error) {
    console.error("Error updating milk sale:", error);
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

    await prisma.milkSale.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Milk sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting milk sale:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
