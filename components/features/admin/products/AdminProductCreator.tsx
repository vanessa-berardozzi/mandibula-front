"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import creatorStyles from "./adminProductCreator.module.css";
import styles from "./adminProductEditor.module.css";

type Category = { id: string; name: string };

type FormVariant = {
  key: string;
  name: string;
  price: string;
  lotSize: string;
  initialStock: string;
  minThreshold: string;
  isActive: boolean;
};

export type AdminProductCreateInput = {
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  images: string[];
  vatCategory: "STANDARD_GOODS" | "LIVE_ANIMALS";
  stockMode: "SHARED_POOL" | "PER_VARIANT";
  initialStock: number;
  minThreshold: number;
  shippingWeight: number | null;
  isPublished: boolean;
  promotionType: "NONE" | "PERCENTAGE" | "FIXED_AMOUNT";
  promotionValue: number | null;
  featured: boolean;
  variants: {
    name: string;
    price: number;
    lotSize: number;
    isActive: boolean;
    initialStock?: number;
    minThreshold?: number;
  }[];
};

type AdminProductCreatorProps = {
  onClose: () => void;
  onCreate: (data: AdminProductCreateInput) => Promise<void>;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function AdminProductCreator({ onClose, onCreate }: AdminProductCreatorProps) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    initialStock: "0",
    minThreshold: "5",
    shippingWeight: "",
    vatCategory: "STANDARD_GOODS" as "STANDARD_GOODS" | "LIVE_ANIMALS",
    stockMode: "PER_VARIANT" as "SHARED_POOL" | "PER_VARIANT",
    isPublished: true,
  });

  const [variants, setVariants] = useState<FormVariant[]>([]);
  const [promotionType, setPromotionType] = useState<"NONE" | "PERCENTAGE" | "FIXED_AMOUNT">("NONE");
  const [promotionValue, setPromotionValue] = useState("");
  const [featured, setFeatured] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isPerVariant = form.stockMode === "PER_VARIANT";

  // Calcul du stock total cumulé des variantes en mode PER_VARIANT
  const computedPerVariantTotalStock = variants.reduce(
    (sum, v) => sum + (Number(v.initialStock) || 0),
    0
  );

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) throw new Error("Erreur chargement catégories");
        const data = (await res.json()) as Category[];
        setCategories(data);
        setForm((prev) => ({ ...prev, categoryId: prev.categoryId || (data[0]?.id ?? "") }));
      } catch (caught) {
        console.error("Erreur:", caught);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Libère l'URL blob de prévisualisation pour éviter une fuite mémoire.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleVatCategoryChange(newVatCategory: "STANDARD_GOODS" | "LIVE_ANIMALS") {
    const newStockMode: "SHARED_POOL" | "PER_VARIANT" =
      newVatCategory === "LIVE_ANIMALS" ? "SHARED_POOL" : "PER_VARIANT";
    setForm((prev) => ({
      ...prev,
      vatCategory: newVatCategory,
      stockMode: newStockMode,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setImageFile(file);
  }

  function handleRemoveImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleAddVariant() {
    setVariants((prev) => [
      ...prev,
      {
        key: `variant-${Date.now()}`,
        name: "",
        price: "",
        lotSize: "1",
        initialStock: "0",
        minThreshold: form.minThreshold || "5",
        isActive: true,
      },
    ]);
  }

  function handleVariantChange(
    key: string,
    field: "name" | "price" | "lotSize" | "initialStock" | "minThreshold" | "isActive",
    value: string | boolean
  ) {
    setVariants((prev) => prev.map((v) => (v.key === key ? { ...v, [field]: value } : v)));
  }

  function handleDeleteVariant(key: string) {
    setVariants((prev) => prev.filter((v) => v.key !== key));
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/admin/products/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Échec de l'upload de l'image");
    }

    const data = (await response.json()) as { url: string };
    return data.url;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!form.categoryId) throw new Error("Sélectionne une catégorie");
      if (!imageFile) throw new Error("Une image du produit est requise");

      const price = Number(form.price);
      if (Number.isNaN(price) || price < 0) throw new Error("Le prix doit être un nombre positif");

      if (variants.some((v) => !v.name.trim())) {
        throw new Error("Chaque variante doit avoir un nom");
      }

      let promotionVal: number | null = null;
      if (promotionType !== "NONE") {
        const value = Number(promotionValue);
        if (Number.isNaN(value) || value <= 0) {
          throw new Error("La valeur de promotion doit être un nombre positif");
        }
        if (promotionType === "PERCENTAGE" && value > 100) {
          throw new Error("La réduction en pourcentage ne peut pas dépasser 100%");
        }
        promotionVal = value;
      }

      const imageUrl = await uploadImage(imageFile);

      const finalInitialStock = isPerVariant
        ? computedPerVariantTotalStock
        : Number(form.initialStock) || 0;

      await onCreate({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price,
        categoryId: form.categoryId,
        images: [imageUrl],
        vatCategory: form.vatCategory,
        stockMode: form.stockMode,
        initialStock: finalInitialStock,
        minThreshold: Number(form.minThreshold) || 0,
        shippingWeight: form.shippingWeight.trim() ? Number(form.shippingWeight) : null,
        isPublished: form.isPublished,
        promotionType,
        promotionValue: promotionVal,
        featured,
        variants: variants.map((v) => ({
          name: v.name.trim(),
          price: Number(v.price) || 0,
          lotSize: isPerVariant ? 1 : Number(v.lotSize) || 1,
          isActive: v.isActive,
          initialStock: isPerVariant ? Number(v.initialStock) || 0 : undefined,
          minThreshold: isPerVariant ? Number(v.minThreshold) || Number(form.minThreshold) || 5 : undefined,
        })),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Erreur lors de la création");
    } finally {
      setIsSaving(false);
    }
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className="admin-modal-overlay" onClick={handleBackdropClick}>
      <form className="admin-drawer admin-modal" onSubmit={handleSubmit}>
        <header className={styles.header}>
          <div>
            <span>CATALOGUE / NOUVEAU PRODUIT</span>
            <h2>Créer un produit</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la modale"
            className={styles.closeButton}
          >
            ×
          </button>
        </header>

        {error && <p className="admin-drawer-error">{error}</p>}

        <div className={styles.content}>
          <section className={styles.section}>
            <h3>Visuel du produit</h3>
            <div className={creatorStyles.uploader}>
              <div className={creatorStyles.preview}>
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Aperçu du produit" className={creatorStyles.previewImage} />
                ) : (
                  <span className={creatorStyles.previewPlaceholder}>Aucune image</span>
                )}
              </div>
              <div className={creatorStyles.uploaderActions}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={creatorStyles.fileInput}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={creatorStyles.fileButton}
                >
                  {imageFile ? "CHANGER L'IMAGE" : "CHOISIR UNE IMAGE"}
                </button>
                {imageFile && (
                  <button type="button" onClick={handleRemoveImage} className={creatorStyles.removeButton}>
                    ✕ RETIRER
                  </button>
                )}
                <p className={creatorStyles.uploaderHint}>
                  JPG, PNG ou WebP — 5 Mo maximum. L&apos;image est envoyée sur Cloudinary à la
                  création.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h3>Informations produit</h3>

            <div className={styles.formGrid}>
              <label>
                <span>NOM</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Porcellio laevis « Dairy Cow »"
                  required
                />
              </label>
              <label>
                <span>CATÉGORIE</span>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  disabled={loadingCategories}
                  required
                >
                  {loadingCategories ? (
                    <option value="">Chargement...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>PRIX DE BASE (€)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </label>
              <label>
                <span>CATÉGORIE FISCALE & TYPE DE PRODUIT</span>
                <select
                  value={form.vatCategory}
                  onChange={(e) =>
                    handleVatCategoryChange(e.target.value as "STANDARD_GOODS" | "LIVE_ANIMALS")
                  }
                >
                  <option value="STANDARD_GOODS">Accessoires & Matériel (Stock par variante)</option>
                  <option value="LIVE_ANIMALS">Arthropodes vivants (Stock pool partagé)</option>
                </select>
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>MODE DE GESTION DU STOCK</span>
                <select
                  value={form.stockMode}
                  onChange={(e) =>
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
              <label>
                <span>
                  {isPerVariant
                    ? "STOCK INITIAL CUMULÉ (UNITÉS)"
                    : "STOCK INITIAL DE L'ESPÈCE (INDIVIDUS)"}
                </span>
                <input
                  type="number"
                  min="0"
                  value={isPerVariant ? computedPerVariantTotalStock : form.initialStock}
                  onChange={(e) =>
                    !isPerVariant && setForm({ ...form, initialStock: e.target.value })
                  }
                  readOnly={isPerVariant}
                  title={
                    isPerVariant
                      ? "En mode par variante, le stock total est la somme des stocks de chaque variante ci-dessous"
                      : undefined
                  }
                  required
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>
                  {isPerVariant
                    ? "SEUIL D'ALERTE PAR DÉFAUT (UNITÉS)"
                    : "SEUIL D'ALERTE DU POOL (INDIVIDUS)"}
                </span>
                <input
                  type="number"
                  min="0"
                  value={form.minThreshold}
                  onChange={(e) => setForm({ ...form, minThreshold: e.target.value })}
                  required
                />
              </label>
              <label>
                <span>POIDS D&apos;EXPÉDITION (g)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.shippingWeight}
                  onChange={(e) => setForm({ ...form, shippingWeight: e.target.value })}
                  placeholder="0"
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label style={{ gridColumn: "1 / -1" }}>
                <span>MISE EN LIGNE DU PRODUIT</span>
                <div className={styles.checkboxControl}>
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
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
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={8}
                placeholder="Rédige la description complète du produit..."
              />
            </label>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Variantes & tarifs</h3>
                <p style={{ margin: "0.25rem 0 0", color: "var(--admin-muted)", font: "400 12px/1.4 monospace" }}>
                  {isPerVariant
                    ? "Mode par variante : définissez le prix et le stock initial de chaque variante indépendante (ex: Noir, Blanc, Taille M)."
                    : "Mode pool commun : chaque variante est une taille de lot (ex: Lot de 5) qui déduit les individus du stock global."}
                </p>
              </div>
              <button type="button" onClick={handleAddVariant} className={styles.addVariantBtn}>
                + AJOUTER UNE VARIANTE
              </button>
            </div>

            {variants.length > 0 ? (
              <div className={styles.variantsTable}>
                <div
                  className={styles.tableHeader}
                  style={isPerVariant ? { gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.8fr 1fr" } : undefined}
                >
                  <div>VARIANTE</div>
                  <div>PRIX (€)</div>
                  <div>{isPerVariant ? "STOCK INITIAL" : "TAILLE DU LOT"}</div>
                  {isPerVariant && <div>SEUIL D&apos;ALERTE</div>}
                  <div>VENTE</div>
                  <div>ACTIONS</div>
                </div>
                {variants.map((variant) => (
                  <div
                    key={variant.key}
                    className={styles.tableRow}
                    style={isPerVariant ? { gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.8fr 1fr" } : undefined}
                  >
                    <div>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(variant.key, "name", e.target.value)}
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
                        onChange={(e) => handleVariantChange(variant.key, "price", e.target.value)}
                        className={styles.priceInput}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min={isPerVariant ? "0" : "1"}
                        value={isPerVariant ? variant.initialStock : variant.lotSize}
                        onChange={(e) =>
                          handleVariantChange(
                            variant.key,
                            isPerVariant ? "initialStock" : "lotSize",
                            e.target.value
                          )
                        }
                        className={styles.priceInput}
                        placeholder={isPerVariant ? "0" : "1"}
                        required
                      />
                    </div>
                    {isPerVariant && (
                      <div>
                        <input
                          type="number"
                          min="0"
                          value={variant.minThreshold}
                          onChange={(e) =>
                            handleVariantChange(variant.key, "minThreshold", e.target.value)
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
                        onChange={(e) =>
                          handleVariantChange(variant.key, "isActive", e.target.checked)
                        }
                        className={styles.availableCheckbox}
                        title="Variante active et disponible à la vente"
                      />
                    </div>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(variant.key)}
                        className={styles.deleteBtn}
                        aria-label="Supprimer la variante"
                      >
                        ✕ SUPPRIMER
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Aucune variante. Ajoutez-en une pour commencer.</p>
            )}
          </section>

          <section className={styles.section}>
            <h3>Promotions & disponibilité</h3>

            <div className={styles.formGrid}>
              <label>
                <span>TYPE DE PROMOTION</span>
                <select
                  value={promotionType}
                  onChange={(e) => {
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
                    onChange={(e) => setPromotionValue(e.target.value)}
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
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span style={{ marginLeft: "0.5rem" }}>Oui, mettre en avant ce produit</span>
              </div>
            </label>
          </section>
        </div>

        <footer className={styles.footer}>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className={`${styles.footerButton} ${styles.footerButtonCancel}`}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className={`${styles.footerButton} ${styles.footerButtonSubmit}`}
          >
            {isSaving ? "Création..." : "Créer le produit"}
          </button>
        </footer>
      </form>
    </div>
  );
}
