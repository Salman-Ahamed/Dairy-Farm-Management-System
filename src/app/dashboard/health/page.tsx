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
import { Eye, Heart, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HealthPage() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  const fetchHealthRecords = async () => {
    try {
      const response = await fetch("/api/health");
      if (response.ok) {
        const data = await response.json();
        setHealthRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch health records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      HEALTHY: "bg-green-100 text-green-800",
      UNDER_TREATMENT: "bg-yellow-100 text-yellow-800",
      CRITICAL: "bg-red-100 text-red-800",
      RECOVERED: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Animal Health</h1>
          <p className="text-gray-500 mt-1">
            Track and manage animal health records
          </p>
        </div>
        <Link href="/dashboard/health/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Health Record
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : healthRecords.length === 0 ? (
          <div className="text-center py-10">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No health records found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal Tag</TableHead>
                <TableHead>Examination Date</TableHead>
                <TableHead>Disease</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Veterinarian</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthRecords.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.animal.tagNumber}
                  </TableCell>
                  <TableCell>{formatDate(record.dateOfExamination)}</TableCell>
                  <TableCell>{record.disease}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{record.veterinarian || "N/A"}</TableCell>
                  <TableCell>
                    {record.cost ? `৳${record.cost}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/health/${record.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/health/${record.id}/edit`}>
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
