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

export default function HealthRecordDetailPage() {
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
      const response = await fetch(`/api/health/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.error("Failed to fetch health record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this health record?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/health/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Health record deleted successfully",
      });
      router.push("/dashboard/health");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete health record",
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
        <div className="text-lg">Health record not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      HEALTHY: "bg-green-100 text-green-800",
      UNDER_TREATMENT: "bg-yellow-100 text-yellow-800",
      CRITICAL: "bg-red-100 text-red-800",
      RECOVERED: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/health">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Health Record Details
            </h1>
            <p className="text-gray-500 mt-1">View animal health information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/health/${record.id}/edit`}>
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
          <CardTitle>Health Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Animal Tag</p>
              <p className="text-lg font-medium">{record.animal.tagNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Examination Date</p>
              <p className="text-lg font-medium">
                {formatDate(record.dateOfExamination)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={getStatusColor(record.status)}>
                {record.status.replace("_", " ")}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Disease</p>
              <p className="text-lg font-medium">{record.disease}</p>
            </div>
            {record.symptoms && (
              <div>
                <p className="text-sm text-gray-500">Symptoms</p>
                <p className="text-lg font-medium">{record.symptoms}</p>
              </div>
            )}
            {record.treatment && (
              <div>
                <p className="text-sm text-gray-500">Treatment</p>
                <p className="text-lg font-medium">{record.treatment}</p>
              </div>
            )}
            {record.medication && (
              <div>
                <p className="text-sm text-gray-500">Medication</p>
                <p className="text-lg font-medium">{record.medication}</p>
              </div>
            )}
            {record.veterinarian && (
              <div>
                <p className="text-sm text-gray-500">Veterinarian</p>
                <p className="text-lg font-medium">{record.veterinarian}</p>
              </div>
            )}
            {record.cost && (
              <div>
                <p className="text-sm text-gray-500">Cost</p>
                <p className="text-lg font-medium">
                  {formatCurrency(record.cost)}
                </p>
              </div>
            )}
            {record.nextCheckupDate && (
              <div>
                <p className="text-sm text-gray-500">Next Checkup Date</p>
                <p className="text-lg font-medium">
                  {formatDate(record.nextCheckupDate)}
                </p>
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
