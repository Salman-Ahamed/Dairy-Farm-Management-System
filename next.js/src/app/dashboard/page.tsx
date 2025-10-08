import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  Beef,
  DollarSign,
  Heart,
  Milk,
  PackageCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const [
    totalAnimals,
    activeAnimals,
    healthRecords,
    todayMilkRecords,
    totalEmployees,
    monthlyMilkSales,
  ] = await Promise.all([
    prisma.animal.count(),
    prisma.animal.count({ where: { status: "ACTIVE" } }),
    prisma.animalHealth.count({ where: { status: "UNDER_TREATMENT" } }),
    prisma.milkRecord.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.employee.count({ where: { status: "ACTIVE" } }),
    prisma.milkSale.aggregate({
      _sum: { totalAmount: true },
      where: {
        saleDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const todayMilkProduction = await prisma.milkRecord.aggregate({
    _sum: { totalYield: true },
    where: {
      date: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
  });

  // Calculate milk stock
  const totalMilkProduced = await prisma.milkRecord.aggregate({
    _sum: { totalYield: true },
  });

  const totalMilkSold = await prisma.milkSale.aggregate({
    _sum: { quantity: true },
  });

  const currentMilkStock =
    (totalMilkProduced._sum.totalYield || 0) -
    (totalMilkSold._sum.quantity || 0);

  return {
    totalAnimals,
    activeAnimals,
    healthRecords,
    todayMilkRecords,
    totalEmployees,
    monthlyMilkSales: monthlyMilkSales._sum.totalAmount || 0,
    todayMilkProduction: todayMilkProduction._sum.totalYield || 0,
    currentMilkStock,
    totalMilkProduced: totalMilkProduced._sum.totalYield || 0,
    totalMilkSold: totalMilkSold._sum.quantity || 0,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "Total Animals",
      value: stats.totalAnimals,
      description: `${stats.activeAnimals} active`,
      icon: Beef,
      color: "text-blue-600",
    },
    {
      title: "Health Alerts",
      value: stats.healthRecords,
      description: "Under treatment",
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Today's Milk Production",
      value: `${stats.todayMilkProduction.toFixed(1)} L`,
      description: `${stats.todayMilkRecords} records`,
      icon: Milk,
      color: "text-green-600",
    },
    {
      title: "Current Milk Stock",
      value: `${stats.currentMilkStock.toFixed(1)} L`,
      description: `${stats.totalMilkProduced.toFixed(
        1
      )}L produced - ${stats.totalMilkSold.toFixed(1)}L sold`,
      icon: PackageCheck,
      color: stats.currentMilkStock < 100 ? "text-orange-600" : "text-cyan-600",
    },
    {
      title: "Active Employees",
      value: stats.totalEmployees,
      description: "Working staff",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Monthly Sales",
      value: `৳${stats.monthlyMilkSales.toLocaleString()}`,
      description: "This month",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your dairy farm management system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/dashboard/milk/new">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
              >
                <div className="flex items-center w-full">
                  <Milk className="mr-3 h-6 w-6 text-blue-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Add Milk Production</div>
                    <div className="text-xs text-gray-500">
                      Record daily milk yield
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/milk-sales/new">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
              >
                <div className="flex items-center w-full">
                  <DollarSign className="mr-3 h-6 w-6 text-green-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Add Milk Sale</div>
                    <div className="text-xs text-gray-500">
                      Record milk sale transaction
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
