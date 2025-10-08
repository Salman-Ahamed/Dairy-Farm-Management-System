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

export default function NewHealthRecordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [animals, setAnimals] = useState([])
  const [formData, setFormData] = useState({
    animalId: "",
    dateOfExamination: new Date().toISOString().split('T')[0],
    disease: "",
    symptoms: "",
    treatment: "",
    medication: "",
    veterinarian: "",
    cost: "",
    nextCheckupDate: "",
    status: "UNDER_TREATMENT",
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
      const response = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error()
      }

      toast({
        title: "Success",
        description: "Health record added successfully"
      })
      router.push("/dashboard/health")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add health record",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/health">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Health Record</h1>
          <p className="text-gray-500 mt-1">Record animal health examination</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Examination Details</CardTitle>
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
                <Label htmlFor="dateOfExamination">Examination Date *</Label>
                <Input
                  id="dateOfExamination"
                  type="date"
                  value={formData.dateOfExamination}
                  onChange={(e) => setFormData({ ...formData, dateOfExamination: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disease">Disease/Condition *</Label>
                <Input
                  id="disease"
                  value={formData.disease}
                  onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian</Label>
                <Input
                  id="veterinarian"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medication">Medication</Label>
                <Input
                  id="medication"
                  value={formData.medication}
                  onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Cost</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextCheckupDate">Next Checkup Date</Label>
                <Input
                  id="nextCheckupDate"
                  type="date"
                  value={formData.nextCheckupDate}
                  onChange={(e) => setFormData({ ...formData, nextCheckupDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEALTHY">Healthy</SelectItem>
                    <SelectItem value="UNDER_TREATMENT">Under Treatment</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="RECOVERED">Recovered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <textarea
                id="symptoms"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment</Label>
              <textarea
                id="treatment"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              />
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
              <Link href="/dashboard/health">
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
