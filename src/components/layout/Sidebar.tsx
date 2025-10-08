"use client";

import { cn } from "@/lib/utils";
import {
  Baby,
  Beef,
  DollarSign,
  Heart,
  Home,
  LogOut,
  Milk,
  PackageCheck,
  ShoppingCart,
  Users,
  Wallet,
  Weight,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Animal Records",
    href: "/dashboard/animals",
    icon: Beef,
  },
  {
    title: "Milk Records",
    href: "/dashboard/milk",
    icon: Milk,
  },
  {
    title: "Milk Sales",
    href: "/dashboard/milk-sales",
    icon: DollarSign,
  },
  {
    title: "Milk Stock",
    href: "/dashboard/milk-stock",
    icon: PackageCheck,
  },
  {
    title: "Animal Health",
    href: "/dashboard/health",
    icon: Heart,
  },
  {
    title: "Animal Weight",
    href: "/dashboard/weight",
    icon: Weight,
  },
  {
    title: "Breeding",
    href: "/dashboard/breeding",
    icon: Baby,
  },
  {
    title: "Stock Feed",
    href: "/dashboard/stockfeed",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: Users,
  },
  {
    title: "Farm Finance",
    href: "/dashboard/finance",
    icon: Wallet,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-xl text-white">🐄</span>
          </div>
          <span className="text-lg">Dairy Farm</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-green-50",
                    isActive
                      ? "bg-green-100 text-green-900 font-medium"
                      : "text-gray-700"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-all hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
