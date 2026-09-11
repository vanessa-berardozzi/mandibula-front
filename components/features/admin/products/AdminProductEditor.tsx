"use client";

import type { AdminProductDetail, AdminProductVariant } from "@/types/admin";
import Image from "next/image";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import styles from "./adminProductEditor.module.css";

type Category = { id: string; name: string };

type FormVariant = AdminProductVariant & {
  _isNew?: boolean;
  _isDeleted?: boolean;
  initialStock?: number;
};

type AdminProductEditorProps = {
  product: AdminProductDetail;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    categoryId: string;
    vatCategory?: "STANDARD_GOODS" | "LIVE_ANIMALS";
    stockMode?: "SHARED_POOL" | "PER_VARIANT";
    minThreshold: number;
    shippingWeight: number | null;
    isPublished: boolean;
    variants: {
      id?: string;
      name: string;
      price: number;
      lotSize: number;
      isActive: boolean;
      initialStock?: number;
      totalStock?: number;
      minThreshold?: number;
    }[];
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
  const initialStockMode =
    product.stockMode ??
    (product.vatCategory === "LIVE_ANIMALS" ? "SHARED_POOL" : "PER_VARIANT");

  const [form, setForm] = useState({
    name: product.name,
    categoryId: product.category.id,
    vatCategory: (product.vatCategory ?? "STANDARD_GOODS") as "STANDARD_GOODS" | "LIVE_ANIMALS",
    stockMode: initialStockMode as "SHARED_POOL" | "PER_VARIANT",
    description: product.description || "",
    minThreshold: (product.stockInfo?.minThreshold || 5).toString(),
    totalStock: product.totalStock.toString(),
    shippingWeight: product.shippingWeight?.toString() ?? "",
    isPublished: product.isPublished,
  });

  const [variants, setVariants] = useState<FormVariant[]>(product.variants);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [isMovingStock, setIsMovingStock] = useState(false);
  const [targetVariantId, setTargetVariantId] = useState<string>(
    product.variants[0]?.id ?? ""
  );
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

  const isPerVariant = form.stockMode === "PER_VARIANT";

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
      lotSize: isPerVariant ? 1 : 1,
      isActive: true,
      _isNew: true,
      initialStock: 0,
      totalStock: 0,
      minThreshold: parseInt(form.minThreshold, 10) || 5,
    };
    setVariants([...variants, newVariant]);
    if (!targetVariantId) {
      setTargetVariantId(newVariant.id);
    }
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
              [field]:
                field === "price" ||
                field === "lotSize" ||
                field === "totalStock" ||
                field === "initialStock" ||
                field === "minThreshold"
                  ? parseFloat(value.toString()) || 0
                  : value,
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

    if (isPerVariant && !targetVariantId) {
      setError("Veuillez sélectionner la variante à ajuster");
      return;
    }

    // Le backend attend une quantité signée : positive pour une entrée, négative pour une sortie.
    const signedQuantity = stockMovement.type === "ENTRY" ? quantity : -quantity;

    if (isPerVariant) {
      const currentVar = variants.find((v) => v.id === targetVariantId);
      const currentVarStock = currentVar?.totalStock ?? 0;
      if (currentVarStock + signedQuantity < 0) {
        setError(`Stock insuffisant pour cette variante (actuel: ${currentVarStock})`);
        return;
      }
    } else {
      if (parseInt(form.totalStock, 10) + signedQuantity < 0) {
        setError("La quantité ne peut pas dépasser le stock actuel");
        return;
      }
    }

    setIsMovingStock(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/stock/product/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: signedQuantity,
          type: stockMovement.type,
          ...(isPerVariant && targetVariantId ? { variantId: targetVariantId } : {}),
          ...(stockMovement.reason.trim().length >= 3
            ? { reason: stockMovement.reason.trim() }
            : {}),
        }),
      });

      if (!response.ok) {
        throw new Error("Le mouvement de stock a été refusé");
      }

      const data = (await response.json()) as { product: { totalStock: number } };
      setForm((prev) => ({ ...prev, totalStock: data.product.totalStock.toString() }));

      if (isPerVariant && targetVariantId) {
        setVariants((prev) =>
          prev.map((v) =>
            v.id === targetVariantId
              ? { ...v, totalStock: (v.totalStock ?? 0) + signedQuantity }
              : v
          )
        );
      }

      setStockMovement({ type: "ENTRY", quantity: "", reason: "" });
      setShowStockManagement(false);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Erreur lors du mouvement de stock"
      );
    } finally {
      setIsMovingStock(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const activeVariants = variants.filter((v) => !v._isDeleted);
      if (activeVariants.some((v) => !v.name.trim())) {
        throw new Error("Chaque variante doit avoir un nom");
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
        categoryId: form.categoryId,
        vatCategory: form.vatCategory,
        stockMode: form.stockMode,
        minThreshold: parseInt(form.minThreshold, 10),
        shippingWeight: form.shippingWeight.trim()
          ? Number(form.shippingWeight)
          : null,
        isPublished: form.isPublished,
        variants: activeVariants.map((v) => ({
          ...(v._isNew ? {} : { id: v.id }),
          name: v.name.trim(),
          price: Number(v.price) || 0,
          lotSize: isPerVariant ? 1 : Number(v.lotSize) || 1,
          isActive: v.isActive,
          initialStock: v._isNew ? v.initialStock : undefined,
          totalStock: isPerVariant && !v._isNew ? v.totalStock ?? undefined : undefined,
          minThreshold: isPerVariant ? v.minThreshold : undefined,
        })),
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

  const activeVariantsList = variants.filter((v) => !v._isDeleted);

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
                {stockStatus} • {isPerVariant ? "STOCK PAR VARIANTE" : "POOL D'ESPÈCE"}
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
                <span>CATÉGORIE FISCALE</span>
                <select
                  value={form.vatCategory}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    const newVat = e.target.value as "STANDARD_GOODS" | "LIVE_ANIMALS";
                    setForm({
                      ...form,
                      vatCategory: newVat,
                      stockMode: newVat === "LIVE_ANIMALS" ? "SHARED_POOL" : "PER_VARIANT",
                    });
                  }}
                >
                  <option value="STANDARD_GOODS">Accessoires & Matériel (Stock par variante)</option>
                  <option value="LIVE_ANIMALS">Arthropodes vivants (Stock pool partagé)</option>
                </select>
              </label>
              <label>
                <span>MODE DE GESTION DU STOCK</span>
                <select
                  value={form.stockMode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setForm({
                      ...form,
                      stockMode: e.target.value as "SHARED_POOL" | "PER_VARIANT",
                    })
                  }
                >
                  <option value="PER_VARIANT">
                    Stock indépendant par variante (Accessoires, Couleurs, Tailles)
                  </option>
                  <option value="SHARED_POOL">
                    Pool commun partagé (Animaux vivants - Variantes = Lots)
                  </option>
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>
                  {isPerVariant ? "STOCK TOTAL CUMULÉ (UNITÉS)" : "STOCK TOTAL (INDIVIDUS)"}
                </span>
                <input
                  type="number"
                  value={form.totalStock}
                  readOnly
                  title={
                    isPerVariant
                      ? "Le stock total est la somme des stocks des variantes, modifiable via la section Gestion des stocks"
                      : "Le stock se modifie via la section Gestion des stocks pour conserver la traçabilité"
                  }
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
                  placeholder="0"
                />
              </label>
              <label>
                <span>MISE EN LIGNE DU PRODUIT</span>
                <div className={styles.checkboxControl}>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setForm({ ...form, isPublished: e.target.checked })
                    }
                  />
                  <span style={{ marginLeft: "0.5rem" }}>
                    {form.isPublished ? "Produit publié et visible au catalogue" : "Brouillon non publié"}
                  </span>
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
              {showStockManagement ? "- GESTION DES MOUVEMENTS DE STOCK" : "+ GESTION DES MOUVEMENTS DE STOCK"}
            </button>

            {showStockManagement && (
              <div className={styles.stockManagementForm}>
                <div className={styles.formGrid}>
                  {isPerVariant && (
                    <label style={{ gridColumn: "1 / -1" }}>
                      <span>VARIANTE CIBLÉE</span>
                      <select
                        value={targetVariantId}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          setTargetVariantId(e.target.value)
                        }
                      >
                        {activeVariantsList.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} — Stock actuel : {v.totalStock ?? 0} unité(s)
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  <label>
                    <span>TYPE DE MOUVEMENT</span>
                    <select
                      value={stockMovement.type}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setStockMovement({ ...stockMovement, type: e.target.value })
                      }
                    >
                      <option value="ENTRY">Arrivage fournisseur (+)</option>
                      <option value="LOSS">Perte / Casse / Mortalité (-)</option>
                      <option value="ADJUSTMENT">Ajustement inventaire (-)</option>
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
                  disabled={isMovingStock}
                  className={styles.stockMovementBtn}
                >
                  {isMovingStock ? "ENREGISTREMENT..." : "ENREGISTRER LE MOUVEMENT"}
                </button>
              </div>
            )}
          </section>

          {/* VARIANTES & STOCK */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Variantes & tarifs</h3>
                <p style={{ margin: "0.25rem 0 0", color: "var(--admin-muted)", font: "400 12px/1.4 monospace" }}>
                  {isPerVariant
                    ? "Mode par variante : chaque variante possède son propre stock indépendant."
                    : "Mode pool commun : chaque variante est une taille de lot tirant dans le stock global."}
                </p>
              </div>
              <button 
                type="button" 
                onClick={handleAddVariant}
                className={styles.addVariantBtn}
              >
                + AJOUTER UNE VARIANTE
              </button>
            </div>

            {activeVariantsList.length > 0 ? (
              <div className={styles.variantsTable}>
                <div
                  className={styles.tableHeader}
                  style={isPerVariant ? { gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.8fr 1fr" } : undefined}
                >
                  <div>VARIANTE</div>
                  <div>PRIX (€)</div>
                  <div>{isPerVariant ? "STOCK ACTUEL" : "TAILLE DU LOT"}</div>
                  {isPerVariant && <div>SEUIL D&apos;ALERTE</div>}
                  <div>VENTE</div>
                  <div>ACTIONS</div>
                </div>
                {variants.map((variant) => {
                  if (variant._isDeleted) return null;
                  return (
                    <div
                      key={variant.id}
                      className={styles.tableRow}
                      style={isPerVariant ? { gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.8fr 1fr" } : undefined}
                    >
                      <div>
                        <input
                          type="text"
                          value={variant.name}
                          onChange={(e) => handleVariantChange(variant.id, "name", e.target.value)}
                          className={styles.variantInput}
                          placeholder={isPerVariant ? "Ex: Noir / XL" : "Ex: Lot de 5"}
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
                        {isPerVariant ? (
                          variant._isNew ? (
                            <input
                              type="number"
                              min="0"
                              value={variant.initialStock ?? 0}
                              onChange={(e) =>
                                handleVariantChange(variant.id, "initialStock", e.target.value)
                              }
                              className={styles.priceInput}
                              placeholder="Stock initial"
                              required
                            />
                          ) : (
                            <input
                              type="text"
                              value={`${variant.totalStock ?? 0} unité(s)`}
                              disabled
                              className={styles.priceInput}
                              title="Modifiez le stock via la section Gestion des stocks"
                            />
                          )
                        ) : (
                          <input
                            type="number"
                            min="1"
                            value={variant.lotSize}
                            onChange={(e) => handleVariantChange(variant.id, "lotSize", e.target.value)}
                            className={styles.priceInput}
                            required
                          />
                        )}
                      </div>
                      {isPerVariant && (
                        <div>
                          <input
                            type="number"
                            min="0"
                            value={variant.minThreshold ?? 5}
                            onChange={(e) =>
                              handleVariantChange(variant.id, "minThreshold", e.target.value)
                            }
                            className={styles.priceInput}
                            placeholder="5"
                            required
                          />
                        </div>
                      )}
                      <div className={styles.availableCell}>
                        <input
                          type="checkbox"
                          checked={variant.isActive}
                          onChange={(e) => handleVariantChange(variant.id, "isActive", e.target.checked)}
                          className={styles.availableCheckbox}
                          title="Variante active et disponible à la vente"
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
