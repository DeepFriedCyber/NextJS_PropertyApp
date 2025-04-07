export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    console.log(metric);
  }
}