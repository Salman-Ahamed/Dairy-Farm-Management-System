"use client";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  DollarSign,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShoppingCart,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(null);
  const [milkSales, setMilkSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentNotes, setAdjustmentNotes] = useState("");
  const [adjustmentMethod, setAdjustmentMethod] = useState("Cash");
  const [adjusting, setAdjusting] = useState(false);
  const [settling, setSettling] = useState(false);

  useEffect(() => {
    fetchCustomerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchCustomerDetails = async () => {
    try {
      const [customerRes, salesRes] = await Promise.all([
        fetch(`/api/customers/${params.id}`),
        fetch(`/api/milk-sales`),
      ]);

      if (customerRes.ok) {
        const customerData = await customerRes.json();
        setCustomer(customerData);
      }

      if (salesRes.ok) {
        const salesData = await salesRes.json();
        // Filter sales for this customer
        const customerSales = salesData.filter(
          (sale: any) => sale.customerId === params.id
        );
        setMilkSales(customerSales);
      }
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBalanceAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdjusting(true);

    try {
      const response = await fetch(
        `/api/customers/${params.id}/adjust-balance`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            adjustmentAmount: parseFloat(adjustmentAmount),
            notes: adjustmentNotes,
            paymentMethod: adjustmentMethod,
          }),
        }
      );

      if (!response.ok) throw new Error();

      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });

      // Refresh customer data
      fetchCustomerDetails();
      setAdjustmentAmount("");
      setAdjustmentNotes("");
      setAdjustmentMethod("Cash");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust balance",
        variant: "destructive",
      });
    } finally {
      setAdjusting(false);
    }
  };

  const getPendingDues = () => {
    return milkSales.filter((sale: any) => {
      const dueAmount = sale.totalAmount - (sale.amountPaid || 0);
      // Include if status is pending/overdue OR if there's actual due amount
      return (
        sale.paymentStatus === "PENDING" ||
        sale.paymentStatus === "OVERDUE" ||
        dueAmount > 0.01 // Has actual due (with small tolerance for floating point)
      );
    });
  };

  const getTotalPendingAmount = () => {
    const pendingSales = getPendingDues();
    return pendingSales.reduce((total: number, sale: any) => {
      const dueAmount = sale.totalAmount - (sale.amountPaid || 0);
      return total + Math.max(0, dueAmount); // Only count positive dues
    }, 0);
  };

  const handleSettleDues = async () => {
    if (!customer || customer.balance <= 0) {
      toast({
        title: "Cannot Settle",
        description: "Customer has no credit balance",
        variant: "destructive",
      });
      return;
    }

    const pendingDues = getPendingDues();
    if (pendingDues.length === 0) {
      toast({
        title: "No Pending Dues",
        description: "Customer has no pending payments to settle",
      });
      return;
    }

    if (
      !confirm(
        `Auto-settle pending dues using ৳${customer.balance.toFixed(
          2
        )} credit balance?`
      )
    ) {
      return;
    }

    setSettling(true);
    try {
      const response = await fetch(`/api/customers/${params.id}/settle-dues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error();

      const result = await response.json();

      toast({
        title: "Success!",
        description: `Settled ${
          result.settled
        } sales totaling ৳${result.totalAmount.toFixed(
          2
        )}. Remaining balance: ৳${result.remainingBalance.toFixed(2)}`,
      });

      // Refresh customer data
      fetchCustomerDetails();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to settle dues",
        variant: "destructive",
      });
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center py-10">Customer not found</div>;
  }

  const balance = customer.balance || 0;
  const isPositive = balance > 0;
  const isNegative = balance < 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          <p className="text-gray-500 mt-1">Customer Details</p>
        </div>
        <Link href={`/dashboard/customers/${customer.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Customer
          </Button>
        </Link>
      </div>
      {/* Customer Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {balance === 0 ? (
              <div className="text-2xl font-bold text-gray-600">৳0.00</div>
            ) : isPositive ? (
              <>
                <div className="text-2xl font-bold text-green-600">
                  +৳{balance.toFixed(2)}
                </div>
                <p className="text-xs text-green-600 mt-1">Advance/Credit</p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">
                  -৳{Math.abs(balance).toFixed(2)}
                </div>
                <p className="text-xs text-red-600 mt-1">Due/Pending Payment</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchases
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.totalPurchases.toFixed(1)} L
            </div>
            <p className="text-xs text-gray-500 mt-1">Total milk purchased</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{milkSales.length}</div>
            <p className="text-xs text-gray-500 mt-1">Milk sale transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Default Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customer.defaultPricePerLiter
                ? `৳${customer.defaultPricePerLiter.toFixed(2)}`
                : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per liter</p>
          </CardContent>
        </Card>
      </div>
      {/* Auto-Settle Pending Dues */}
      {getPendingDues().length > 0 && customer.balance > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">
              💳 Auto-Settle Pending Dues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-orange-700">
                    <strong>{getPendingDues().length}</strong> pending sale(s)
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    ৳{getTotalPendingAmount().toFixed(2)} due
                  </p>
                </div>
                <div>
                  <p className="text-sm text-orange-700">Available Credit</p>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{customer.balance.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-orange-200">
                <p className="text-sm text-gray-700">
                  {customer.balance >= getTotalPendingAmount() ? (
                    <>
                      ✅ <strong>Can fully settle</strong> all pending dues with
                      available credit
                    </>
                  ) : (
                    <>
                      ⚠️ Can <strong>partially settle</strong> ৳
                      {customer.balance.toFixed(2)} worth of dues
                    </>
                  )}
                </p>
              </div>

              <Button
                onClick={handleSettleDues}
                disabled={settling}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {settling
                  ? "Settling..."
                  : "Auto-Settle Dues from Credit Balance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            )}

            {customer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{customer.address}</p>
                </div>
              </div>
            )}

            {customer.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{customer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Balance Adjustment */}
        <Card>
          <CardHeader>
            <CardTitle>Adjust Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBalanceAdjustment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adjustmentAmount">Adjustment Amount (৳)</Label>
                <Input
                  id="adjustmentAmount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount (+ for advance, - for deduction)"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Use positive (+) for advance payment, negative (-) for
                  refund/deduction
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustmentMethod">Payment Method</Label>
                <Select
                  value={adjustmentMethod}
                  onValueChange={setAdjustmentMethod}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Mobile Banking">
                      Mobile Banking
                    </SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adjustmentNotes">Notes</Label>
                <textarea
                  id="adjustmentNotes"
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Reason for adjustment"
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                />
              </div>

              {adjustmentAmount && (
                <div className="rounded-lg border bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Preview:
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Current Balance:
                    </span>
                    <span
                      className={`font-semibold ${
                        balance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ৳{balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">
                      After Adjustment:
                    </span>
                    <span
                      className={`font-bold ${
                        balance + parseFloat(adjustmentAmount || "0") >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ৳
                      {(balance + parseFloat(adjustmentAmount || "0")).toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              )}

              <Button type="submit" disabled={adjusting} className="w-full">
                {adjusting ? "Adjusting..." : "Adjust Balance"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {milkSales.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No purchase history available
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price/L</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Due Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milkSales.map((sale: any) => {
                  const dueAmount = sale.totalAmount - (sale.amountPaid || 0);
                  const hasDue = dueAmount > 0.01;

                  return (
                    <TableRow
                      key={sale.id}
                      className={hasDue ? "bg-orange-50" : ""}
                    >
                      <TableCell>{formatDate(sale.saleDate)}</TableCell>
                      <TableCell>{sale.quantity.toFixed(1)} L</TableCell>
                      <TableCell>
                        {formatCurrency(sale.pricePerLiter)}
                      </TableCell>
                      <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                      <TableCell>
                        {formatCurrency(sale.amountPaid || 0)}
                      </TableCell>
                      <TableCell>
                        {hasDue ? (
                          <span className="font-bold text-red-600">
                            ৳{dueAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">৳0.00</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            hasDue
                              ? "destructive" // Show as overdue if has due amount
                              : sale.paymentStatus === "PAID"
                              ? "default"
                              : sale.paymentStatus === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {hasDue ? "DUE" : sale.paymentStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
