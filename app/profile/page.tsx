"use client";

import React, { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancial } from "@/contexts/FinancialContext";
import type { Transaction } from "@/lib/financial-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProfilePage() {
  const { profile, isLoading } = useFinancial();

  const processData = (transactions: Transaction[]) => {
    // Type is now properly defined
    return transactions.reduce((acc, transaction) => {
      // ...existing processing logic...
    }, {});
  };

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <main className="px-8 lg:px-20 pt-12">
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Profile
              </h1>
              <p className="text-gray-400 mt-2">Manage your account details</p>
            </div>

            <div className="grid gap-6">
              {/* Profile Information Card */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-gray-100">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      <p className="text-lg font-semibold text-white mt-1">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <p className="text-lg font-semibold text-white mt-1">
                        {profile.name.toLowerCase().replace(" ", ".")}
                        @example.com
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">User ID</label>
                      <p className="text-lg font-semibold text-white mt-1">
                        {profile.userId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">
                        Monthly Income
                      </label>
                      <p className="text-lg font-semibold text-white mt-1">
                        ${profile.monthlyIncome}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions Card */}
              <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-gray-100">
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">
                          Description
                        </TableHead>
                        <TableHead className="text-gray-400">
                          Category
                        </TableHead>
                        <TableHead className="text-gray-400 text-right">
                          Amount
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profile.transactions.slice(0, 5).map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className="border-gray-800"
                        >
                          <TableCell className="text-gray-300">
                            {transaction.date}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {transaction.description}
                          </TableCell>
                          <TableCell className="text-gray-300 capitalize">
                            {transaction.category}
                          </TableCell>
                          <TableCell className="text-right text-gray-300">
                            ${transaction.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
