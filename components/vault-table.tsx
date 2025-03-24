"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFinancial } from "@/contexts/FinancialContext";

export function VaultTable() {
  const { profile, isLoading } = useFinancial();

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-gray-400">Category</TableHead>
          <TableHead className="text-gray-400">Description</TableHead>
          <TableHead className="text-gray-400">Amount</TableHead>
          <TableHead className="text-gray-400">Date</TableHead>
          <TableHead className="text-gray-400">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {profile.transactions.map((transaction, index) => (
          <TableRow
            key={transaction.id}
            className="transition-all hover:bg-gray-800/50 cursor-pointer"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
            }}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border border-gray-700 p-1">
                  <div className="h-full w-full rounded-lg bg-gray-800 flex items-center justify-center">
                    <span className="text-lg capitalize">
                      {transaction.category[0]}
                    </span>
                  </div>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-100 capitalize">
                    {transaction.category}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-gray-300">{transaction.description}</span>
            </TableCell>
            <TableCell>
              <span
                className={`font-semibold ${
                  transaction.type === "income"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-gray-400">{transaction.date}</span>
            </TableCell>
            <TableCell>
              <div className="flex gap-1.5">
                <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs">
                  Completed
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
