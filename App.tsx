import React, { useState, useEffect, useMemo } from "react";

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

// ---- Sample data (would normally come from an API endpoint) ----
const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: "Keyboard", category: "Electronics", price: 89, rating: 4.7 },
  { id: 2, name: "Coffee Mug", category: "Kitchen", price: 12, rating: 4.3 },
  { id: 3, name: "Wireless Mouse", category: "Electronics", price: 35, rating: 4.1 },
  { id: 4, name: "Blender", category: "Kitchen", price: 65, rating: 4.5 },
  { id: 5, name: "Desk Lamp", category: "Home", price: 28, rating: 4.0 },
  { id: 6, name: "Monitor Stand", category: "Electronics", price: 45, rating: 3.9 },
  { id: 7, name: "Cutting Board", category: "Kitchen", price: 18, rating: 4.6 },
];

// Simulates an async API call. In a real app this would be a fetch() to
// a backend endpoint; wrapped in a promise here so the loading/error
// states behave the same way they would against a real network request.
function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // To manually verify the error state, temporarily uncomment the next line:
      // reject(new Error("Failed to load products"));
      resolve(SAMPLE_PRODUCTS);
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
        if (isMounted) setError("Something went wrong while loading products. Please try again.");
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

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div style={styles.sortButtons}>
          {(["name", "price", "rating"] as SortField[]).map((field) => (
            <button key={field} onClick={() => toggleSort(field)} style={styles.button}>
              Sort by {field}
              {sortField === field ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.count}>{visibleProducts.length} product{visibleProducts.length !== 1 ? "s" : ""}</p>

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

// Kept inline for a single-file exercise; in a real project these would
// live in a stylesheet or CSS-in-JS solution.
const styles: { [key: string]: React.CSSProperties } = {
  container: { fontFamily: "sans-serif", maxWidth: 700, margin: "0 auto", padding: 20 },
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
