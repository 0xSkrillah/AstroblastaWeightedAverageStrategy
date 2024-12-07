import React, { useState } from 'react';
import { PoolSelector } from './components/PoolSelector';
import { StrategyBuilder } from './components/StrategyBuilder';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useAstroVault } from './hooks/useAstroVault';

function App() {
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const { pools, assets, loading, error } = useAstroVault();

  const handlePoolSelect = (poolId: string) => {
    setSelectedPools(prev => 
      prev.includes(poolId)
        ? prev.filter(id => id !== poolId)
        : [...prev, poolId]
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">DeFi Strategy Comparison Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PoolSelector
            pools={pools}
            assets={assets}
            onPoolSelect={handlePoolSelect}
            selectedPools={selectedPools}
          />
          
          <StrategyBuilder
            pools={pools}
            assets={assets}
            selectedPools={selectedPools}
          />
        </div>
      </div>
    </div>
  );
}

export default App;