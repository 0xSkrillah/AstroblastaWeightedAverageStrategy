import React from 'react';
import { Pool, Asset } from '../types';
import { formatPercentage } from '../utils/calculations';

interface PoolSelectorProps {
  pools: Pool[];
  assets: Asset[];
  onPoolSelect: (poolId: string) => void;
  selectedPools: string[];
}

export const PoolSelector: React.FC<PoolSelectorProps> = ({
  pools,
  assets,
  onPoolSelect,
  selectedPools,
}) => {
  const getAssetSymbol = (assetInfo: Pool['poolAssets'][0]['info']) => {
    if (assetInfo.token) {
      return assets.find(a => a.address === assetInfo.token?.contract_addr)?.symbol || 
             assets.find(a => a.id === assetInfo.token?.contract_addr)?.symbol || 
             'Unknown';
    }
    if (assetInfo.native_token) {
      return assets.find(a => a.denom === assetInfo.native_token?.denom)?.symbol || 'Unknown';
    }
    return 'Unknown';
  };

  const getPoolAPY = (pool: Pool) => {
    return pool.percentageAPRs[0] || 0;
  };

  const activePools = pools.filter(pool => 
    pool.percentageAPRs.length > 0 && 
    !pool.disabled &&
    pool.type !== 'deprecated'
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Available Liquidity Pools</h2>
      <div className="space-y-4">
        {activePools
          .sort((a, b) => getPoolAPY(b) - getPoolAPY(a))
          .map(pool => {
            const assetPair = pool.poolAssets.map(asset => getAssetSymbol(asset.info)).join(' / ');
            const apy = getPoolAPY(pool);
            
            return (
              <div
                key={pool.poolId}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPools.includes(pool.poolId)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow'
                }`}
                onClick={() => onPoolSelect(pool.poolId)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{assetPair}</span>
                    <span className="text-sm text-gray-500">
                      {pool.type.charAt(0).toUpperCase() + pool.type.slice(1)} Pool
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                      {formatPercentage(apy)}
                    </div>
                    <div className="text-sm text-gray-500">APY</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};