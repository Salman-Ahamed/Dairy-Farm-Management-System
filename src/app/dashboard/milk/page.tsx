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
import { Eye, Milk, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MilkPage() {
  const [milkRecords, setMilkRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilkRecords();
  }, []);

  const fetchMilkRecords = async () => {
    try {
      const response = await fetch("/api/milk");
      if (response.ok) {
        const data = await response.json();
        setMilkRecords(data);
      }
    } catch (error) {
      console.error("Failed to fetch milk records:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milk Production</h1>
          <p className="text-gray-500 mt-1">
            Track daily milk production records
          </p>
        </div>
        <Link href="/dashboard/milk/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Milk Record
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : milkRecords.length === 0 ? (
          <div className="text-center py-10">
            <Milk className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No milk records found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal Tag</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Morning (L)</TableHead>
                <TableHead>Afternoon (L)</TableHead>
                <TableHead>Evening (L)</TableHead>
                <TableHead>Total (L)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milkRecords.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.animal.tagNumber}
                  </TableCell>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.morningYield || "0"}</TableCell>
                  <TableCell>{record.afternoonYield || "0"}</TableCell>
                  <TableCell>{record.eveningYield || "0"}</TableCell>
                  <TableCell className="font-medium">
                    {record.totalYield}
                  </TableCell>
                  <TableCell>{record.quality}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/milk/${record.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/milk/${record.id}/edit`}>
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
