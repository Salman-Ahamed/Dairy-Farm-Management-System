"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MilkRecordDetailPage() {
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
      const response = await fetch(`/api/milk/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.error("Failed to fetch milk record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this milk record?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/milk/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Milk record deleted successfully",
      });
      router.push("/dashboard/milk");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete milk record",
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
        <div className="text-lg">Milk record not found</div>
      </div>
    );
  }

  const getQualityColor = (quality: string) => {
    const colors: any = {
      EXCELLENT: "bg-green-100 text-green-800",
      GOOD: "bg-blue-100 text-blue-800",
      AVERAGE: "bg-yellow-100 text-yellow-800",
      POOR: "bg-red-100 text-red-800",
    };
    return colors[quality] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/milk">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Milk Record Details
            </h1>
            <p className="text-gray-500 mt-1">
              View milk production information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/milk/${record.id}/edit`}>
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
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Animal Tag</p>
              <p className="text-lg font-medium">{record.animal.tagNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">{formatDate(record.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quality</p>
              <Badge className={getQualityColor(record.quality)}>
                {record.quality}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Morning Yield</p>
              <p className="text-lg font-medium">
                {record.morningYield ? `${record.morningYield} L` : "0 L"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Afternoon Yield</p>
              <p className="text-lg font-medium">
                {record.afternoonYield ? `${record.afternoonYield} L` : "0 L"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Evening Yield</p>
              <p className="text-lg font-medium">
                {record.eveningYield ? `${record.eveningYield} L` : "0 L"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Yield</p>
              <p className="text-2xl font-bold text-primary">
                {record.totalYield} L
              </p>
            </div>
            {record.fatContent && (
              <div>
                <p className="text-sm text-gray-500">Fat Content</p>
                <p className="text-lg font-medium">{record.fatContent}%</p>
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
