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

export default function EditMilkRecordPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    animalId: "",
    date: "",
    morningYield: "",
    afternoonYield: "",
    eveningYield: "",
    quality: "GOOD",
    fatContent: "",
    notes: "",
  });

  useEffect(() => {
    fetchRecord();
    fetchAnimals();
  }, []);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`/api/milk/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          animalId: data.animalId,
          date: data.date.split("T")[0],
          morningYield: data.morningYield?.toString() || "",
          afternoonYield: data.afternoonYield?.toString() || "",
          eveningYield: data.eveningYield?.toString() || "",
          quality: data.quality,
          fatContent: data.fatContent?.toString() || "",
          notes: data.notes || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch milk record:", error);
    } finally {
      setFetching(false);
    }
  };

  const fetchAnimals = async () => {
    try {
      const response = await fetch("/api/animals?status=ACTIVE");
      if (response.ok) {
        const data = await response.json();
        setAnimals(data);
      }
    } catch (error) {
      console.error("Failed to fetch animals:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/milk/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Milk record updated successfully",
      });
      router.push(`/dashboard/milk/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milk record",
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
        <Link href={`/dashboard/milk/${params.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Milk Record</h1>
          <p className="text-gray-500 mt-1">Update milk production data</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milk Production Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animalId">Animal *</Label>
                <Select
                  value={formData.animalId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, animalId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal: any) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.tagNumber} - {animal.breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morningYield">Morning Yield (Liters)</Label>
                <Input
                  id="morningYield"
                  type="number"
                  step="0.1"
                  value={formData.morningYield}
                  onChange={(e) =>
                    setFormData({ ...formData, morningYield: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="afternoonYield">Afternoon Yield (Liters)</Label>
                <Input
                  id="afternoonYield"
                  type="number"
                  step="0.1"
                  value={formData.afternoonYield}
                  onChange={(e) =>
                    setFormData({ ...formData, afternoonYield: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eveningYield">Evening Yield (Liters)</Label>
                <Input
                  id="eveningYield"
                  type="number"
                  step="0.1"
                  value={formData.eveningYield}
                  onChange={(e) =>
                    setFormData({ ...formData, eveningYield: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Quality *</Label>
                <Select
                  value={formData.quality}
                  onValueChange={(value) =>
                    setFormData({ ...formData, quality: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELLENT">Excellent</SelectItem>
                    <SelectItem value="GOOD">Good</SelectItem>
                    <SelectItem value="AVERAGE">Average</SelectItem>
                    <SelectItem value="POOR">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatContent">Fat Content (%)</Label>
                <Input
                  id="fatContent"
                  type="number"
                  step="0.1"
                  value={formData.fatContent}
                  onChange={(e) =>
                    setFormData({ ...formData, fatContent: e.target.value })
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
                {loading ? "Updating..." : "Update Record"}
              </Button>
              <Link href={`/dashboard/milk/${params.id}`}>
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
