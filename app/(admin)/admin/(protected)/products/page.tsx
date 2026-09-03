"use client";

import { AdminProductEditor } from "@/components/features/admin/products/AdminProductEditor";
import { AdminProductsFilters } from "@/components/features/admin/products/AdminProductsFilters";
import { AdminProductsList } from "@/components/features/admin/products/AdminProductsList";
import { AdminEmptyState } from "@/components/features/admin/shared/AdminEmptyState";
import { AdminPagination } from "@/components/features/admin/shared/AdminPagination";
import type { AdminProduct, AdminProductDetail, AdminProductsPage } from "@/types/admin";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./products.module.css";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [editingProduct, setEditingProduct] = useState<AdminProductDetail | null>(null);
  const [editingLoading, setEditingLoading] = useState(false);
  const [editingError, setEditingError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        const query = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (search) query.set("search", search);

        const response = await fetch(`/api/admin/products?${query.toString()}`);
        
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des produits");
        }

        const data = (await response.json()) as AdminProductsPage;
        setProducts(data.products);
        setTotalPages(data.pages);
        setTotal(data.total);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Erreur inconnue");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [search, page]);

  function buildHref(targetPage: number) {
    const href = new URLSearchParams();
    if (search) href.set("q", search);
    href.set("page", String(targetPage));
    return `?${href.toString()}`;
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  async function handleProductEdit(product: AdminProduct) {
    setEditingLoading(true);
    setEditingError(null);
    
    try {
      const response = await fetch(`/api/admin/products/${product.id}`);
      
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des détails du produit");
      }

      const detail = (await response.json()) as AdminProductDetail;
      setEditingProduct(detail);
    } catch (caught) {
      setEditingError(
        caught instanceof Error ? caught.message : "Erreur lors du chargement"
      );
    } finally {
      setEditingLoading(false);
    }
  }

  async function handleSaveProduct(data: {
    name: string;
    description: string | null;
    minThreshold: number;
    shippingWeight?: number;
    variants?: any[];
    promotionType?: "NONE" | "PERCENTAGE" | "FIXED_AMOUNT";
    promotionValue?: number | null;
    featured?: boolean;
  }) {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }

      // Mettre à jour la liste locale
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? { ...p, name: data.name }
            : p
        )
      );

      setEditingProduct(null);
    } catch (caught) {
      throw caught;
    }
  }

  return (
    <section className="admin-panel">
      <header className={styles.catalogHeader}>
        <div>
          <span>CATALOG.CONTROL</span>
          <h2>Catalogue & stocks</h2>
        </div>
        <AdminProductsFilters
          search={search}
          onSearchChange={handleSearchChange}
        />
      </header>

      {error ? (
        <AdminEmptyState
          title="Erreur"
          description={error}
        />
      ) : loading ? (
        <AdminEmptyState
          title="Chargement..."
          description="Récupération des produits en cours."
        />
      ) : products.length === 0 ? (
        <AdminEmptyState
          title="Aucun produit"
          description="Aucun produit ne correspond à ces critères."
        />
      ) : (
        <>
          <AdminProductsList
            products={products}
            onEdit={handleProductEdit}
          />
          <AdminPagination
            page={page}
            pages={totalPages}
            total={total}
            buildHref={buildHref}
          />
        </>
      )}

      {editingProduct && (
        <AdminProductEditor
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}
    </section>
  );
}
