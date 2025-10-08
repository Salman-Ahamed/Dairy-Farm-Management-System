import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  Milk,
  PackageCheck,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

async function getMilkStockData() {
  // Total milk produced (all time)
  const totalProduced = await prisma.milkRecord.aggregate({
    _sum: { totalYield: true },
  });

  // Total milk sold (all time)
  const totalSold = await prisma.milkSale.aggregate({
    _sum: { quantity: true },
  });

  // This week's production
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekProduction = await prisma.milkRecord.aggregate({
    _sum: { totalYield: true },
    where: {
      date: { gte: weekStart },
    },
  });

  // This week's sales
  const weekSales = await prisma.milkSale.aggregate({
    _sum: { quantity: true },
    where: {
      saleDate: { gte: weekStart },
    },
  });

  // This month's production
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );

  const monthProduction = await prisma.milkRecord.aggregate({
    _sum: { totalYield: true },
    where: {
      date: { gte: monthStart },
    },
  });

  // This month's sales
  const monthSales = await prisma.milkSale.aggregate({
    _sum: { quantity: true },
    where: {
      saleDate: { gte: monthStart },
    },
  });

  // Recent production records
  const recentProduction = await prisma.milkRecord.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: {
      animal: {
        select: {
          tagNumber: true,
        },
      },
    },
  });

  // Recent sales
  const recentSales = await prisma.milkSale.findMany({
    take: 5,
    orderBy: { saleDate: "desc" },
  });

  const currentStock =
    (totalProduced._sum.totalYield || 0) - (totalSold._sum.quantity || 0);
  const weekStock =
    (weekProduction._sum.totalYield || 0) - (weekSales._sum.quantity || 0);
  const monthStock =
    (monthProduction._sum.totalYield || 0) - (monthSales._sum.quantity || 0);

  return {
    currentStock,
    totalProduced: totalProduced._sum.totalYield || 0,
    totalSold: totalSold._sum.quantity || 0,
    weekProduction: weekProduction._sum.totalYield || 0,
    weekSales: weekSales._sum.quantity || 0,
    weekStock,
    monthProduction: monthProduction._sum.totalYield || 0,
    monthSales: monthSales._sum.quantity || 0,
    monthStock,
    recentProduction,
    recentSales,
  };
}

export default async function MilkStockPage() {
  const data = await getMilkStockData();

  const stockCards = [
    {
      title: "Current Stock",
      value: `${data.currentStock.toFixed(1)} L`,
      description: "Available milk",
      icon: PackageCheck,
      color:
        data.currentStock < 50
          ? "text-red-600"
          : data.currentStock < 100
          ? "text-orange-600"
          : "text-cyan-600",
      bgColor:
        data.currentStock < 50
          ? "bg-red-50"
          : data.currentStock < 100
          ? "bg-orange-50"
          : "bg-cyan-50",
    },
    {
      title: "Total Produced",
      value: `${data.totalProduced.toFixed(1)} L`,
      description: "All time",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Sold",
      value: `${data.totalSold.toFixed(1)} L`,
      description: "All time",
      icon: TrendingDown,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Milk Stock</h1>
          <p className="text-gray-500 mt-1">
            Track your milk inventory and stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/milk/new">
            <Button>
              <Milk className="mr-2 h-4 w-4" />
              Add Production
            </Button>
          </Link>
          <Link href="/dashboard/milk-sales/new">
            <Button variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Record Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {stockCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={stat.bgColor}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly and Monthly Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Production</span>
                  <span className="text-lg font-semibold text-green-600">
                    +{data.weekProduction.toFixed(1)} L
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sales</span>
                  <span className="text-lg font-semibold text-blue-600">
                    -{data.weekSales.toFixed(1)} L
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Net Change</span>
                  <span
                    className={`text-xl font-bold ${
                      data.weekStock >= 0 ? "text-cyan-600" : "text-red-600"
                    }`}
                  >
                    {data.weekStock >= 0 ? "+" : ""}
                    {data.weekStock.toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Production</span>
                  <span className="text-lg font-semibold text-green-600">
                    +{data.monthProduction.toFixed(1)} L
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sales</span>
                  <span className="text-lg font-semibold text-blue-600">
                    -{data.monthSales.toFixed(1)} L
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Net Change</span>
                  <span
                    className={`text-xl font-bold ${
                      data.monthStock >= 0 ? "text-cyan-600" : "text-red-600"
                    }`}
                  >
                    {data.monthStock >= 0 ? "+" : ""}
                    {data.monthStock.toFixed(1)} L
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Production</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentProduction.length === 0 ? (
              <p className="text-sm text-gray-500">
                No recent production records
              </p>
            ) : (
              <div className="space-y-3">
                {data.recentProduction.map((record) => (
                  <div
                    key={record.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {record.animal.tagNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-green-600 font-semibold">
                      +{record.totalYield.toFixed(1)} L
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <p className="text-sm text-gray-500">No recent sales</p>
            ) : (
              <div className="space-y-3">
                {data.recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {sale.buyer || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.saleDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-blue-600 font-semibold">
                      -{sale.quantity.toFixed(1)} L
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stock Alert */}
      {data.currentStock < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <PackageCheck className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Low Stock Alert</p>
                <p className="text-sm text-orange-700 mt-1">
                  Current milk stock is below 100 liters. Consider increasing
                  production or reducing sales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
