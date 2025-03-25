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
import { ProfileError } from "@/lib/services/profiles";
import { toast } from "sonner"; // Change import to use sonner directly

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useFinancial();
  const [isEditing, setIsEditing] = useState(false);
  const [editedIncome, setEditedIncome] = useState("");
  const [editedSavingsGoal, setEditedSavingsGoal] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!profile) return;

    try {
      setError(null);
      await updateProfile({
        monthlyIncome: Number(editedIncome) || profile.monthlyIncome,
        savingsGoal: Number(editedSavingsGoal) || profile.savingsGoal,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message =
        err instanceof ProfileError
          ? err.message
          : "An unexpected error occurred";
      toast.error(message);
      console.error("Profile update failed:", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

  // Add error display to the UI
  if (error) {
    return <div className="text-red-500 mb-4">{error}</div>;
  }

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
                <CardHeader className="border-b border-gray-700 flex flex-row justify-between items-center">
                  <CardTitle className="text-gray-100">
                    Personal Information
                  </CardTitle>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSave();
                      } else {
                        setEditedIncome(profile.monthlyIncome.toString());
                        setEditedSavingsGoal(
                          profile.savingsGoal?.toString() || "0"
                        );
                        setIsEditing(true);
                      }
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
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
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedIncome}
                          onChange={(e) => setEditedIncome(e.target.value)}
                          className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-white mt-1">
                          ${profile.monthlyIncome}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">
                        Savings Goal
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editedSavingsGoal}
                          onChange={(e) => setEditedSavingsGoal(e.target.value)}
                          className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-white mt-1">
                          ${profile.savingsGoal || 0}
                        </p>
                      )}
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
