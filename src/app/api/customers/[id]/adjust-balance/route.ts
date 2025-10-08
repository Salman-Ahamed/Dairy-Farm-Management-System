import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const adjustmentAmount = parseFloat(data.adjustmentAmount);
    const notes = data.notes || "";

    if (isNaN(adjustmentAmount)) {
      return NextResponse.json(
        { error: "Invalid adjustment amount" },
        { status: 400 }
      );
    }

    // Update customer balance
    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: {
        balance: {
          increment: adjustmentAmount,
        },
      },
    });

    // Create a finance record for the adjustment if it's significant
    const adjustmentType = adjustmentAmount > 0 ? "INCOME" : "EXPENSE";
    const adjustmentDescription =
      adjustmentAmount > 0
        ? `Balance adjustment (advance payment) from ${customer.name}`
        : `Balance adjustment (refund/correction) for ${customer.name}`;

    await prisma.finance.create({
      data: {
        date: new Date(),
        type: adjustmentType,
        category: "Balance Adjustment",
        description: adjustmentDescription,
        amount: Math.abs(adjustmentAmount),
        paymentMethod: data.paymentMethod || "Manual Adjustment",
        referenceNumber: `BALANCE-ADJ-${customer.id}-${Date.now()}`,
        notes: notes || `Balance adjustment for customer: ${customer.name}`,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error adjusting customer balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
