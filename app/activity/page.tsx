'use client';

import React from 'react';

// This page would eventually show transaction history or other user activities.

export default function ActivityPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <main className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
            <div className="p-6 bg-card rounded-lg shadow border">
                <p className="text-muted-foreground">Activity feed and transaction history coming soon!</p>
            </div>
            {/* Placeholder for activity list */}
        </main>
    </div>
  );
}
