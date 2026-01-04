import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import favoritesReducer from "../features/favorites/favoritesSlice";

/* ---------------- MOCK REDUX STORE + ROUTER ---------------- */
function renderWithStore(preloadedState: any) {
    const store = configureStore({
        reducer: {
            favorites: favoritesReducer,
        } as any,
        preloadedState,
    });

    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter>
                    <ProductCard
                        product={{
                            id: 1,
                            title: "iPhone",
                            price: 1000,
                            description: "Test product",
                            category: "electronics",
                            image: "iphone.png",
                        }}
                    />
                </MemoryRouter>
            </Provider>
        ),
    };
}

/* ---------------- TESTS ---------------- */
describe("ProductCard Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders product title, price and image", () => {
        renderWithStore({ favorites: { items: [] } });

        expect(screen.getByText("iPhone")).toBeInTheDocument();
        expect(screen.getByText("$1000")).toBeInTheDocument();
        expect(screen.getByAltText("iPhone")).toHaveAttribute("src", "iphone.png");
    });

    it("shows heart icon as white if product is not in favorites", () => {
        renderWithStore({ favorites: { items: [] } });
        const buttonIcon = screen.getByRole("button", { name: /toggle favorite/i }).querySelector("i");
        expect(buttonIcon).toHaveClass("text-white");
    });

    it("shows heart icon as red if product is in favorites", () => {
        renderWithStore({ favorites: { items: [{ id: 1, title: "iPhone", price: 1000, description: "", category: "", image: "" }] } });
        const buttonIcon = screen.getByRole("button", { name: /toggle favorite/i }).querySelector("i");
        expect(buttonIcon).toHaveClass("text-red-500");
    });

    it("dispatches addFavorite when not in favorites and button is clicked", () => {
        const { store } = renderWithStore({ favorites: { items: [] } });
        const button = screen.getByRole("button", { name: /toggle favorite/i });

        fireEvent.click(button);

        const state = store.getState();
        expect(state.favorites.items).toHaveLength(1);
        expect(state.favorites.items[0].id).toBe(1);
    });

    it("dispatches removeFavorite when in favorites and button is clicked", () => {
        const { store } = renderWithStore({
            favorites: { items: [{ id: 1, title: "iPhone", price: 1000, description: "", category: "", image: "" }] },
        });

        const button = screen.getByRole("button", { name: /toggle favorite/i });
        fireEvent.click(button);

        const state = store.getState();
        expect(state.favorites.items).toHaveLength(0);
    });

    it("renders 'View details' link with correct href", () => {
        renderWithStore({ favorites: { items: [] } });
        const link = screen.getByText("View details");
        expect(link).toHaveAttribute("href", "/product/1");
    });
});
