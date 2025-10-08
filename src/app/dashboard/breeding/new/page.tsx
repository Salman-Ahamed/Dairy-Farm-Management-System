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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewBreedingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    dateOfBreeding: new Date().toISOString().split("T")[0],
    breedingMethod: "NATURAL",
    maleAnimalIds: [] as string[],
    femaleAnimalIds: [] as string[],
    expectedDelivery: "",
    cost: "",
    notes: "",
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

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
      const response = await fetch("/api/breeding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Breeding record added successfully",
      });
      router.push("/dashboard/breeding");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add breeding record",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/breeding">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Breeding Record
          </h1>
          <p className="text-gray-500 mt-1">Record breeding information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Breeding Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBreeding">Breeding Date *</Label>
                <Input
                  id="dateOfBreeding"
                  type="date"
                  value={formData.dateOfBreeding}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBreeding: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breedingMethod">Method *</Label>
                <Select
                  value={formData.breedingMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, breedingMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NATURAL">Natural</SelectItem>
                    <SelectItem value="ARTIFICIAL_INSEMINATION">
                      Artificial Insemination
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
                <Input
                  id="expectedDelivery"
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedDelivery: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
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
                placeholder="Note: For animal selection, please use the main breeding interface"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Record"}
              </Button>
              <Link href="/dashboard/breeding">
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
