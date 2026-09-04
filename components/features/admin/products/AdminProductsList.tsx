import styles from "@/app/(admin)/admin/(protected)/products/products.module.css";
import type { AdminProduct } from "@/types/admin";
import Image from "next/image";

type AdminProductsListProps = {
  products: AdminProduct[];
  onEdit?: (product: AdminProduct) => void;
};

export function AdminProductsList({ products, onEdit }: AdminProductsListProps) {
  return (
    <div className={styles.productsList}>
      {products.map((product) => (
        <article key={product.id} className={styles.productsRow}>
          <div className={styles.productImage}>
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 480px) 54px, (max-width: 768px) 48px, (max-width: 1024px) 55px, 60px"
              className="object-cover"
            />
          </div>
          <div className={styles.productDetails}>
            <small className={styles.productCategory}>{product.category}</small>
            <strong className={styles.productName}>{product.name}</strong>
            <span className={styles.productVariants}>{product.variantCount} variante(s)</span>
          </div>
          <b className={styles.productPrice}>{product.price.toFixed(2)} €</b>
          <span
            className={`${styles.productVisibility} ${
              product.isPublished && product.stockStatus !== "OUT_OF_STOCK"
                ? styles.online
                : ""
            }`}
          >
            {!product.isPublished
              ? "Hors ligne"
              : product.stockStatus === "OUT_OF_STOCK"
                ? "Indisponible"
                : "En ligne"}
          </span>
          <span className={styles.productStock}>
            {product.stockStatus === "OUT_OF_STOCK"
              ? "Indisponible"
              : product.stockStatus === "LOW_STOCK"
                ? `${product.totalStock} unité(s)`
                : "Stock catalogue"}
          </span>
          <button
            type="button"
            className={styles.editButton}
            onClick={() => onEdit?.(product)}
          >
            Modifier
          </button>
        </article>
      ))}
    </div>
  );
}
