## How to run

1. Create a React + TypeScript app (e.g. `npm create vite@latest product-catalogue -- --template react-ts`)
2. Replace the generated App.tsx with the file above
3. `npm install`
4. `npm run dev`

## Assumptions

- Product data is provided as a static local array rather than a real API endpoint, since none was specified. It's wrapped in a promise-returning function (fetchProducts) so the loading/error handling behaves the same way it would against a real network call.
- Search matches on product name only (not category), since the brief specifically asked for name search and category filtering as separate controls.
- Sorting is done by clicking a "Sort by" button per field, toggling ascending/descending on repeat clicks, rather than a separate dropdown, to keep the interaction simple.

## What I'd improve with more time

- Split into smaller components (SearchBar, CategoryFilter, SortControls, ProductTable) rather than one file, for readability and testability.
- Add debouncing on the search input to avoid re-filtering on every keystroke for larger datasets.
- Add unit tests (e.g. with Vitest/React Testing Library) covering the filtering, sorting, and error-state logic.
- Replace inline styles with a proper stylesheet or CSS-in-JS library.
- Add pagination or virtualization if the product list were much larger.
- Make the error state retryable (a "Try again" button that re-triggers fetchProducts).
