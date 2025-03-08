import { useState, useEffect } from 'react';

interface HealthCheckResponse {
  status: string;
  version: string;
}

export const useHealthCheck = () => {
  const [health, setHealth] = useState<HealthCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/health`);
        if (!response.ok) {
          throw new Error('Health check failed');
        }
        const data = await response.json();
        setHealth(data);
      } catch (err) {
        setError('API unavailable');
        console.error('Health check error:', err);
      }
    };

    checkHealth();
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 300000);

    return () => clearInterval(interval);
  }, []);

  return { health, error };
}; 