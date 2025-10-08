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

export default function FinanceRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRecord();
  }, []);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/finance/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.error("Failed to fetch finance record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this finance record?"))
      return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/finance/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Finance record deleted successfully",
      });
      router.push("/dashboard/finance");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete finance record",
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

  if (!record) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Finance record not found</div>
      </div>
    );
  }

  const getTypeColor = (type: string) => {
    return type === "INCOME"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/finance">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transaction Details
            </h1>
            <p className="text-gray-500 mt-1">View finance transaction</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/finance/${record.id}/edit`}>
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
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">{formatDate(record.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <Badge className={getTypeColor(record.type)}>{record.type}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p
                className={`text-2xl font-bold ${
                  record.type === "INCOME" ? "text-green-600" : "text-red-600"
                }`}
              >
                {record.type === "INCOME" ? "+" : "-"}
                {formatCurrency(record.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="text-lg font-medium">{record.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-lg font-medium">{record.description}</p>
            </div>
            {record.paymentMethod && (
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-lg font-medium">{record.paymentMethod}</p>
              </div>
            )}
            {record.referenceNumber && (
              <div>
                <p className="text-sm text-gray-500">Reference Number</p>
                <p className="text-lg font-medium">{record.referenceNumber}</p>
              </div>
            )}
          </div>
          {record.notes && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-base mt-1">{record.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
