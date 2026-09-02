import { MessageSquare } from 'lucide-react';

export function AdminCustomerClaimsCard() {
  return (
    <div className="bg-admin-panel border border-admin-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-mono text-admin-muted">CLAIMS.CENTER</span>
      </div>
      <h3 className="text-sm font-semibold mb-1">Réclamations clients</h3>
      <p className="text-xs text-admin-muted mb-4">
        Demandes et réclamations des clients
      </p>
      
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageSquare className="w-8 h-8 text-admin-muted mb-3 opacity-50" />
        <p className="text-xs text-admin-muted mb-4">
          À configurer avec le client
        </p>
        <p className="text-xs text-admin-muted/60">
          Espace réservé pour la gestion des réclamations clients
        </p>
      </div>
    </div>
  );
}
