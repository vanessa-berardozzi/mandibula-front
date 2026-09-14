"use client";

import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface OrderItemDetail {
  id: string;
  quantity: number;
  variantName: string;
  productName: string;
  weight?: number;
}

interface OrderDetail {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  shippingAddress?: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: string | number;
  createdAt: string;
  weight?: number;
  trackingNumber?: string;
  shippingCarrier?: string;
  packageFormat?: string;
  preparationNotes?: string;
  items: OrderItemDetail[];
}

interface OrderDetailModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

const getPaymentStatusLabel = (status: string) => {
  if (!status) return "Non spécifié";
  const s = status.toUpperCase();
  if (s === "PAID") return "Payée";
  if (s === "PENDING") return "En attente";
  if (s === "FAILED") return "Échouée";
  return status;
};

const getShippingCustomerName = (order: OrderDetail) =>
  order.shippingAddress?.split(/\r?\n/)[0]?.trim() || order.customerName;

export function OrderDetailModal({ orderId, isOpen, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [preparationNotes, setPreparationNotes] = useState("");
  const [weight, setWeight] = useState("");
  const [packageFormat, setPackageFormat] = useState("STANDARD");

  const fetchOrderDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/orders/${orderId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les détails");
      const data = await res.json();
      const adminOrder = data.order ?? data;
      setOrder(adminOrder);
      setTrackingNumber(adminOrder.trackingNumber || "");
      setPreparationNotes(adminOrder.preparationNotes || "");
      setWeight(adminOrder.weight ? String(adminOrder.weight) : "");
      setPackageFormat(adminOrder.packageFormat || "STANDARD");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isOpen) return;
    fetchOrderDetail();
  }, [isOpen, orderId, fetchOrderDetail]);

  const handleSave = async () => {
    if (!order) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trackingNumber,
          preparationNotes,
          weight: weight ? Number(weight) : null,
          packageFormat,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateBordereau = async () => {
    if (!order) return;
    const printWindow = window.open("", "_blank", "width=800,height=1000");
    if (!printWindow) {
      setError("Autorisez les fenêtres pop-up pour générer le bordereau.");
      return;
    }
    const items = order.items
      .map((item) => `<li><span>${item.productName} - ${item.variantName}</span><strong>×${item.quantity}</strong></li>`)
      .join("");
    const shippingCustomerName = getShippingCustomerName(order);
    const shippingAddress = order.shippingAddress
      ?.split(/\r?\n/)
      .slice(1)
      .filter(Boolean)
      .join(", ") || "Non renseignée";
    const preparationDate = new Date().toLocaleDateString("fr-FR");
    printWindow.document.write(`<!doctype html><html><head><title>Bordereau ${order.reference}</title>
      <style>@page{size:A6;margin:0}*{box-sizing:border-box}body{width:105mm;min-height:148mm;margin:0;padding:8mm;font-family:Arial,sans-serif;color:#111;font-size:10px}header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:5mm}h1{font-size:20px;margin:0;letter-spacing:1px}h2{font-size:12px;text-transform:uppercase;margin:0 0 3mm}p{margin:1mm 0;line-height:1.35}.label{display:block;font-size:7px;font-weight:bold;text-transform:uppercase;letter-spacing:.7px;margin-bottom:1mm}.section{border:1px solid #111;padding:3mm;margin-top:4mm}.reference{font-size:15px;font-weight:bold}.address{font-style:normal;line-height:1.45}.meta{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin-top:4mm}.meta .section{margin-top:0}.items{list-style:none;padding:0;margin:0}.items li{display:flex;justify-content:space-between;gap:4mm;border-bottom:1px solid #ccc;padding:1.5mm 0}.note{min-height:12mm}.footer{border-top:2px solid #111;margin-top:5mm;padding-top:3mm;font-size:8px}</style>
      </head><body><header><div><h1>MANDIBULA</h1><p>Bordereau de préparation</p></div><div class="reference">#${order.reference}</div></header>
      <section class="section"><h2>Destinataire</h2><strong>${shippingCustomerName}</strong><p>${order.customerEmail}</p><address class="address">${shippingAddress}</address></section>
      <div class="meta"><section class="section"><span class="label">Commande</span><strong>${new Date(order.createdAt).toLocaleDateString("fr-FR")}</strong></section><section class="section"><span class="label">Préparé le</span><strong>${preparationDate}</strong></section></div>
      <div class="meta"><section class="section"><span class="label">Transporteur</span><strong>UPS</strong></section><section class="section"><span class="label">Colis</span><strong>${packageFormat}</strong><p>${weight || "-"} g</p></section></div>
      <section class="section"><h2>Articles</h2><ul class="items">${items}</ul></section>
      <section class="section note"><span class="label">Note de préparation</span>${preparationNotes || "-"}</section>
      <footer class="footer">Document de préparation - non affranchi</footer>
      <script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-black border border-primary/30 rounded-sm w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-primary/20 bg-black">
          <div>
            <h2 className="text-lg font-bold text-primary">FULFILMENT.PIPELINE</h2>
            {order && <p className="text-sm font-semibold text-foreground mt-1">#{order.reference}</p>}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : order ? (
            <>
              {/* 1. INFO COMMANDE */}
              <section className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Prénom et nom</p>
                    <p className="text-sm font-semibold text-foreground">{getShippingCustomerName(order)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{order.customerEmail}</p>
                  </div>
                  <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Total</p>
                    <p className="text-lg font-bold text-primary">{Number(order.total).toFixed(2)}€</p>
                  </div>
                  <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                    <p className="text-xs text-muted-foreground uppercase mb-1">Date</p>
                    <p className="text-sm text-foreground">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {/* Détail articles */}
                {order.items && order.items.length > 0 && (
                  <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                    <p className="text-xs font-semibold text-primary uppercase mb-3">Détail des articles</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <div>
                            <p className="text-foreground font-medium">{item.productName}</p>
                            <p className="text-muted-foreground">{item.variantName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-foreground">×{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 2. STATUT ET PAIEMENT */}
              <section className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Statut paiement</p>
                  <p className="text-sm text-foreground font-semibold">{getPaymentStatusLabel(order.paymentStatus)}</p>
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Moyen de paiement</p>
                  <p className="text-sm text-foreground font-semibold">{order.paymentMethod || "-"}</p>
                </div>
              </section>

              {/* 3. TRANSPORTEUR */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Transporteur</p>
                  <p className="text-sm text-foreground font-semibold">{order.shippingCarrier || "UPS"}</p>
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Poids du colis (g)</p>
                  <input
                    type="number"
                    min="0"
                    value={weight}
                    onChange={(event) => setWeight(event.target.value)}
                    placeholder="Ex: 1000"
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                  />
                </div>
                <div className="p-3 bg-accent/10 border border-primary/20 rounded-sm">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Format</p>
                  <select
                    value={packageFormat}
                    onChange={(event) => setPackageFormat(event.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                  >
                    <option className="bg-black text-foreground" value="PETIT_COLIS">Petit colis</option>
                    <option className="bg-black text-foreground" value="STANDARD">Standard</option>
                    <option className="bg-black text-foreground" value="GRAND_COLIS">Grand colis</option>
                    <option className="bg-black text-foreground" value="SUR_MESURE">Sur mesure</option>
                  </select>
                </div>
              </section>

              {/* 4. PRÉPARATION */}
              <section className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-primary uppercase block mb-2">
                    Numéro de suivi
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ex: 1Z999AA1234567890"
                    className="w-full px-3 py-2 bg-black border border-primary/30 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-primary uppercase block mb-2">
                    Notes de préparation
                  </label>
                  <textarea
                    value={preparationNotes}
                    onChange={(e) => setPreparationNotes(e.target.value)}
                    placeholder="Ajoutez des instructions spéciales..."
                    rows={4}
                    className="w-full px-3 py-2 bg-black border border-primary/30 rounded-sm text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60"
                  />
                </div>
              </section>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-primary/20 bg-black flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs h-9"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 bg-primary/80 hover:bg-primary text-black rounded-sm text-xs h-9 font-semibold"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
          <Button
            onClick={handleGenerateBordereau}
            disabled={loading}
            className="bg-accent text-black hover:bg-accent/80 rounded-sm text-xs h-9 font-semibold"
          >
            Générer bordereau
          </Button>
        </div>
      </div>
    </div>
  );
}
