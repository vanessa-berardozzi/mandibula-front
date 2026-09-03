"use client";

import type { AdminProductDetail, AdminProductVariant } from "@/types/admin";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./adminProductEditor.module.css";

type Category = { id: string; name: string };

type FormVariant = AdminProductVariant & { _isNew?: boolean; _isDeleted?: boolean };

type AdminProductEditorProps = {
  product: AdminProductDetail;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    minThreshold: number;
    shippingWeight?: number;
    variants?: FormVariant[];
    promotionType?: "NONE" | "PERCENTAGE" | "FIXED_AMOUNT";
    promotionValue?: number | null;
    featured?: boolean;
  }) => Promise<void>;
};

export function AdminProductEditor({
  product,
  onClose,
  onSave,
}: AdminProductEditorProps) {
  const [form, setForm] = useState({
    name: product.name,
    categoryId: product.category.id,
    description: product.description || "",
    shippingWeight: "0",
    minThreshold: (product.stockInfo?.minThreshold || 5).toString(),
    totalStock: product.totalStock.toString(),
    online: true,
  });

  const [variants, setVariants] = useState<FormVariant[]>(product.variants);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [stockMovement, setStockMovement] = useState({
    type: "ENTRY",
    quantity: "",
    reason: "",
  });

  // Promotions
  const [promotionType, setPromotionType] = useState<"NONE" | "PERCENTAGE" | "FIXED_AMOUNT">(
    (product.promotionType as "NONE" | "PERCENTAGE" | "FIXED_AMOUNT") ?? "NONE"
  );
  const [promotionValue, setPromotionValue] = useState<string>(
    product.promotionValue ? product.promotionValue.toString() : ""
  );
  const [featured, setFeatured] = useState<boolean>(product.featured ?? false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) throw new Error("Erreur chargement catégories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const getStockStatus = (total: number, threshold: number) => {
    if (total === 0) return "RUPTURE DE STOCK";
    if (total <= threshold) return "STOCK FAIBLE";
    return "EN STOCK";
  };

  const stockStatus = getStockStatus(parseInt(form.totalStock, 10), parseInt(form.minThreshold, 10));

  function handleAddVariant() {
    const newVariant: FormVariant = {
      id: `temp-${Date.now()}`,
      name: "",
      price: 0,
      lotSize: 1,
      isActive: true,
      _isNew: true,
    };
    setVariants([...variants, newVariant]);
  }

  function handleDeleteVariant(id: string) {
    setVariants(variants.map((v) => (v.id === id ? { ...v, _isDeleted: true } : v)));
  }

  function handleVariantChange(
    id: string,
    field: keyof FormVariant,
    value: string | number | boolean
  ) {
    setVariants(
      variants.map((v) =>
        v.id === id
          ? {
              ...v,
              [field]: field === "price" || field === "lotSize" ? parseFloat(value.toString()) : value,
            }
          : v
      )
    );
  }

  async function handleStockMovement() {
    const quantity = parseInt(stockMovement.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      setError("La quantité doit être un nombre positif");
      return;
    }

    const currentStock = parseInt(form.totalStock, 10);
    let newStock = currentStock;

    if (stockMovement.type === "ENTRY") {
      newStock = currentStock + quantity;
    } else if (stockMovement.type === "LOSS" || stockMovement.type === "ADJUSTMENT") {
      newStock = currentStock - quantity;
      if (newStock < 0) {
        setError("La quantité ne peut pas dépasser le stock actuel");
        return;
      }
    }

    setForm({ ...form, totalStock: newStock.toString() });
    setStockMovement({ type: "ENTRY", quantity: "", reason: "" });
    setShowStockManagement(false);
    setError(null);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const totalStock = parseInt(form.totalStock, 10);
      if (isNaN(totalStock) || totalStock < 0) {
        throw new Error("Le stock total doit être un nombre positif");
      }

      // Validation de la promotion
      let promotionVal: number | null = null;
      if (promotionType !== "NONE") {
        const val = parseFloat(promotionValue);
        if (isNaN(val) || val <= 0) {
          throw new Error("La valeur de promotion doit être un nombre positif");
        }
        if (promotionType === "PERCENTAGE" && val > 100) {
          throw new Error("La réduction en pourcentage ne peut pas dépasser 100%");
        }
        promotionVal = val;
      }

      await onSave({
        name: form.name.trim(),
        description: form.description.trim() || null,
        minThreshold: parseInt(form.minThreshold, 10),
        variants: variants.filter((v) => !v._isDeleted),
        promotionType,
        promotionValue: promotionVal,
        featured,
      });
      onClose();
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={handleBackdropClick}>
      <form className="admin-drawer admin-modal" onSubmit={handleSubmit}>
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <span>CATALOGUE / FICHE PRODUIT</span>
            <h2>{product.name}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer la modale" className={styles.closeButton}>
            ×
          </button>
        </header>

        {error && <p className="admin-drawer-error">{error}</p>}

        {/* HERO SECTION - Image + Stock Global */}
        <div className={styles.heroSection}>
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              className={styles.productImage}
              width={180}
              height={180}
            />
          )}
          <div className={styles.heroInfo}>
            <div className={styles.variantBadge}>
              <span className={styles.productRef}>REF: {product.id}</span>
              <span className={styles.variantCount}>
                {parseInt(form.totalStock, 10)} en stock
              </span>
              <span className={styles.stockLabel}>
                {stockStatus}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* INFORMATIONS PRODUIT */}
          <section className={styles.section}>
            <h3>Informations produit</h3>

            <div className={styles.formGrid}>
              <label>
                <span>NOM</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>CATÉGORIE</span>
                <select
                  value={form.categoryId}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  disabled={loadingCategories}
                >
                  {loadingCategories ? (
                    <option>Chargement...</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>STOCK TOTAL (UNITÉS)</span>
                <input
                  type="number"
                  min="0"
                  value={form.totalStock}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, totalStock: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>SEUIL D&apos;ALERTE (STOCK FAIBLE)</span>
                <input
                  type="number"
                  min="0"
                  value={form.minThreshold}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, minThreshold: e.target.value })
                  }
                  required
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>POIDS D&apos;EXPÉDITION (g)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.shippingWeight}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, shippingWeight: e.target.value })
                  }
                />
              </label>
              <label>
                <span>MISE EN LIGNE DU PRODUIT</span>
                <div className={styles.checkboxControl}>
                  <input
                    type="checkbox"
                    checked={form.online}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setForm({ ...form, online: e.target.checked })
                    }
                  />
                </div>
              </label>
            </div>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>DESCRIPTION</span>
              <textarea
                value={form.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={8}
                placeholder="Rédige la description complète du produit..."
              />
            </label>
          </section>

          {/* GESTION DES STOCKS */}
          <section className={styles.section}>
            <button
              type="button"
              onClick={() => setShowStockManagement(!showStockManagement)}
              className={styles.stockManagementBtn}
            >
              {showStockManagement ? "- GESTION DES STOCKS" : "+ GESTION DES STOCKS"}
            </button>

            {showStockManagement && (
              <div className={styles.stockManagementForm}>
                <div className={styles.formGrid}>
                  <label>
                    <span>TYPE DE MOUVEMENT</span>
                    <select
                      value={stockMovement.type}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setStockMovement({ ...stockMovement, type: e.target.value })
                      }
                    >
                      <option value="ENTRY">Arrivage fournisseur</option>
                      <option value="LOSS">Perte / Casse / Mortalité</option>
                      <option value="ADJUSTMENT">Ajustement d&apos;inventaire</option>
                    </select>
                  </label>
                  <label>
                    <span>QUANTITÉ</span>
                    <input
                      type="number"
                      min="1"
                      value={stockMovement.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setStockMovement({ ...stockMovement, quantity: e.target.value })
                      }
                      placeholder="0"
                    />
                  </label>
                </div>

                <label style={{ gridColumn: "1 / -1" }}>
                  <span>RAISON / NOTES (OPTIONNEL)</span>
                  <textarea
                    value={stockMovement.reason}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setStockMovement({ ...stockMovement, reason: e.target.value })
                    }
                    rows={3}
                    placeholder="Ex: Arrivage du fournisseur X, inventaire du 01/09/2026..."
                  />
                </label>

                <button
                  type="button"
                  onClick={handleStockMovement}
                  className={styles.stockMovementBtn}
                >
                  ENREGISTRER LE MOUVEMENT
                </button>
              </div>
            )}
          </section>

          {/* VARIANTES & STOCK */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Variantes & tarifs</h3>
              <button 
                type="button" 
                onClick={handleAddVariant}
                className={styles.addVariantBtn}
              >
                + AJOUTER UNE VARIANTE
              </button>
            </div>

            {variants.filter(v => !v._isDeleted).length > 0 ? (
              <div className={styles.variantsTable}>
                <div className={styles.tableHeader}>
                  <div>VARIANTE</div>
                  <div>PRIX (€)</div>
                  <div>PRIX DE REVIENT</div>
                  <div>DISPONIBLE À LA VENTE</div>
                  <div>ACTIONS</div>
                </div>
                {variants.map((variant) => {
                  if (variant._isDeleted) return null;
                  return (
                    <div key={variant.id} className={styles.tableRow}>
                      <div>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)}
                          className={styles.variantInput}
                          placeholder="Ex: Lot de 5"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(variant.id, "price", e.target.value)}
                          className={styles.priceInput}
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value="—"
                          disabled
                          className={styles.priceInput}
                          title="Calculé ultérieurement"
                        />
                      </div>
                      <div className={styles.availableCell}>
                        <input
                          type="checkbox"
                          checked={variant.isActive}
                          onChange={(e) => handleVariantChange(variant.id, "isActive", e.target.checked)}
                          className={styles.availableCheckbox}
                        />
                      </div>
                      <div className={styles.actionsCell}>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(variant.id)}
                          className={styles.deleteBtn}
                          aria-label="Supprimer la variante"
                        >
                          ✕ SUPPRIMER
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={styles.emptyState}>Aucune variante. Ajoutez-en une pour commencer.</p>
            )}
          </section>

          {/* PROMOTIONS & MISE EN AVANT */}
          <section className={styles.section}>
            <h3>Promotions & disponibilité</h3>

            <div className={styles.formGrid}>
              <label>
                <span>TYPE DE PROMOTION</span>
                <select
                  value={promotionType}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setPromotionType(e.target.value as "NONE" | "PERCENTAGE" | "FIXED_AMOUNT");
                    setPromotionValue("");
                  }}
                >
                  <option value="NONE">Aucune promotion</option>
                  <option value="PERCENTAGE">Réduction en %</option>
                  <option value="FIXED_AMOUNT">Réduction en €</option>
                </select>
              </label>

              {promotionType !== "NONE" && (
                <label>
                  <span>
                    {promotionType === "PERCENTAGE"
                      ? "POURCENTAGE DE RÉDUCTION (%)"
                      : "MONTANT DE RÉDUCTION (€)"}
                  </span>
                  <input
                    type="number"
                    step={promotionType === "PERCENTAGE" ? "0.1" : "0.01"}
                    min="0"
                    max={promotionType === "PERCENTAGE" ? "100" : undefined}
                    value={promotionValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPromotionValue(e.target.value)
                    }
                    placeholder={promotionType === "PERCENTAGE" ? "10" : "5.50"}
                    required
                  />
                </label>
              )}
            </div>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>METTRE EN AVANT DANS LA « SÉLECTION DU MOMENT »</span>
              <div className={styles.checkboxControl}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFeatured(e.target.checked)
                  }
                />
                <span style={{ marginLeft: "0.5rem" }}>Oui, mettre en avant ce produit</span>
              </div>
            </label>
          </section>
        </div>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <button type="button" onClick={onClose} disabled={isSaving} className={`${styles.footerButton} ${styles.footerButtonCancel}`}>
            Annuler
          </button>
          <button type="submit" disabled={isSaving} className={`${styles.footerButton} ${styles.footerButtonSubmit}`}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </footer>
      </form>
    </div>
  );
}
