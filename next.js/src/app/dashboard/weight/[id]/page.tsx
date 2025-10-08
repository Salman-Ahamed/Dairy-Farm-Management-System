"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WeightRecordDetailPage() {
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
      const response = await fetch(`/api/weight/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.error("Failed to fetch weight record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this weight record?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/weight/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Weight record deleted successfully",
      });
      router.push("/dashboard/weight");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete weight record",
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
        <div className="text-lg">Weight record not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/weight">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Weight Record Details
            </h1>
            <p className="text-gray-500 mt-1">View animal weight measurement</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/weight/${record.id}/edit`}>
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
          <CardTitle>Weight Measurement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Animal Tag</p>
              <p className="text-lg font-medium">{record.animal.tagNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Weighing</p>
              <p className="text-lg font-medium">
                {formatDate(record.dateOfWeighing)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-2xl font-bold text-primary">
                {record.weight} kg
              </p>
            </div>
            {record.height && (
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="text-lg font-medium">{record.height} cm</p>
              </div>
            )}
            {record.bodyCondition && (
              <div>
                <p className="text-sm text-gray-500">Body Condition</p>
                <p className="text-lg font-medium">{record.bodyCondition}</p>
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
