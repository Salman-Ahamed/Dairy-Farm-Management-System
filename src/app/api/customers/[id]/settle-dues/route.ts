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

    // Get customer with current balance
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    if (customer.balance <= 0) {
      return NextResponse.json(
        { error: "Customer has no credit balance to settle dues" },
        { status: 400 }
      );
    }

    // Get all sales that have due amounts (regardless of status)
    const allSales = await prisma.milkSale.findMany({
      where: {
        customerId: params.id,
      },
      orderBy: {
        saleDate: "asc", // Oldest first
      },
    });

    // Filter to only sales with actual due amounts
    const pendingSales = allSales.filter(
      (sale) => sale.totalAmount - sale.amountPaid > 0.01
    );

    if (pendingSales.length === 0) {
      return NextResponse.json({
        message: "No pending dues to settle",
        settled: 0,
      });
    }

    let remainingBalance = customer.balance;
    let settledSales = 0;
    let totalSettled = 0;

    // Process each pending sale
    for (const sale of pendingSales) {
      if (remainingBalance <= 0) break;

      const dueAmount = sale.totalAmount - sale.amountPaid;

      if (dueAmount <= 0) continue; // Already paid

      if (remainingBalance >= dueAmount) {
        // Can fully pay this sale
        const newAmountPaid = sale.totalAmount;

        await prisma.$transaction([
          // Update milk sale
          prisma.milkSale.update({
            where: { id: sale.id },
            data: {
              amountPaid: newAmountPaid,
              paymentStatus: "PAID",
            },
          }),
          // Create finance record for this settled payment
          prisma.finance.create({
            data: {
              date: new Date(),
              type: "INCOME",
              category: "Milk Sale",
              description: `Auto-settled from customer balance - ${sale.quantity}L @ ${sale.pricePerLiter}৳/L`,
              amount: dueAmount,
              paymentMethod: "Customer Balance",
              referenceNumber: `MILK-SALE-${sale.id}`,
              notes: `Automatically settled from customer credit balance`,
            },
          }),
        ]);

        remainingBalance -= dueAmount;
        settledSales++;
        totalSettled += dueAmount;
      } else {
        // Can partially pay this sale
        const newAmountPaid = sale.amountPaid + remainingBalance;

        await prisma.milkSale.update({
          where: { id: sale.id },
          data: {
            amountPaid: newAmountPaid,
            paymentStatus: "PENDING", // Still pending as not fully paid
          },
        });

        totalSettled += remainingBalance;
        remainingBalance = 0;
        break;
      }
    }

    // Update customer balance
    await prisma.customer.update({
      where: { id: params.id },
      data: {
        balance: remainingBalance,
      },
    });

    return NextResponse.json({
      message: "Dues settled successfully",
      settled: settledSales,
      totalAmount: totalSettled,
      remainingBalance: remainingBalance,
    });
  } catch (error) {
    console.error("Error settling dues:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
