"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate, getAgeString } from "@/lib/utils";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AnimalDetailPage() {
  const params = useParams();
  const [animal, setAnimal] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimal();
  }, []);

  const fetchAnimal = async () => {
    try {
      const response = await fetch(`/api/animals/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAnimal(data);
      }
    } catch (error) {
      console.error("Failed to fetch animal:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Animal not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      ACTIVE: "bg-green-100 text-green-800",
      SOLD: "bg-blue-100 text-blue-800",
      DECEASED: "bg-red-100 text-red-800",
      TRANSFERRED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/animals">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Animal Details: {animal.tagNumber}
            </h1>
            <p className="text-gray-500 mt-1">
              View complete animal information
            </p>
          </div>
        </div>
        <Link href={`/dashboard/animals/${animal.id}/edit`}>
          <Button>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Tag Number</p>
              <p className="text-lg font-medium">{animal.tagNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Breed</p>
              <p className="text-lg font-medium">{animal.breed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-lg font-medium">{animal.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="text-lg font-medium">
                {formatDate(animal.dateOfBirth)}
              </p>
              <p className="text-sm text-gray-500">
                Age: {getAgeString(animal.dateOfBirth)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={getStatusColor(animal.status)}>
                {animal.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Weight</p>
              <p className="text-lg font-medium">
                {animal.currentWeight
                  ? `${animal.currentWeight} kg`
                  : "Not recorded"}
              </p>
            </div>
            {animal.purchaseDate && (
              <div>
                <p className="text-sm text-gray-500">Purchase Date</p>
                <p className="text-lg font-medium">
                  {formatDate(animal.purchaseDate)}
                </p>
              </div>
            )}
            {animal.purchasePrice && (
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="text-lg font-medium">
                  {formatCurrency(animal.purchasePrice)}
                </p>
              </div>
            )}
            {animal.origin && (
              <div>
                <p className="text-sm text-gray-500">Origin</p>
                <p className="text-lg font-medium">{animal.origin}</p>
              </div>
            )}
            {animal.color && (
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="text-lg font-medium">{animal.color}</p>
              </div>
            )}
          </div>
          {animal.notes && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-base mt-1">{animal.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Records */}
      <Tabs defaultValue="health" className="w-full">
        <TabsList>
          <TabsTrigger value="health">Health Records</TabsTrigger>
          <TabsTrigger value="weight">Weight Records</TabsTrigger>
          <TabsTrigger value="milk">Milk Production</TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <Card>
            <CardHeader>
              <CardTitle>Health History</CardTitle>
            </CardHeader>
            <CardContent>
              {animal.healthRecords && animal.healthRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Disease</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animal.healthRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {formatDate(record.dateOfExamination)}
                        </TableCell>
                        <TableCell>{record.disease}</TableCell>
                        <TableCell>{record.treatment || "N/A"}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>
                          {record.cost ? formatCurrency(record.cost) : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No health records
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              {animal.weightRecords && animal.weightRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Height (cm)</TableHead>
                      <TableHead>Body Condition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animal.weightRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {formatDate(record.dateOfWeighing)}
                        </TableCell>
                        <TableCell>{record.weight} kg</TableCell>
                        <TableCell>
                          {record.height ? `${record.height} cm` : "N/A"}
                        </TableCell>
                        <TableCell>{record.bodyCondition || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No weight records
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milk">
          <Card>
            <CardHeader>
              <CardTitle>Milk Production History</CardTitle>
            </CardHeader>
            <CardContent>
              {animal.milkRecords && animal.milkRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Morning</TableHead>
                      <TableHead>Afternoon</TableHead>
                      <TableHead>Evening</TableHead>
                      <TableHead>Total (L)</TableHead>
                      <TableHead>Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {animal.milkRecords.map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{record.morningYield || 0} L</TableCell>
                        <TableCell>{record.afternoonYield || 0} L</TableCell>
                        <TableCell>{record.eveningYield || 0} L</TableCell>
                        <TableCell className="font-medium">
                          {record.totalYield} L
                        </TableCell>
                        <TableCell>{record.quality}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No milk production records
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
