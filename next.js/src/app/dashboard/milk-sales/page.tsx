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
import { Plus, DollarSign } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"

export default function MilkSalesPage() {
  const [milkSales, setMilkSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMilkSales()
  }, [])

  const fetchMilkSales = async () => {
    try {
      const response = await fetch("/api/milk-sales")
      if (response.ok) {
        const data = await response.json()
        setMilkSales(data)
      }
    } catch (error) {
      console.error("Failed to fetch milk sales:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentBadge = (status: string) => {
    const colors: any = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-green-100 text-green-800",
      OVERDUE: "bg-red-100 text-red-800"
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milk Sales</h1>
          <p className="text-gray-500 mt-1">Track milk sales and revenue</p>
        </div>
        <Link href="/dashboard/milk-sales/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Sale Record
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : milkSales.length === 0 ? (
          <div className="text-center py-10">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No milk sales found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sale Date</TableHead>
                <TableHead>Quantity (L)</TableHead>
                <TableHead>Price/Liter</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milkSales.map((sale: any) => (
                <TableRow key={sale.id}>
                  <TableCell>{formatDate(sale.saleDate)}</TableCell>
                  <TableCell>{sale.quantity} L</TableCell>
                  <TableCell>{formatCurrency(sale.pricePerLiter)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell>{sale.buyer || "N/A"}</TableCell>
                  <TableCell>{getPaymentBadge(sale.paymentStatus)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

