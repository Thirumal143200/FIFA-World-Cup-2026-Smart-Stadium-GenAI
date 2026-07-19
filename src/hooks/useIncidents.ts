import { useState, useEffect, useCallback } from 'react';
import type { Incident, IncidentStatus, IncidentCategory, IncidentSeverity } from '@/types';

export function useIncidents(stadiumId: string) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/incidents?stadiumId=${stadiumId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch incidents: ${res.statusText}`);
      }
      const contentType = res.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error('[useIncidents] fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error fetching incidents');
    } finally {
      setLoading(false);
    }
  }, [stadiumId]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const reportIncident = async (payload: {
    category: IncidentCategory;
    severity: IncidentSeverity;
    title: string;
    description: string;
    location: {
      zoneId: string;
      zoneName: string;
      landmark?: string;
    };
    reportedBy: {
      name: string;
      role: string;
    };
  }) => {
    try {
      setError(null);
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stadiumId,
          ...payload,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to report incident: ${res.statusText}`);
      }
      await fetchIncidents();
      return true;
    } catch (err) {
      console.error('[useIncidents] report error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error reporting incident');
      return false;
    }
  };

  const updateIncidentStatus = async (
    id: string,
    nextStatus: IncidentStatus,
    payload: {
      userId: string;
      name: string;
      role: string;
      notes?: string;
    }
  ) => {
    try {
      setError(null);
      const res = await fetch(`/api/incidents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          assignedTo: {
            userId: payload.userId,
            name: payload.name,
            role: payload.role,
          },
          notes: payload.notes,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update incident: ${res.statusText}`);
      }
      await fetchIncidents();
      return true;
    } catch (err) {
      console.error('[useIncidents] update error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error updating incident');
      return false;
    }
  };

  return {
    incidents,
    loading,
    error,
    refresh: fetchIncidents,
    reportIncident,
    updateIncidentStatus,
  };
}
