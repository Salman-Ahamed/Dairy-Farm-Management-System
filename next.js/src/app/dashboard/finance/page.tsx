"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"

export default function FinancePage() {
  const [financeRecords, setFinanceRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })

  useEffect(() => {
    fetchFinanceRecords()
  }, [])

  const fetchFinanceRecords = async () => {
    try {
      const response = await fetch("/api/finance")
      if (response.ok) {
        const data = await response.json()
        setFinanceRecords(data)
        
        // Calculate stats
        const income = data.filter((r: any) => r.type === "INCOME").reduce((sum: number, r: any) => sum + r.amount, 0)
        const expense = data.filter((r: any) => r.type === "EXPENSE").reduce((sum: number, r: any) => sum + r.amount, 0)
        setStats({
          totalIncome: income,
          totalExpense: expense,
          balance: income - expense
        })
      }
    } catch (error) {
      console.error("Failed to fetch finance records:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farm Finance</h1>
          <p className="text-gray-500 mt-1">Track income and expenses</p>
        </div>
        <Link href="/dashboard/finance/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalIncome)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalExpense)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(stats.balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : financeRecords.length === 0 ? (
          <div className="text-center py-10">
            <Wallet className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-500 mt-2">No finance records found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financeRecords.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.type === "INCOME" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell className={`font-medium ${
                    record.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}>
                    {record.type === "INCOME" ? "+" : "-"}{formatCurrency(record.amount)}
                  </TableCell>
                  <TableCell>{record.paymentMethod || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

