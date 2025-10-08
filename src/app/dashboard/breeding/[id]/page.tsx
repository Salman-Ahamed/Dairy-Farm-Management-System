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

export default function BreedingRecordDetailPage() {
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
      const response = await fetch(`/api/breeding/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setRecord(data);
      }
    } catch (error) {
      console.error("Failed to fetch breeding record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this breeding record?"))
      return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/breeding/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Breeding record deleted successfully",
      });
      router.push("/dashboard/breeding");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete breeding record",
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
        <div className="text-lg">Breeding record not found</div>
      </div>
    );
  }

  const getOutcomeColor = (outcome: string) => {
    const colors: any = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SUCCESSFUL: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      ABORTED: "bg-gray-100 text-gray-800",
    };
    return colors[outcome] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/breeding">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Breeding Record Details
            </h1>
            <p className="text-gray-500 mt-1">View breeding information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/breeding/${record.id}/edit`}>
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
          <CardTitle>Breeding Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Breeding Date</p>
              <p className="text-lg font-medium">
                {formatDate(record.dateOfBreeding)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Breeding Method</p>
              <p className="text-lg font-medium">
                {record.breedingMethod.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Outcome</p>
              <Badge className={getOutcomeColor(record.outcome)}>
                {record.outcome}
              </Badge>
            </div>
            {record.expectedDelivery && (
              <div>
                <p className="text-sm text-gray-500">Expected Delivery</p>
                <p className="text-lg font-medium">
                  {formatDate(record.expectedDelivery)}
                </p>
              </div>
            )}
            {record.actualDelivery && (
              <div>
                <p className="text-sm text-gray-500">Actual Delivery</p>
                <p className="text-lg font-medium">
                  {formatDate(record.actualDelivery)}
                </p>
              </div>
            )}
            {record.numberOfOffspring && (
              <div>
                <p className="text-sm text-gray-500">Number of Offspring</p>
                <p className="text-lg font-medium">
                  {record.numberOfOffspring}
                </p>
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
          </div>

          {record.maleAnimals && record.maleAnimals.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Male Animals</p>
              <div className="flex flex-wrap gap-2">
                {record.maleAnimals.map((ma: any) => (
                  <Badge key={ma.id} variant="secondary">
                    {ma.animal.tagNumber}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {record.femaleAnimals && record.femaleAnimals.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Female Animals</p>
              <div className="flex flex-wrap gap-2">
                {record.femaleAnimals.map((fa: any) => (
                  <Badge key={fa.id} variant="secondary">
                    {fa.animal.tagNumber}
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
