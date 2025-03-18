import React from "react";
import { VaultTable } from "./vault-table";
import { MoveUpRight } from "lucide-react";

const Activity = () => {
  return (
    <div className="mt-6 px-8 lg:px-20 pt-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          Active Vaults
        </h1>
        <p className="text-gray-400 mt-2 flex items-center gap-2">
          Monitor your active vault performances
          <MoveUpRight className="w-4 h-4" />
        </p>
      </div>
      <div className="rounded-2xl bg-gray-900/50 p-6 backdrop-blur-sm border border-gray-800">
        <VaultTable />
      </div>
    </div>
  );
};

export default Activity;
