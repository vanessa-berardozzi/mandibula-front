"use client";

import { FormEvent, useEffect, useState } from "react";

interface Promotion {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minimumOrder: number;
  usageLimit: number | null;
  usageCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  users: Array<{ id: string; name: string; email: string; orderCount: number }>;
}

interface PromotionFormData {
  code: string;
  type: "percent" | "fixed";
  value: string;
  minimumOrder: string;
  usageLimit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

const emptyForm: PromotionFormData = {
  code: "",
  type: "percent",
  value: "10",
  minimumOrder: "0",
  usageLimit: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
};

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export function PromotionsPanel({ apiBase = "/api/admin" }: { apiBase?: string }) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingPromotionId, setEditingPromotionId] = useState<string | null>(null);
  const [form, setForm] = useState<PromotionFormData>(emptyForm);

  useEffect(() => {
    loadPromotions();
  }, []);

  async function loadPromotions() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${apiBase}/promotions`);
      if (!res.ok) throw new Error("Erreur de chargement");
      const data: Promotion[] = await res.json();
      setPromotions(data);
    } catch (err) {
      setError(String(err));
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice("");
    setError("");

    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: Number(form.value),
        minimumOrder: Number(form.minimumOrder) || 0,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        startsAt: form.startsAt,
        endsAt: form.endsAt || null,
        isActive: form.isActive,
      };

      const res = await fetch(
        editingPromotionId ? `${apiBase}/promotions/${editingPromotionId}` : `${apiBase}/promotions`,
        {
        method: editingPromotionId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur d'enregistrement");
      }

      setNotice(editingPromotionId ? "Promotion modifiée" : "Promotion enregistrée");
      setForm(emptyForm);
      setEditingPromotionId(null);
      
      await loadPromotions();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      setError(String(err));
      console.error("Erreur:", err);
    }
  }

  function editPromotion(promotion: Promotion) {
    setError("");
    setNotice("");
    setEditingPromotionId(promotion.id);
    setForm({
      code: promotion.code,
      type: promotion.type,
      value: String(promotion.value),
      minimumOrder: String(promotion.minimumOrder),
      usageLimit: promotion.usageLimit === null ? "" : String(promotion.usageLimit),
      startsAt: toDateTimeLocal(promotion.startsAt),
      endsAt: toDateTimeLocal(promotion.endsAt),
      isActive: promotion.isActive,
    });
  }

  function cancelEdit() {
    setEditingPromotionId(null);
    setForm(emptyForm);
  }

  async function deletePromotion(id: string) {
    if (!confirm("Supprimer cette promotion ?")) return;

    try {
      const res = await fetch(`${apiBase}/promotions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur suppression");
      
      setNotice("Promotion supprimée");
      await loadPromotions();
      setTimeout(() => setNotice(""), 3000);
    } catch (err) {
      setError(String(err));
      console.error("Erreur:", err);
    }
  }

  return (
    <div className="admin-two-column">
      {/* Création */}
      <section className="admin-panel">
        <header>
          <div>
            <span>PROMO.CREATE</span>
            <h2>{editingPromotionId ? "Modifier le code" : "Nouveau code"}</h2>
          </div>
        </header>

        {error && <div style={{ padding: "12px", color: "#ff8a8a", fontSize: "12px", borderLeft: "2px solid #ff5b5b" }}>{error}</div>}
        {notice && <div style={{ padding: "12px", color: "#70f18b", fontSize: "12px", borderLeft: "2px solid #70f18b" }}>{notice}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Code
            <input
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="MANDIBULA10"
            />
          </label>

          <div className="admin-form-grid">
            <label>
              Type
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percent" | "fixed" })}>
                <option value="percent">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
            </label>
            <label>
              Valeur
              <input
                type="number"
                min="0"
                required
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Minimum (€)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.minimumOrder}
                onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })}
              />
            </label>
            <label>
              Limite d'utilisation
              <input
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                placeholder="Illimitée"
              />
            </label>
          </div>

          <div className="admin-form-grid">
            <label>
              Début
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
            </label>
            <label>
              Fin
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
              />
            </label>
          </div>

          <label className="admin-switch">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Activer immédiatement
          </label>

          <button type="submit" className="admin-submit">
            {editingPromotionId ? "Enregistrer les modifications" : "Créer la promotion"}
          </button>
          {editingPromotionId && (
            <button type="button" className="admin-submit" onClick={cancelEdit}>
              Annuler
            </button>
          )}
        </form>
      </section>

      {/* Liste */}
      <section className="admin-panel">
        <header>
          <div>
            <span>PROMO.LIST</span>
            <h2>Codes actifs</h2>
          </div>
        </header>

        {loading ? (
          <div className="admin-empty">
            <span>Chargement...</span>
          </div>
        ) : !promotions.length ? (
          <div className="admin-empty">
            <span>AUCUN CODE</span>
            <strong>Aucun code promotionnel</strong>
            <p>Crée ton premier code dans le module voisin.</p>
          </div>
        ) : (
          <div className="admin-promo-list">
            {promotions.map((promo) => (
              <article key={promo.id}>
                <div>
                  <strong>{promo.code}</strong>
                  <small>
                    {promo.type === "percent" ? `${promo.value}%` : `${promo.value} €`}
                  </small>
                  <small>{promo.usageCount} utilisation{promo.usageCount > 1 ? "s" : ""}</small>
                  {promo.users.length > 0 && (
                    <ul className="admin-promo-users">
                      {promo.users.map((user) => (
                        <li key={user.id}>
                          {user.name} ({user.email}) : {user.orderCount}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className={promo.isActive ? "active" : ""}>
                  {promo.isActive ? "Actif" : "Inactif"}
                </span>
                <button
                  type="button"
                  className="admin-promo-edit"
                  onClick={() => editPromotion(promo)}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => deletePromotion(promo.id)}
                  aria-label="Supprimer cette promotion"
                >
                  Supprimer
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
