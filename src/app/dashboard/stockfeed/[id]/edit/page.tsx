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

export default function EditStockFeedPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    feedName: "",
    feedType: "CONCENTRATE",
    quantity: "",
    unit: "kg",
    purchaseDate: "",
    expiryDate: "",
    supplier: "",
    costPerUnit: "",
    currentStock: "",
    minimumStock: "",
    notes: "",
  });

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`/api/stockfeed/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          feedName: data.feedName,
          feedType: data.feedType,
          quantity: data.quantity?.toString() || "",
          unit: data.unit,
          purchaseDate: data.purchaseDate.split("T")[0],
          expiryDate: data.expiryDate ? data.expiryDate.split("T")[0] : "",
          supplier: data.supplier || "",
          costPerUnit: data.costPerUnit?.toString() || "",
          currentStock: data.currentStock?.toString() || "",
          minimumStock: data.minimumStock?.toString() || "",
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch stock feed:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/stockfeed/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Stock feed updated successfully",
      });
      router.push(`/dashboard/stockfeed/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock feed",
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
        <Link href={`/dashboard/stockfeed/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Stock Feed</h1>
          <p className="text-gray-500 mt-1">Update feed inventory</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Feed Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedName">Feed Name *</Label>
                <Input
                  id="feedName"
                  value={formData.feedName}
                  onChange={(e) =>
                    setFormData({ ...formData, feedName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedType">Feed Type *</Label>
                <Select
                  value={formData.feedType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, feedType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONCENTRATE">Concentrate</SelectItem>
                    <SelectItem value="ROUGHAGE">Roughage</SelectItem>
                    <SelectItem value="MINERAL_SUPPLEMENT">
                      Mineral Supplement
                    </SelectItem>
                    <SelectItem value="VITAMIN_SUPPLEMENT">
                      Vitamin Supplement
                    </SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
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
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  step="0.1"
                  value={formData.currentStock}
                  onChange={(e) =>
                    setFormData({ ...formData, currentStock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock Level</Label>
                <Input
                  id="minimumStock"
                  type="number"
                  step="0.1"
                  value={formData.minimumStock}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumStock: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, purchaseDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Cost per Unit *</Label>
                <Input
                  id="costPerUnit"
                  type="number"
                  step="0.01"
                  value={formData.costPerUnit}
                  onChange={(e) =>
                    setFormData({ ...formData, costPerUnit: e.target.value })
                  }
                  required
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
                {loading ? "Updating..." : "Update Stock Feed"}
              </Button>
              <Link href={`/dashboard/stockfeed/${params.id}`}>
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
