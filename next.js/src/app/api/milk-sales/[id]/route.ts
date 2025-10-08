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
    const newPaymentStatus = data.paymentStatus || "PENDING";

    // Get the old milk sale to check previous payment status
    const oldMilkSale = await prisma.milkSale.findUnique({
      where: { id: params.id },
    });

    if (!oldMilkSale) {
      return NextResponse.json(
        { error: "Milk sale not found" },
        { status: 404 }
      );
    }

    const oldPaymentStatus = oldMilkSale.paymentStatus;

    // Update milk sale
    const milkSale = await prisma.milkSale.update({
      where: { id: params.id },
      data: {
        saleDate: new Date(data.saleDate),
        quantity,
        pricePerLiter,
        totalAmount,
        buyer: data.buyer || null,
        paymentStatus: newPaymentStatus,
        paymentMethod: data.paymentMethod || null,
        notes: data.notes || null,
      },
    });

    // Find existing finance record
    const financeRecord = await prisma.finance.findFirst({
      where: { referenceNumber: `MILK-SALE-${params.id}` },
    });

    // Handle finance record based on payment status changes
    if (oldPaymentStatus !== "PAID" && newPaymentStatus === "PAID") {
      // Payment status changed from PENDING/OVERDUE to PAID - Create finance record
      await prisma.finance.create({
        data: {
          date: new Date(data.saleDate),
          type: "INCOME",
          category: "Milk Sale",
          description: `Milk sale to ${
            data.buyer || "customer"
          } - ${quantity}L @ ${pricePerLiter}/L`,
          amount: totalAmount,
          paymentMethod: data.paymentMethod || null,
          referenceNumber: `MILK-SALE-${params.id}`,
          notes: data.notes || null,
        },
      });
    } else if (oldPaymentStatus === "PAID" && newPaymentStatus !== "PAID") {
      // Payment status changed from PAID to PENDING/OVERDUE - Delete finance record
      if (financeRecord) {
        await prisma.finance.delete({
          where: { id: financeRecord.id },
        });
      }
    } else if (oldPaymentStatus === "PAID" && newPaymentStatus === "PAID") {
      // Both old and new are PAID - Update finance record
      if (financeRecord) {
        await prisma.finance.update({
          where: { id: financeRecord.id },
          data: {
            date: new Date(data.saleDate),
            description: `Milk sale to ${
              data.buyer || "customer"
            } - ${quantity}L @ ${pricePerLiter}/L`,
            amount: totalAmount,
            paymentMethod: data.paymentMethod || null,
            notes: data.notes || null,
          },
        });
      }
    }
    // If both are not PAID, do nothing with finance

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

    // Find and delete the corresponding finance record first
    const financeRecord = await prisma.finance.findFirst({
      where: { referenceNumber: `MILK-SALE-${params.id}` },
    });

    if (financeRecord) {
      await prisma.finance.delete({
        where: { id: financeRecord.id },
      });
    }

    // Delete the milk sale
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
