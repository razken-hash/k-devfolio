import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

@Injectable({
    providedIn: 'root',
})
export class AnalyticsService {
    private initialized = false;

    constructor() {
        if (environment.enableAnalytics) {
            this.initialize();
        }
    }

    private initialize(): void {
        if (this.initialized || typeof document === 'undefined') {
            return;
        }

        this.initialized = true;

        window.dataLayer = window.dataLayer || [];

        window.gtag = function (...args: any[]) {
            window.dataLayer.push(args);
        };

        window.gtag('js', new Date());
        window.gtag('config', environment.googleAnalyticsId);

        const script = document.createElement('script');

        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${environment.googleAnalyticsId}`;

        document.head.appendChild(script);
    }
}