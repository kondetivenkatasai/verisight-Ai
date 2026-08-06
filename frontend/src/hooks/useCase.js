import { useState, useEffect, useCallback } from 'react';
import { caseService } from '@/services/caseService';

export function useCase(caseId) {
  const [caseData, setCaseData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCases = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await caseService.getAll(params);
      setCases(res.data.cases || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCase = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await caseService.getById(id);
      setCaseData(res.data.case || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch case');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (caseId) {
      fetchCase(caseId);
    }
  }, [caseId, fetchCase]);

  return { caseData, cases, loading, error, fetchCases, fetchCase };
}
