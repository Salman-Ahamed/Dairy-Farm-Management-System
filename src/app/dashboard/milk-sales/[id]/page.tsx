"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Info, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MilkSaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [sale, setSale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchSale();
  }, []);

  const fetchSale = async () => {
    try {
      const response = await fetch(`/api/milk-sales/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSale(data);
      }
    } catch (error) {
      console.error("Failed to fetch milk sale:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this milk sale?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/milk-sales/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Milk sale deleted successfully",
      });
      router.push("/dashboard/milk-sales");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milk sale",
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

  if (!sale) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Milk sale not found</div>
      </div>
    );
  }

  const getPaymentColor = (status: string) => {
    const colors: any = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      OVERDUE: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/milk-sales">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Milk Sale Details
            </h1>
            <p className="text-gray-500 mt-1">View sale transaction</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/milk-sales/${sale.id}/edit`}>
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
          <CardTitle>Sale Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Sale Date</p>
              <p className="text-lg font-medium">{formatDate(sale.saleDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="text-lg font-medium">{sale.quantity} Liters</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price per Liter</p>
              <p className="text-lg font-medium">
                {formatCurrency(sale.pricePerLiter)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(sale.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge className={getPaymentColor(sale.paymentStatus)}>
                {sale.paymentStatus}
              </Badge>
            </div>
            {sale.buyer && (
              <div>
                <p className="text-sm text-gray-500">Buyer</p>
                <p className="text-lg font-medium">{sale.buyer}</p>
              </div>
            )}
            {sale.paymentMethod && (
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-lg font-medium">{sale.paymentMethod}</p>
              </div>
            )}
          </div>
          {sale.notes && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-base mt-1">{sale.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {sale.paymentStatus === "PAID" && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">
                  Automatic Finance Record
                </p>
                <p className="text-sm text-green-700 mt-1">
                  This milk sale has been automatically recorded as income in
                  Farm Finance since payment is marked as PAID.
                </p>
                <Link href="/dashboard/finance" className="inline-block mt-2">
                  <Button variant="link" className="text-green-600 p-0 h-auto">
                    View Finance Records →
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {sale.paymentStatus !== "PAID" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">
                  Pending Finance Record
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  This milk sale will be recorded in Farm Finance only when
                  payment status is updated to <strong>PAID</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
