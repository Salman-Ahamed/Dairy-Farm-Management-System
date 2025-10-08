"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMilkSalePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    saleDate: "",
    quantity: "",
    pricePerLiter: "",
    amountPaid: "",
    buyer: "",
    customerId: "",
    paymentStatus: "PENDING",
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    fetchSale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSale = async () => {
    try {
      const response = await fetch(`/api/milk-sales/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          saleDate: data.saleDate.split("T")[0],
          quantity: data.quantity?.toString() || "",
          pricePerLiter: data.pricePerLiter?.toString() || "",
          amountPaid: data.amountPaid?.toString() || "0",
          buyer: data.buyer || "",
          customerId: data.customerId || "",
          paymentStatus: data.paymentStatus,
          paymentMethod: data.paymentMethod || "",
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch milk sale:", error);
    } finally {
      setFetching(false);
    }
  };

  const calculateTotalAmount = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const pricePerLiter = parseFloat(formData.pricePerLiter) || 0;
    return quantity * pricePerLiter;
  };

  const calculateBalanceChange = () => {
    const totalAmount = calculateTotalAmount();
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    return amountPaid - totalAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/milk-sales/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Milk sale updated successfully",
      });
      router.push(`/dashboard/milk-sales/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milk sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/milk-sales/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Milk Sale</h1>
          <p className="text-gray-500 mt-1">Update sale transaction</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Sale Date *</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) =>
                    setFormData({ ...formData, saleDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Liters) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerLiter">Price per Liter *</Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.01"
                  value={formData.pricePerLiter}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerLiter: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer">Buyer Name</Label>
                <Input
                  id="buyer"
                  value={formData.buyer}
                  onChange={(e) =>
                    setFormData({ ...formData, buyer: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status *</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid (৳)</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  placeholder="Amount actually paid"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, amountPaid: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Leave empty or 0 for pending payment
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Input
                  id="paymentMethod"
                  placeholder="e.g., Cash, Bank Transfer"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Summary Section */}
            {formData.quantity && formData.pricePerLiter && (
              <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">
                      ৳{calculateTotalAmount().toFixed(2)}
                    </span>
                  </div>
                  {formData.amountPaid && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid:</span>
                        <span className="font-semibold">
                          ৳{parseFloat(formData.amountPaid).toFixed(2)}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between pt-2 border-t ${
                          calculateBalanceChange() >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <span className="font-semibold">
                          {calculateBalanceChange() >= 0
                            ? "Advance/Credit:"
                            : "Due/Pending:"}
                        </span>
                        <span className="font-bold">
                          ৳{Math.abs(calculateBalanceChange()).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Sale"}
              </Button>
              <Link href={`/dashboard/milk-sales/${params.id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
