import { useEffect } from 'react';

const SCRIPT_ID = 'umami-tracker';

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      trackView: (path: string, data?: Record<string, unknown>) => void;
    };
  }
}

export const UmamiAnalytics = () => {
  useEffect(() => {
    if (!import.meta.env.PROD) {
      return;
    }

    const scriptUrl = import.meta.env.VITE_UMAMI_SCRIPT_URL;
    const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID;

    if (!scriptUrl || !websiteId) {
      console.warn('Umami analytics disabled: missing script URL or website ID');
      return;
    }

    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.dataset.websiteId = websiteId;
    script.id = SCRIPT_ID;

    const hostUrl = import.meta.env.VITE_UMAMI_HOST_URL;
    if (hostUrl) {
      script.dataset.hostUrl = hostUrl;
    }

    const domains = import.meta.env.VITE_UMAMI_DATA_DOMAINS;
    if (domains) {
      script.dataset.domains = domains;
    }

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};
