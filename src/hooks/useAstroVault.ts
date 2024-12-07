import { useState, useEffect } from 'react';
import { Pool, Asset } from '../types';
import { fetchPools, fetchAssets, fetchFarms } from '../api/astrovault';

export const useAstroVault = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [poolsData, assetsData, farmsData] = await Promise.all([
          fetchPools(),
          fetchAssets(),
          fetchFarms()
        ]);

        if (!mounted) return;

        setPools(poolsData);
        setAssets(assetsData);
        setFarms(farmsData);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  return { pools, assets, farms, loading, error };
};