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
import { formatCurrency, formatDate } from "@/lib/utils";
import { Eye, Pencil, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StockFeedPage() {
  const [stockFeed, setStockFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockFeed();
  }, []);

  const fetchStockFeed = async () => {
    try {
      const response = await fetch("/api/stockfeed");
      if (response.ok) {
        const data = await response.json();
        setStockFeed(data);
      }
    } catch (error) {
      console.error("Failed to fetch stock feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Feed</h1>
          <p className="text-gray-500 mt-1">Manage animal feed inventory</p>
        </div>
        <Link href="/dashboard/stockfeed/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Stock Feed
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : stockFeed.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No stock feed found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feed Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockFeed.map((feed: any) => (
                <TableRow key={feed.id}>
                  <TableCell className="font-medium">{feed.feedName}</TableCell>
                  <TableCell>{feed.feedType.replace("_", " ")}</TableCell>
                  <TableCell>
                    {feed.currentStock} {feed.unit}
                  </TableCell>
                  <TableCell>{feed.unit}</TableCell>
                  <TableCell>{formatDate(feed.purchaseDate)}</TableCell>
                  <TableCell>{feed.supplier || "N/A"}</TableCell>
                  <TableCell>{formatCurrency(feed.totalCost)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/stockfeed/${feed.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/stockfeed/${feed.id}/edit`}>
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
