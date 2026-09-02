"use client";

import type { AdminStockAlert } from '@/types/admin';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export function AdminStockAlertsCard({
  alerts,
  onRecalculate,
}: {
  alerts: AdminStockAlert[];
  onRecalculate?: () => void;
}) {
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [recalculateResult, setRecalculateResult] = useState<{
    processed: number;
    updated: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRecalculateStocks = async () => {
    setIsRecalculating(true);
    setError(null);
    setRecalculateResult(null);

    try {
      const res = await fetch('/api/admin/stock/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Erreur ${res.status}`);
      }

      const data = await res.json();
      setRecalculateResult(data.result);
      onRecalculate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du recalcul');
    } finally {
      setIsRecalculating(false);
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-admin-panel border border-admin-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono text-admin-muted">STOCK.ALERTS</span>
        </div>
        <h3 className="text-sm font-semibold mb-1">Alertes de stock</h3>
        <p className="text-xs text-admin-muted mb-4">
          Produits avec stock faible
        </p>

        <button
          onClick={handleRecalculateStocks}
          disabled={isRecalculating}
          className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-xs font-medium rounded transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
          {isRecalculating ? 'Recalcul...' : 'Recalculer les stocks'}
        </button>

        {recalculateResult && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-300">
            ✓ {recalculateResult.processed} produits traités, {recalculateResult.updated} mis à jour
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
            ✗ {error}
          </div>
        )}

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertTriangle className="w-8 h-8 text-admin-muted mb-2 opacity-50" />
          <p className="text-xs text-admin-muted">Aucune alerte de stock</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-admin-panel border border-admin-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono text-admin-muted">STOCK.ALERTS</span>
      </div>
      <h3 className="text-sm font-semibold mb-1">Alertes de stock</h3>
      <p className="text-xs text-admin-muted mb-4">
        Produits avec stock faible
      </p>

      <button
        onClick={handleRecalculateStocks}
        disabled={isRecalculating}
        className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-xs font-medium rounded transition-colors"
      >
        <RotateCcw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
        {isRecalculating ? 'Recalcul...' : 'Recalculer les stocks'}
      </button>

      {recalculateResult && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-300">
          ✓ {recalculateResult.processed} produits traités, {recalculateResult.updated} mis à jour
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
          ✗ {error}
        </div>
      )}
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.productId}
            className="flex items-start justify-between gap-3 p-3 bg-black/20 rounded border border-admin-border hover:border-admin-muted transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{alert.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                    alert.status === 'OUT_OF_STOCK'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {alert.status === 'OUT_OF_STOCK' ? 'Rupture' : 'Stock faible'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{alert.currentStock}</div>
              <div className="text-xs text-admin-muted">
                Seuil: {alert.minThreshold}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}