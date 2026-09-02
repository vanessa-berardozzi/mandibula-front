"use client";

import type { AdminProductDetail } from "@/types/admin";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import styles from "./adminProductEditor.module.css";
import Image from "next/image";

type Category = { id: string; name: string };

type AdminProductEditorProps = {
  product: AdminProductDetail;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    price: number;
    minThreshold: number;
    costPrice?: number;
    shippingWeight?: number;
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
    price: product.price.toString(),
    costPrice: "0",
    shippingWeight: "0",
    minThreshold: (product.stockInfo?.minThreshold || 5).toString(),
    online: true,
    featured: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  const availableStock = product.totalStock - product.reservedStock;
  const activeVariantCount = product.variants.filter((v) => v.isActive).length;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const price = parseFloat(form.price);
      if (isNaN(price) || price < 0) {
        throw new Error("Le prix doit être un nombre positif");
      }

      await onSave({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price,
        minThreshold: parseInt(form.minThreshold, 10),
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

        {/* HERO SECTION - Image + Variantes */}
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
                {activeVariantCount} variante(s)
              </span>
              <span className={styles.stockLabel}>
                {product.stockInfo?.status?.replace(/_/g, ' ') || 'STOCK DISPONIBLE'}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          {/* INFORMATIONS DE VENTE */}
          <section className={styles.section}>
            <h3>Informations de vente</h3>

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
                <span>PRIX AFFICHÉ (€)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                <span>PRIX DE REVIENT (€)</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.costPrice}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, costPrice: e.target.value })
                  }
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                <span>UNITÉ</span>
                <select>
                  <option>unité</option>
                </select>
              </label>
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

          {/* PROMOTION & DISPONIBILITÉ */}
          <section className={styles.section}>
            <h3>Promotion & disponibilité</h3>

            <div className={styles.formGrid}>
              <label>
                <span>AUCUNE PROMOTION</span>
                <select disabled>
                  <option>Aucune promotion</option>
                </select>
              </label>
              <label>
                <span>STOCK VISIBLE À L&apos;ÉTIQUETTE</span>
                <select>
                  <option>Somme des variantes</option>
                </select>
              </label>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.online}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, online: e.target.checked })
                  }
                />
                <span>VISIBLE DANS LA BOUTIQUE</span>
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setForm({ ...form, featured: e.target.checked })
                  }
                />
                <span>PRODUIT MIS EN AVANT</span>
              </label>
            </div>
          </section>

          {/* VARIANTES & STOCK */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Variantes & stock</h3>
              <button type="button" className={styles.addVariantBtn}>
                + AJOUTER UNE VARIANTE
              </button>
            </div>

            {product.variants.length > 0 ? (
              <div className={styles.variantsTable}>
                <div className={styles.tableHeader}>
                  <div>VARIANTE</div>
                  <div>PRIX ($)</div>
                  <div>QTÉ</div>
                  <div>UNITÉ</div>
                  <div>STOCK</div>
                  <div>PRIX ÉTIQUETTE</div>
                </div>
                {product.variants.map((variant) => (
                  <div key={variant.id} className={styles.tableRow}>
                    <div>{variant.name}</div>
                    <div>{variant.price.toFixed(2)}</div>
                    <div>{variant.lotSize}</div>
                    <div>unité</div>
                    <div className={styles.stockCell}>
                      <input
                        type="number"
                        defaultValue={availableStock}
                        className={styles.smallInput}
                      />
                      <span className={styles.badgeInStock}>✓ EN STOCK</span>
                    </div>
                    <div className={styles.priceCheckbox}>
                      <input type="checkbox" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Aucune variante</p>
            )}
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
