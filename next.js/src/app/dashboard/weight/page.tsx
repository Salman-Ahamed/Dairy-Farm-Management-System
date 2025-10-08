"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Weight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function WeightPage() {
  const [weightRecords, setWeightRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeightRecords()
  }, [])

  const fetchWeightRecords = async () => {
    try {
      const response = await fetch("/api/weight")
      if (response.ok) {
        const data = await response.json()
        setWeightRecords(data)
      }
    } catch (error) {
      console.error("Failed to fetch weight records:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Animal Weight</h1>
          <p className="text-gray-500 mt-1">Track animal weight measurements</p>
        </div>
        <Link href="/dashboard/weight/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Weight Record
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : weightRecords.length === 0 ? (
          <div className="text-center py-10">
            <Weight className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No weight records found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Animal Tag</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Height (cm)</TableHead>
                <TableHead>Body Condition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {weightRecords.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.animal.tagNumber}</TableCell>
                  <TableCell>{formatDate(record.dateOfWeighing)}</TableCell>
                  <TableCell>{record.weight} kg</TableCell>
                  <TableCell>{record.height ? `${record.height} cm` : "N/A"}</TableCell>
                  <TableCell>{record.bodyCondition || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

