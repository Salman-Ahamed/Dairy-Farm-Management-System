import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  Beef,
  Clock,
  DollarSign,
  Heart,
  Milk,
  PackageCheck,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}

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

async function getRecentActivities() {
  const [
    recentMilkRecords,
    recentMilkSales,
    recentHealthRecords,
    recentAnimals,
    recentStockFeed,
  ] = await Promise.all([
    prisma.milkRecord.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { animal: true },
    }),
    prisma.milkSale.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
    prisma.animalHealth.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      include: { animal: true },
    }),
    prisma.animal.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    }),
    prisma.stockFeed.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Combine and sort all activities
  const activities = [
    ...recentMilkRecords.map((record) => ({
      type: "milk_production",
      title: `Milk Production: ${record.animal.tagNumber}`,
      description: `${record.totalYield}L recorded`,
      time: record.createdAt,
      icon: "milk",
    })),
    ...recentMilkSales.map((sale) => ({
      type: "milk_sale",
      title: `Milk Sale: ${sale.buyer || "Customer"}`,
      description: `${sale.quantity}L - ৳${sale.totalAmount}`,
      time: sale.createdAt,
      icon: "sale",
    })),
    ...recentHealthRecords.map((health) => ({
      type: "health",
      title: `Health Check: ${health.animal.tagNumber}`,
      description: health.disease || "General checkup",
      time: health.createdAt,
      icon: "health",
    })),
    ...recentAnimals.map((animal) => ({
      type: "animal",
      title: `New Animal: ${animal.tagNumber}`,
      description: `${animal.breed} - ${animal.gender}`,
      time: animal.createdAt,
      icon: "animal",
    })),
    ...recentStockFeed.map((feed) => ({
      type: "stock_feed",
      title: `Stock Feed: ${feed.feedName}`,
      description: `${feed.quantity}${feed.unit} - ৳${feed.totalCost}`,
      time: feed.createdAt,
      icon: "feed",
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  return activities;
}

export default async function DashboardPage() {
  const [stats, recentActivities] = await Promise.all([
    getDashboardStats(),
    getRecentActivities(),
  ]);

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
            {recentActivities.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No recent activity to display
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity, index) => {
                  const getIcon = () => {
                    switch (activity.icon) {
                      case "milk":
                        return <Milk className="h-4 w-4 text-blue-600" />;
                      case "sale":
                        return (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        );
                      case "health":
                        return <Heart className="h-4 w-4 text-red-600" />;
                      case "animal":
                        return <Beef className="h-4 w-4 text-purple-600" />;
                      case "feed":
                        return (
                          <ShoppingCart className="h-4 w-4 text-orange-600" />
                        );
                      default:
                        return <Clock className="h-4 w-4 text-gray-600" />;
                    }
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mt-0.5">{getIcon()}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {getTimeAgo(activity.time)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
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
            <Link href="/dashboard/health/new">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
              >
                <div className="flex items-center w-full">
                  <Heart className="mr-3 h-6 w-6 text-red-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Add Health Record</div>
                    <div className="text-xs text-gray-500">
                      Record animal health check
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/stockfeed/new">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4"
              >
                <div className="flex items-center w-full">
                  <ShoppingCart className="mr-3 h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Add Stock Feed</div>
                    <div className="text-xs text-gray-500">
                      Purchase feed inventory
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
