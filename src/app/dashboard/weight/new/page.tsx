"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewWeightRecordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [animals, setAnimals] = useState([])
  const [formData, setFormData] = useState({
    animalId: "",
    dateOfWeighing: new Date().toISOString().split('T')[0],
    weight: "",
    height: "",
    bodyCondition: "",
    notes: ""
  })

  useEffect(() => {
    fetchAnimals()
  }, [])

  const fetchAnimals = async () => {
    try {
      const response = await fetch("/api/animals?status=ACTIVE")
      if (response.ok) {
        const data = await response.json()
        setAnimals(data)
      }
    } catch (error) {
      console.error("Failed to fetch animals:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error()
      }

      toast({
        title: "Success",
        description: "Weight record added successfully"
      })
      router.push("/dashboard/weight")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add weight record",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/weight">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Weight Record</h1>
          <p className="text-gray-500 mt-1">Record animal weight measurement</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weight Measurement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="animalId">Animal *</Label>
                <Select value={formData.animalId} onValueChange={(value) => setFormData({ ...formData, animalId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal: any) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        {animal.tagNumber} - {animal.breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfWeighing">Date *</Label>
                <Input
                  id="dateOfWeighing"
                  type="date"
                  value={formData.dateOfWeighing}
                  onChange={(e) => setFormData({ ...formData, dateOfWeighing: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyCondition">Body Condition Score</Label>
                <Input
                  id="bodyCondition"
                  placeholder="e.g., Good, Fair, Poor"
                  value={formData.bodyCondition}
                  onChange={(e) => setFormData({ ...formData, bodyCondition: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Record"}
              </Button>
              <Link href="/dashboard/weight">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
