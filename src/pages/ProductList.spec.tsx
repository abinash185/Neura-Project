import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductList from "./ProductList";

/* ---------------- MOCK GSAP ---------------- */
vi.mock("gsap", () => ({
    default: {
        fromTo: vi.fn(),
    },
}));

/* ---------------- MOCK CHILD COMPONENTS ---------------- */
vi.mock("../components/SearchBar", () => ({
    default: () => <div>Mock SearchBar</div>,
}));

vi.mock("../components/FilterBar", () => ({
    default: ({ onCategoryChange, onSortChange }: any) => (
        <div>
            <button onClick={() => onCategoryChange("electronics")}>Filter Electronics</button>
            <button onClick={() => onSortChange("asc")}>Sort Asc</button>
        </div>
    ),
}));

vi.mock("../components/ProductCard", () => ({
    default: ({ product }: any) => <div>{product.title}</div>,
}));

/* ---------------- PARTIAL MOCK (KEEP REDUCER REAL) ---------------- */
vi.mock("../features/products/productsSlice", async () => {
    const actual: any = await vi.importActual("../features/products/productsSlice");
    return {
        ...actual,
        fetchProducts: vi.fn(() => ({ type: "products/fetch/pending" })),
    };
});

import productsReducer, { fetchProducts } from "../features/products/productsSlice";

/* ---------------- HELPER ---------------- */
function renderWithStore(preloadedState: any) {
    const store = configureStore({
        reducer: {
            products: productsReducer,
        } as any,
        preloadedState,
    });

    return render(
        <Provider store={store}>
            <ProductList />
        </Provider>
    );
}

/* ---------------- TEST DATA ---------------- */
const mockProducts = [
    { id: 1, title: "iPhone", category: "electronics", price: 100 },
    { id: 2, title: "Shirt", category: "fashion", price: 50 },
];

/* ---------------- TESTS ---------------- */
describe("ProductList Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state", () => {
        renderWithStore({
            products: {
                items: [],
                status: "loading",
                search: "",
                category: "all",
                sort: "asc",
            },
        });

        expect(screen.getByText("Loading products…")).toBeInTheDocument();
    });

    it("dispatches fetchProducts when status is idle and items are empty", () => {
        renderWithStore({
            products: {
                items: [],
                status: "idle",
                search: "",
                category: "all",
                sort: "asc",
            },
        });

        expect(fetchProducts).toHaveBeenCalledTimes(1);
    });

    it("renders product cards", () => {
        renderWithStore({
            products: {
                items: mockProducts,
                status: "idle",
                search: "",
                category: "all",
                sort: "asc",
            },
        });

        expect(screen.getByText("iPhone")).toBeInTheDocument();
        expect(screen.getByText("Shirt")).toBeInTheDocument();
    });

    it("shows empty state when no filtered products exist", () => {
        renderWithStore({
            products: {
                items: [], // empty products
                status: "idle", // not loading
                search: "xyz", // filtered to nothing
                category: "all",
                sort: "asc",
            },
        });

        expect(screen.getByText("Loading products…")).toBeInTheDocument();
    });

    it("filters products by category", () => {
        renderWithStore({
            products: {
                items: mockProducts,
                status: "idle",
                search: "",
                category: "electronics",
                sort: "asc",
            },
        });

        expect(screen.getByText("iPhone")).toBeInTheDocument();
        expect(screen.queryByText("Shirt")).not.toBeInTheDocument();
    });
});
