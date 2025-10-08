"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  defaultPricePerLiter?: number | null;
  totalPurchases: number;
  balance: number;
}

export default function NewMilkSalePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [formData, setFormData] = useState({
    saleDate: new Date().toISOString().split("T")[0],
    quantity: "",
    pricePerLiter: "80",
    amountPaid: "",
    buyer: "",
    customerId: "",
    paymentStatus: "PENDING",
    paymentMethod: "",
    notes: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Auto-update payment status based on payment calculation
  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    const autoPayment = getAutoPaymentFromBalance();
    const manualPayment = parseFloat(formData.amountPaid) || 0;
    const totalPaid = autoPayment + manualPayment;

    // Auto-update payment status
    if (totalAmount > 0 && totalPaid >= totalAmount) {
      // Fully paid
      if (formData.paymentStatus !== "PAID") {
        setFormData((prev) => ({ ...prev, paymentStatus: "PAID" }));
      }
    } else if (totalPaid > 0 && totalPaid < totalAmount) {
      // Partially paid - keep as PENDING
      if (formData.paymentStatus === "PAID") {
        setFormData((prev) => ({ ...prev, paymentStatus: "PENDING" }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.quantity,
    formData.pricePerLiter,
    formData.amountPaid,
    selectedCustomer?.balance,
  ]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        ...formData,
        customerId: customer.id,
        buyer: customer.name,
        pricePerLiter:
          customer.defaultPricePerLiter?.toString() || formData.pricePerLiter,
        amountPaid: "", // Will be calculated based on balance
      });
    }
  };

  const handleBuyerNameChange = (name: string) => {
    setFormData({ ...formData, buyer: name, customerId: "" });
    setSelectedCustomer(null);
  };

  const calculateTotalAmount = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const pricePerLiter = parseFloat(formData.pricePerLiter) || 0;
    return quantity * pricePerLiter;
  };

  const calculateBalanceChange = () => {
    const totalAmount = calculateTotalAmount();
    const amountPaid = parseFloat(formData.amountPaid) || 0;
    return amountPaid - totalAmount;
  };

  const getAutoPaymentFromBalance = () => {
    if (!selectedCustomer || selectedCustomer.balance <= 0) return 0;
    const totalAmount = calculateTotalAmount();
    // Use customer's balance up to the total amount
    return Math.min(selectedCustomer.balance, totalAmount);
  };

  const getRemainingAmount = () => {
    const totalAmount = calculateTotalAmount();
    const autoPayment = getAutoPaymentFromBalance();
    const manualPayment = parseFloat(formData.amountPaid) || 0;
    return totalAmount - autoPayment - manualPayment;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const autoPayment = getAutoPaymentFromBalance();
      const manualPayment = parseFloat(formData.amountPaid) || 0;

      // Send only manual payment, backend will calculate auto-payment
      const submissionData = {
        ...formData,
        amountPaid: manualPayment, // Only manual payment
        autoPayment: autoPayment, // Send auto-payment separately for backend
      };

      const response = await fetch("/api/milk-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error();

      const totalPaid = autoPayment + manualPayment;
      toast({
        title: "Success",
        description:
          autoPayment > 0
            ? `Milk sale recorded! ৳${autoPayment.toFixed(
                2
              )} auto-paid from credit${
                manualPayment > 0 ? ` + ৳${manualPayment.toFixed(2)} cash` : ""
              }.`
            : "Milk sale recorded successfully",
      });
      router.push("/dashboard/milk-sales");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record milk sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/milk-sales">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Milk Sale</h1>
          <p className="text-gray-500 mt-1">Record milk sale transaction</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-purple-900">
                  💰 Auto Balance Payment
                </p>
                <p className="text-sm text-purple-700 mt-1">
                  Customer&apos;s existing <strong>credit/advance</strong> will
                  be <strong>automatically applied</strong> to this sale!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">
                  Automatic Finance Tracking
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  If payment status is set to <strong>PAID</strong>, this milk
                  sale will be automatically recorded as <strong>Income</strong>{" "}
                  in your Farm Finance records.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">
                  Auto Customer Registration
                </p>
                <p className="text-sm text-green-700 mt-1">
                  If buyer name is new, customer will be{" "}
                  <strong>automatically created</strong> with default rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sale Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saleDate">Sale Date *</Label>
                <Input
                  id="saleDate"
                  type="date"
                  value={formData.saleDate}
                  onChange={(e) =>
                    setFormData({ ...formData, saleDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (Liters) *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer">Select Existing Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={handleCustomerSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                        {customer.defaultPricePerLiter &&
                          ` - ${customer.defaultPricePerLiter}৳/L`}
                        {customer.balance > 0 &&
                          ` 💰 (Credit: ৳${customer.balance.toFixed(0)})`}
                        {customer.balance < 0 &&
                          ` ⚠️ (Due: ৳${Math.abs(customer.balance).toFixed(
                            0
                          )})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerLiter">Price per Liter *</Label>
                <Input
                  id="pricePerLiter"
                  type="number"
                  step="0.01"
                  value={formData.pricePerLiter}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerLiter: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="buyer">Or Enter New Buyer Name</Label>
                <Input
                  id="buyer"
                  placeholder="Type new customer name"
                  value={formData.buyer}
                  onChange={(e) => handleBuyerNameChange(e.target.value)}
                />
                {selectedCustomer && (
                  <div className="space-y-1">
                    {selectedCustomer.defaultPricePerLiter && (
                      <p className="text-sm text-green-600">
                        ✓ Using default price:{" "}
                        {selectedCustomer.defaultPricePerLiter}৳/L
                      </p>
                    )}
                    {selectedCustomer.balance > 0 && (
                      <p className="text-sm text-blue-600 font-semibold">
                        💰 Available Credit: ৳
                        {selectedCustomer.balance.toFixed(2)}
                      </p>
                    )}
                    {selectedCustomer.balance < 0 && (
                      <p className="text-sm text-red-600 font-semibold">
                        ⚠️ Pending Due: ৳
                        {Math.abs(selectedCustomer.balance).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">
                  Payment Status
                  {getRemainingAmount() <= 0 && formData.quantity && (
                    <span className="text-green-600 text-xs ml-2">
                      ✓ Auto-updated
                    </span>
                  )}
                </Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                {formData.paymentStatus === "PAID" &&
                  getRemainingAmount() <= 0 &&
                  formData.quantity && (
                    <p className="text-xs text-green-600">
                      ✓ Status automatically set to PAID (fully paid)
                    </p>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Input
                  id="paymentMethod"
                  placeholder="e.g., Cash, Bank Transfer"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPaid">
                  Additional Payment (৳)
                  {selectedCustomer && selectedCustomer.balance > 0 && (
                    <span className="text-blue-600 text-xs ml-2">
                      (Credit will be auto-applied)
                    </span>
                  )}
                </Label>
                <Input
                  id="amountPaid"
                  type="number"
                  step="0.01"
                  placeholder="Additional cash payment (optional)"
                  value={formData.amountPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, amountPaid: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  {selectedCustomer && selectedCustomer.balance > 0
                    ? "Enter only if customer pays extra cash"
                    : "Amount actually paid by customer"}
                </p>
              </div>
            </div>

            {/* Summary Section */}
            {formData.quantity && formData.pricePerLiter && (
              <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
                <h4 className="font-semibold text-gray-900">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold">
                      ৳{calculateTotalAmount().toFixed(2)}
                    </span>
                  </div>

                  {/* Auto-payment from balance */}
                  {selectedCustomer && selectedCustomer.balance > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span className="font-medium">
                        Auto-paid from Credit:
                      </span>
                      <span className="font-semibold">
                        -৳{getAutoPaymentFromBalance().toFixed(2)}
                      </span>
                    </div>
                  )}

                  {/* Manual payment */}
                  {formData.amountPaid &&
                    parseFloat(formData.amountPaid) > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-medium">Additional Payment:</span>
                        <span className="font-semibold">
                          -৳{parseFloat(formData.amountPaid).toFixed(2)}
                        </span>
                      </div>
                    )}

                  {/* Remaining amount */}
                  <div
                    className={`flex justify-between pt-2 border-t font-bold ${
                      getRemainingAmount() > 0
                        ? "text-red-600"
                        : getRemainingAmount() < 0
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    <span>
                      {getRemainingAmount() > 0
                        ? "Remaining Due:"
                        : getRemainingAmount() < 0
                        ? "New Advance:"
                        : "Status:"}
                    </span>
                    <span>
                      {getRemainingAmount() === 0
                        ? "Fully Paid ✓"
                        : `৳${Math.abs(getRemainingAmount()).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Sale"}
              </Button>
              <Link href="/dashboard/milk-sales">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
