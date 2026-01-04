import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Favorites from "./Favorites";
import favoritesReducer from "../features/favorites/favoritesSlice";
import { BrowserRouter } from "react-router-dom";

/* ---------------- MOCK ICONS ---------------- */
vi.mock("primeicons/primeicons.css", () => ({}));

/* ---------------- HELPER: render with Redux store ---------------- */
function renderWithStore(preloadedState: any) {
    const store = configureStore({
        reducer: {
            favorites: favoritesReducer,
        } as any,
        preloadedState,
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>
                <Favorites />
            </BrowserRouter>
        </Provider>
    );
}

/* ---------------- TEST DATA ---------------- */
const mockFavorites = [
    { id: 1, title: "iPhone", price: 999, image: "iphone.png", category: "electronics", description: "Phone" },
    { id: 2, title: "Shirt", price: 49, image: "shirt.png", category: "fashion", description: "Clothing" },
];

/* ---------------- TESTS ---------------- */
describe("Favorites Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows empty state when no favorites exist", () => {
        renderWithStore({ favorites: { items: [] } });

        expect(screen.getByText("No favorite products yet")).toBeInTheDocument();
        expect(screen.getByText("Browse products")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /browse products/i })).toHaveAttribute("href", "/");
    });

    it("renders favorite products when they exist", () => {
        renderWithStore({ favorites: { items: mockFavorites } });

        // Check titles
        expect(screen.getByText("iPhone")).toBeInTheDocument();
        expect(screen.getByText("Shirt")).toBeInTheDocument();

        // Check prices
        expect(screen.getByText("$999")).toBeInTheDocument();
        expect(screen.getByText("$49")).toBeInTheDocument();

        // Check links
        expect(screen.getAllByText("View details")[0]).toHaveAttribute("href", "/product/1");
    });

    it("dispatches removeFavorite when remove button is clicked", () => {
        const store = configureStore({
            reducer: { favorites: favoritesReducer },
            preloadedState: { favorites: { items: mockFavorites } },
        });

        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Favorites />
                </BrowserRouter>
            </Provider>
        );

        // Click the remove button of first product
        const removeButtons = screen.getAllByRole("button", { name: /remove from favorites/i });
        fireEvent.click(removeButtons[0]);

        // Check if the item is removed
        const state = store.getState().favorites.items;
        expect(state.find((p) => p.id === 1)).toBeUndefined();
        expect(state.length).toBe(1);
    });
});
