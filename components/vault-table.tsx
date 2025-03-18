import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const vaults = [
  {
    name: "ADNOC",
    symbol: "BTC",
    price: "$13,643.21",
    daily: "+$213.8",
    balance: "$13,954.04",
    apy: "8.56%",
    state: "Fixed",
    startDate: "05.10.2023",
    liquidity: "low",
  },
  {
    name: "Chips Oman",
    symbol: "USDT",
    price: "$1.00",
    daily: "+$45.1",
    balance: "$3,954.04",
    apy: "5.44%",
    state: "Fixed",
    startDate: "12.03.2023",
    liquidity: "medium",
  },
  {
    name: "RTA",
    symbol: "ETH",
    price: "$2,123.87",
    daily: "+$13.5",
    balance: "$3,954.04",
    apy: "4.12%",
    state: "Flexible",
    startDate: "21.01.2023",
    liquidity: "low",
  },
];

export function VaultTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="text-gray-400">Name</TableHead>
          <TableHead className="text-gray-400">Cashflow</TableHead>
          <TableHead className="text-gray-400">Balance</TableHead>
          <TableHead className="text-gray-400">Date</TableHead>
          <TableHead className="text-gray-400">Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vaults.map((vault, index) => (
          <TableRow
            key={vault.symbol}
            className="transition-all hover:bg-gray-800/50 cursor-pointer"
            style={{
              animation: `fadeIn 0.5s ease-out ${index * 0.1}s`,
            }}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border border-gray-700 p-1">
                  <img
                    src={`/placeholder.svg?height=32&width=32`}
                    alt={vault.name}
                    className="rounded-lg"
                  />
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-100">
                    {vault.name}
                  </div>
                  <div className="text-sm text-gray-500">{vault.price}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                {vault.daily}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-semibold">{vault.balance}</span>
            </TableCell>
            <TableCell>
              <span className="text-gray-400">{vault.startDate}</span>
            </TableCell>
            <TableCell>
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-4 rounded-full transition-all ${
                      i <
                      (vault.liquidity === "high"
                        ? 3
                        : vault.liquidity === "medium"
                        ? 2
                        : 1)
                        ? "bg-orange-500/80"
                        : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Add this CSS somewhere in your global styles
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
