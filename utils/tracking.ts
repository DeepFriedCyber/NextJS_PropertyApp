'use client';

interface TrackingEvent {
  name: string;
  properties?: Record<string, any>;
}

export const trackEvent = (event: TrackingEvent): void => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Tracking Event:', event);
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Implement your analytics service here
    // Example: Google Analytics, Mixpanel, etc.
    // window.gtag('event', event.name, event.properties);
  }
}; 