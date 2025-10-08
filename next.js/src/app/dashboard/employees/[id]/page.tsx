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

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await fetch(`/api/employees/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      }
    } catch (error) {
      console.error("Failed to fetch employee:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/employees/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
      router.push("/dashboard/employees");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
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

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Employee not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-gray-100 text-gray-800",
      TERMINATED: "bg-red-100 text-red-800",
      RESIGNED: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employee Details
            </h1>
            <p className="text-gray-500 mt-1">View employee information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/employees/${employee.id}/edit`}>
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
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-lg font-medium">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium">{employee.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge className={getStatusColor(employee.status)}>
                {employee.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Position</p>
              <p className="text-lg font-medium">{employee.position}</p>
            </div>
            {employee.department && (
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-lg font-medium">{employee.department}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Salary</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(employee.salary)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Joining</p>
              <p className="text-lg font-medium">
                {formatDate(employee.dateOfJoining)}
              </p>
            </div>
            {employee.dateOfLeaving && (
              <div>
                <p className="text-sm text-gray-500">Date of Leaving</p>
                <p className="text-lg font-medium">
                  {formatDate(employee.dateOfLeaving)}
                </p>
              </div>
            )}
            {employee.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-lg font-medium">{employee.phone}</p>
              </div>
            )}
            {employee.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-medium">{employee.email}</p>
              </div>
            )}
          </div>
          {employee.address && (
            <div className="mt-6">
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base mt-1">{employee.address}</p>
            </div>
          )}
          {employee.notes && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Notes</p>
              <p className="text-base mt-1">{employee.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
