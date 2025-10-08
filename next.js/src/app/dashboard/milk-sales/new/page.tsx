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
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMilkSalePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    saleDate: new Date().toISOString().split("T")[0],
    quantity: "",
    pricePerLiter: "",
    buyer: "",
    paymentStatus: "PENDING",
    paymentMethod: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/milk-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Milk sale recorded successfully",
      });
      router.push("/dashboard/milk-sales");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record milk sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/milk-sales">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Milk Sale</h1>
          <p className="text-gray-500 mt-1">Record milk sale transaction</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">
                  Automatic Finance Tracking
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  If payment status is set to <strong>PAID</strong>, this milk
                  sale will be automatically recorded as <strong>Income</strong>{" "}
                  in your Farm Finance records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">
                  Auto Customer Registration
                </p>
                <p className="text-sm text-green-700 mt-1">
                  If buyer name is new, customer will be <strong>automatically created</strong> with default rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                <Label htmlFor="paymentStatus">Payment Status</Label>
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
                {loading ? "Creating..." : "Create Sale"}
              </Button>
              <Link href="/dashboard/milk-sales">
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
