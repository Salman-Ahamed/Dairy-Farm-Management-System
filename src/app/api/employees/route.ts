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

    const employees = await prisma.employee.findMany({
      orderBy: { dateOfJoining: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
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

    const employee = await prisma.employee.create({
      data: {
        employeeId: data.employeeId,
        name: data.name,
        position: data.position,
        department: data.department || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        dateOfJoining: new Date(data.dateOfJoining),
        dateOfLeaving: data.dateOfLeaving ? new Date(data.dateOfLeaving) : null,
        salary: parseFloat(data.salary),
        status: data.status || "ACTIVE",
        notes: data.notes || null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error: any) {
    console.error("Error creating employee:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Employee ID already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
