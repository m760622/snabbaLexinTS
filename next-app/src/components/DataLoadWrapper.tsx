"use client";

import React, { useState, useEffect } from 'react';
import SplashView from '@/views/Welcome/SplashView';
import { DailyContentService } from '@/services/daily-content.service';

export default function DataLoadWrapper({ children }: { children: React.ReactNode }) {
    const [isDataReady, setIsDataReady] = useState(false);

    // We can skip splash if data is already loaded in window (navigation between pages)
    // But Next.js reloads on full refresh.
    // We'll use a simple state check.

    const handleDataReady = (data: any[][]) => {
        (window as any).dictionaryData = data;
        // Initialize Daily Content
        DailyContentService.getDailyContent(data);

        // Init Search Worker globally if needed or let page handle it.
        // Ideally, we might want to keep the worker alive or init it here.
        // For now, let's just mark ready.
        setIsDataReady(true);
    };

    if (!isDataReady) {
        return <SplashView onComplete={handleDataReady} />;
    }

    return <>{children}</>;
}
