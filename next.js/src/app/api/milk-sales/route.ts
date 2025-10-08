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
    const paymentStatus = data.paymentStatus || "PENDING";

    let customerId = data.customerId;

    // If buyer name is provided but no customerId, create or find customer
    if (data.buyer && !customerId) {
      // Try to find existing customer by name
      let customer = await prisma.customer.findFirst({
        where: { 
          name: {
            equals: data.buyer,
            mode: 'insensitive'
          }
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
          },
        });
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
        buyer: data.buyer || null,
        paymentStatus,
        paymentMethod: data.paymentMethod || null,
        notes: data.notes || null,
      },
    });

    // Update customer's last purchase date and total purchases if customer already existed
    if (customerId && data.customerId) {
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          lastPurchaseDate: new Date(data.saleDate),
          totalPurchases: {
            increment: quantity,
          },
        },
      });
    }

    // Only create finance record if payment status is PAID
    if (paymentStatus === "PAID") {
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
