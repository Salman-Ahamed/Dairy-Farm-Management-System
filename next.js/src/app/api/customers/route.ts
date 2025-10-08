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

    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { milkSales: true },
        },
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
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

    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        defaultPricePerLiter: data.defaultPricePerLiter
          ? parseFloat(data.defaultPricePerLiter)
          : null,
        notes: data.notes || null,
      },
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

