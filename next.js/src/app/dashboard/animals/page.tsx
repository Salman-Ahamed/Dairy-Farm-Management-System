"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { formatDate, getAgeString } from "@/lib/utils"

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const { toast } = useToast()

  const fetchAnimals = async () => {
    try {
      const response = await fetch(`/api/animals?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setAnimals(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch animals",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals()
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this animal?")) {
      return
    }

    try {
      const response = await fetch(`/api/animals/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Animal deleted successfully"
        })
        fetchAnimals()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete animal",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: any = {
      ACTIVE: "bg-green-100 text-green-800",
      SOLD: "bg-blue-100 text-blue-800",
      DECEASED: "bg-red-100 text-red-800",
      TRANSFERRED: "bg-gray-100 text-gray-800"
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
          <h1 className="text-3xl font-bold text-gray-900">Animal Records</h1>
          <p className="text-gray-500 mt-1">Manage your farm animals</p>
        </div>
        <Link href="/dashboard/animals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Animal
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by tag number, breed, or color..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : animals.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No animals found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Number</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.map((animal: any) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.tagNumber}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.gender}</TableCell>
                  <TableCell>{getAgeString(animal.dateOfBirth)}</TableCell>
                  <TableCell>{getStatusBadge(animal.status)}</TableCell>
                  <TableCell>{animal.currentWeight ? `${animal.currentWeight} kg` : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/animals/${animal.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/animals/${animal.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(animal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

