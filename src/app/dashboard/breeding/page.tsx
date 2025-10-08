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
import { formatDate } from "@/lib/utils";
import { Baby, Eye, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BreedingPage() {
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBreedingRecords();
  }, []);

  const fetchBreedingRecords = async () => {
    try {
      const response = await fetch("/api/breeding");
      if (response.ok) {
        const data = await response.json();
        setBreedingRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch breeding records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    const colors: any = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SUCCESSFUL: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      ABORTED: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[outcome]}`}
      >
        {outcome}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Breeding Records</h1>
          <p className="text-gray-500 mt-1">
            Manage animal breeding information
          </p>
        </div>
        <Link href="/dashboard/breeding/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Breeding Record
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : breedingRecords.length === 0 ? (
          <div className="text-center py-10">
            <Baby className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No breeding records found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Breeding Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Offspring</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breedingRecords.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.dateOfBreeding)}</TableCell>
                  <TableCell>
                    {record.breedingMethod.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    {record.expectedDelivery
                      ? formatDate(record.expectedDelivery)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getOutcomeBadge(record.outcome)}</TableCell>
                  <TableCell>{record.numberOfOffspring || "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/breeding/${record.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/breeding/${record.id}/edit`}>
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
