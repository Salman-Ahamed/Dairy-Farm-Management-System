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

    const milkSales = await prisma.milkSale.findMany({
      orderBy: { saleDate: "desc" },
    });

    return NextResponse.json(milkSales);
  } catch (error) {
    console.error("Error fetching milk sales:", error);
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
    const pricePerLiter = parseFloat(data.pricePerLiter);
    const totalAmount = quantity * pricePerLiter;
    const manualPayment = parseFloat(data.amountPaid || 0); // Cash payment
    const autoPayment = parseFloat(data.autoPayment || 0); // Credit used
    const totalPaid = manualPayment + autoPayment;
    const paymentStatus = data.paymentStatus || "PENDING";

    let customerId = data.customerId;
    let isNewCustomer = false;

    // If buyer name is provided but no customerId, create or find customer
    if (data.buyer && !customerId) {
      // Try to find existing customer by exact name
      let customer = await prisma.customer.findFirst({
        where: {
          name: data.buyer,
        },
      });

      // If customer doesn't exist, create new one
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: data.buyer,
            defaultPricePerLiter: pricePerLiter,
            lastPurchaseDate: new Date(data.saleDate),
            totalPurchases: quantity,
            balance: manualPayment - totalAmount, // Initial balance (only cash payment)
          },
        });
        isNewCustomer = true;
      }

      customerId = customer.id;
    }

    // Create milk sale
    const milkSale = await prisma.milkSale.create({
      data: {
        customerId: customerId || null,
        saleDate: new Date(data.saleDate),
        quantity,
        pricePerLiter,
        totalAmount,
        amountPaid: totalPaid, // Store total paid (manual + auto)
        buyer: data.buyer || null,
        paymentStatus,
        paymentMethod: data.paymentMethod || null,
        notes: data.notes || null,
      },
    });

    // Update customer's last purchase date, total purchases, and balance
    // Skip balance update for newly created customers (already set during creation)
    if (customerId && !isNewCustomer) {
      // Balance change calculation:
      // - Deduct credit used (autoPayment)
      // - Add new cash payment (manualPayment)
      // - Subtract total amount owed
      // Net: manualPayment - autoPayment - (totalAmount - autoPayment)
      //    = manualPayment - totalAmount
      const balanceChange = manualPayment - totalAmount;

      await prisma.customer.update({
        where: { id: customerId },
        data: {
          lastPurchaseDate: new Date(data.saleDate),
          totalPurchases: {
            increment: quantity,
          },
          balance: {
            increment: balanceChange,
          },
        },
      });
    }

    // Only create finance record if payment status is PAID and there's cash payment
    if (paymentStatus === "PAID" && manualPayment > 0) {
      await prisma.finance.create({
        data: {
          date: new Date(data.saleDate),
          type: "INCOME",
          category: "Milk Sale",
          description: `Milk sale to ${
            data.buyer || "customer"
          } - ${quantity}L @ ${pricePerLiter}/L (Cash: ৳${manualPayment}${
            autoPayment > 0 ? `, Credit: ৳${autoPayment}` : ""
          })`,
          amount: manualPayment, // Only cash payment goes to finance
          paymentMethod: data.paymentMethod || null,
          referenceNumber: `MILK-SALE-${milkSale.id}`,
          notes: data.notes || null,
        },
      });
    }

    return NextResponse.json(milkSale, { status: 201 });
  } catch (error) {
    console.error("Error creating milk sale:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
