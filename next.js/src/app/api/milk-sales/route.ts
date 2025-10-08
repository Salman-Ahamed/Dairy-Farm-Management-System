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

    // Create milk sale
    const milkSale = await prisma.milkSale.create({
      data: {
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
