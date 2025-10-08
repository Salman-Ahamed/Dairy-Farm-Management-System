"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StockFeedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [feed, setFeed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await fetch(`/api/stockfeed/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFeed(data);
      }
    } catch (error) {
      console.error("Failed to fetch stock feed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this stock feed?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/stockfeed/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Stock feed deleted successfully",
      });
      router.push("/dashboard/stockfeed");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete stock feed",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!feed) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Stock feed not found</div>
      </div>
    );
  }

  const isLowStock =
    feed.minimumStock && feed.currentStock <= feed.minimumStock;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/stockfeed">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Stock Feed Details
            </h1>
            <p className="text-gray-500 mt-1">View feed inventory</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/stockfeed/${feed.id}/edit`}>
            <Button>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feed Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Feed Name</p>
              <p className="text-lg font-medium">{feed.feedName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Feed Type</p>
              <p className="text-lg font-medium">
                {feed.feedType.replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Stock</p>
              <p
                className={`text-2xl font-bold ${
                  isLowStock ? "text-red-600" : "text-primary"
                }`}
              >
                {feed.currentStock} {feed.unit}
              </p>
              {isLowStock && (
                <Badge className="bg-red-100 text-red-800 mt-1">
                  Low Stock
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">Unit</p>
              <p className="text-lg font-medium">{feed.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Purchase Date</p>
              <p className="text-lg font-medium">
                {formatDate(feed.purchaseDate)}
              </p>
            </div>
            {feed.expiryDate && (
              <div>
                <p className="text-sm text-gray-500">Expiry Date</p>
                <p className="text-lg font-medium">
                  {formatDate(feed.expiryDate)}
                </p>
              </div>
            )}
            {feed.supplier && (
              <div>
                <p className="text-sm text-gray-500">Supplier</p>
                <p className="text-lg font-medium">{feed.supplier}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Cost per Unit</p>
              <p className="text-lg font-medium">
                {formatCurrency(feed.costPerUnit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-lg font-medium">
                {formatCurrency(feed.totalCost)}
              </p>
            </div>
            {feed.minimumStock && (
              <div>
                <p className="text-sm text-gray-500">Minimum Stock Level</p>
                <p className="text-lg font-medium">
                  {feed.minimumStock} {feed.unit}
                </p>
              </div>
            )}
          </div>
          {feed.notes && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-base mt-1">{feed.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
