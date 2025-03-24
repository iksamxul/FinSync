"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { analyzeSpending } from "@/lib/financial-data";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { useFinancial } from "@/contexts/FinancialContext";

export default function ChatInterface() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
  } = useChat();
  const { profile, isLoading } = useFinancial();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      const spendingAnalysis = analyzeSpending(profile);
      setAnalysis(spendingAnalysis);
    }
  }, [profile]);

  if (isLoading) return <div>Loading...</div>;
  if (!profile) return <div>No data available</div>;

  // Add this function to convert markdown bold to HTML
  const convertBoldText = (text: string) => {
    // Add color coding for transaction types
    text = text.replace(
      /Income:/g,
      '<span class="text-green-400">Income:</span>'
    );
    text = text.replace(
      /Expense:/g,
      '<span class="text-red-400">Expense:</span>'
    );

    // Add color coding for common categories
    text = text.replace(/Salary/g, '<span class="text-blue-400">Salary</span>');
    text = text.replace(/Rent/g, '<span class="text-purple-400">Rent</span>');
    text = text.replace(
      /Groceries/g,
      '<span class="text-yellow-400">Groceries</span>'
    );
    text = text.replace(
      /Utilities/g,
      '<span class="text-orange-400">Utilities</span>'
    );
    text = text.replace(
      /Shopping/g,
      '<span class="text-pink-400">Shopping</span>'
    );
    text = text.replace(/Dining/g, '<span class="text-cyan-400">Dining</span>');

    // Add icons for transaction types
    text = text.replace(/\$([\d,]+\.\d{2})/g, (match) => {
      if (text.includes("Income:")) {
        return `<span class="text-green-400">↗️ ${match}</span>`;
      } else if (text.includes("Expense:")) {
        return `<span class="text-red-400">↘️ ${match}</span>`;
      }
      return match;
    });

    // Convert bold text
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
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
                Ask Fin
              </h1>
              <p className="text-gray-400 mt-2">
                Ask fin for insights financial data and advice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 md:col-span-3">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-gray-100">
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {analysis ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-gray-300 text-sm font-medium mb-1">
                          Monthly Spending
                        </h3>
                        <p className="text-2xl font-bold text-white">
                          ${analysis.totalSpent.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {analysis.percentOfIncome.toFixed(1)}% of income
                        </p>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-gray-300 text-sm font-medium mb-1">
                          Savings Status
                        </h3>
                        <p
                          className={`text-2xl font-bold ${
                            analysis.onTrackForSavings
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {analysis.onTrackForSavings
                            ? "On Track"
                            : "Off Track"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Goal: ${profile.savingsGoal}
                        </p>
                      </div>

                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-gray-300 text-sm font-medium mb-1">
                          Top Category
                        </h3>
                        {analysis.topCategories.length > 0 && (
                          <>
                            <p className="text-2xl font-bold text-white capitalize">
                              {analysis.topCategories[0].category}
                            </p>
                            <p className="text-gray-400 text-sm">
                              ${analysis.topCategories[0].amount.toFixed(2)} (
                              {analysis.topCategories[0].percentage.toFixed(1)}
                              %)
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      Loading financial analysis...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-gray-100">Ask Fin</CardTitle>
              </CardHeader>
              <CardContent className="h-[50vh] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">
                      💬 Ask me about your finances or for spending advice...
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 [&_strong]:font-extrabold [&_strong]:text-white [&_p]:leading-relaxed ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/70 text-gray-100 backdrop-blur-sm"
                        }`}
                      >
                        {message.content.split("\n\n").map((paragraph, i) => (
                          <p
                            key={i}
                            className="mb-2 last:mb-0"
                            dangerouslySetInnerHTML={{
                              __html: convertBoldText(paragraph),
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter className="border-t p-4 border-gray-700">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about your finances..."
                    className="flex-grow bg-gray-700 text-gray-100 border-gray-600"
                    disabled={isChatLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isChatLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isChatLoading ? "Sending..." : "Send"}
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
