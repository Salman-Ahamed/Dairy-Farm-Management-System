"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Eye, Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage milk buyers and customers</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No customers found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Default Price/L</TableHead>
                <TableHead>Total Purchases</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer: any) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.phone || "N/A"}</TableCell>
                  <TableCell>{customer.email || "N/A"}</TableCell>
                  <TableCell>
                    {customer.defaultPricePerLiter
                      ? formatCurrency(customer.defaultPricePerLiter)
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {customer.totalPurchases.toFixed(1)} L
                  </TableCell>
                  <TableCell>{customer._count.milkSales} sales</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/customers/${customer.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}

