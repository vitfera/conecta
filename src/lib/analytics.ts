export const analyticsOrigin = 'https://conectasolucoesweb.com.br';

const measurementId = (import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? 'G-3TB4GDP7RY').trim();
const siteOrigin = import.meta.env.SITE ? new URL(import.meta.env.SITE).origin : undefined;

export const googleAnalyticsId =
  import.meta.env.PROD &&
  siteOrigin === analyticsOrigin &&
  measurementId &&
  /^G-[A-Z0-9]+$/.test(measurementId)
    ? measurementId
    : undefined;
