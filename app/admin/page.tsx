"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
} from "@/lib/services/transactions";
import type { Transaction } from "@/lib/financial-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner"; // Change import to use sonner directly

export default function AdminPage() {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const data = await getAllTransactions("user123");
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
      toast.success("Transaction deleted successfully");
    } catch (err) {
      toast.error("Failed to delete transaction");
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      await createTransaction({
        user_id: "user123",
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description,
        type: formData.type as "income" | "expense",
        date: formData.date,
      });

      toast.success("Transaction created successfully");

      // Reset form
      setFormData({
        amount: "",
        category: "",
        description: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      // Reload transactions
      loadTransactions();
    } catch (err) {
      toast.error("Failed to create transaction");
      console.error("Transaction creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="relative">
          <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
          <main className="px-8 lg:px-20 pt-12">
            <div className="mb-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Simulate transactions and data
              </p>
            </div>

            <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-gray-100">
                  Create Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="text-red-500 mb-4">{error}</div>}
                  {success && (
                    <div className="text-green-500 mb-4">{success}</div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-400">Amount</label>
                      <input
                        type="number"
                        required
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Category</label>
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        placeholder="Enter category"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400">Date</label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-400">
                        Description
                      </label>
                      <input
                        type="text"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                        placeholder="Enter description"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 mt-4 text-sm bg-blue-600 hover:bg-blue-700 rounded-md"
                  >
                    Create Transaction
                  </button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 mt-6">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-gray-100">
                  All Transactions
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
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400 text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-gray-400"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-gray-800"
                      >
                        <TableCell className="text-gray-300">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="text-gray-300 capitalize">
                          {transaction.category}
                        </TableCell>
                        <TableCell className="text-gray-300 capitalize">
                          {transaction.type}
                        </TableCell>
                        <TableCell className="text-right text-gray-300">
                          ${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded-md"
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {transactions.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-400"
                        >
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
