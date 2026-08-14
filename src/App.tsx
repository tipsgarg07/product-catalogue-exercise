import React, { useState, useEffect, useMemo } from "react";
import productsData from "./products.json";

// ---- Types ----
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
}

type SortField = "name" | "price" | "rating";
type SortDirection = "asc" | "desc";

// Simulates an async API call using the JSON file
function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // To manually verify the error state, temporarily uncomment the next line:
      // reject(new Error("Failed to load products"));
      resolve(productsData as Product[]);
    }, 600);
  });
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetchProducts()
      .then((data) => {
        if (isMounted) setProducts(data);
      })
      .catch(() => {
        if (isMounted)
          setError(
            "Something went wrong while loading products. Please try again.",
          );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["All", ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    let result = products;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(term));
    }

    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }

    const sorted = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a[sortField] - b[sortField];
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [products, searchTerm, category, sortField, sortDirection]);

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }

  if (loading) {
    return <div style={styles.centered}>Loading products…</div>;
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Product Catalogue</h1>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div style={styles.sortButtons}>
          {(["name", "price", "rating"] as SortField[]).map((field) => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              style={styles.button}
            >
              Sort by {field}
              {sortField === field
                ? sortDirection === "asc"
                  ? " ▲"
                  : " ▼"
                : ""}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.count}>
        {visibleProducts.length} product
        {visibleProducts.length !== 1 ? "s" : ""}
      </p>

      {visibleProducts.length === 0 ? (
        <p>No products match your search/filter.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>{p.category}</td>
                <td style={styles.td}>£{p.price.toFixed(2)}</td>
                <td style={styles.td}>{p.rating.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "sans-serif",
    maxWidth: 700,
    margin: "0 auto",
    padding: 20,
  },
  centered: { textAlign: "center", marginTop: 60, fontFamily: "sans-serif" },
  controls: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 },
  input: { padding: 8, flex: 1, minWidth: 160 },
  select: { padding: 8 },
  sortButtons: { display: "flex", gap: 6 },
  button: { padding: "8px 10px", cursor: "pointer" },
  count: { fontWeight: "bold", marginBottom: 10 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "2px solid #ccc", padding: 8 },
  td: { borderBottom: "1px solid #eee", padding: 8 },
};
