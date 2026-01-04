import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import productsReducer, { setSearch, setCategory, setSort } from "../features/products/productsSlice";
import favoritesReducer, { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";
import { Product } from "../features/products/productsSlice";

import { store as appStore, RootState } from "./store";

describe("Redux store", () => {
    it("should have initial state for products and favorites", () => {
        const state: RootState = appStore.getState();

        expect(state.products.items).toEqual([]);
        expect(state.products.status).toBe("idle");
        expect(state.products.search).toBe("");
        expect(state.products.category).toBe("all");
        expect(state.products.sort).toBe("asc");

        expect(state.favorites.items).toEqual([]);
    });

    it("should update products state when dispatching actions", () => {
        const store = configureStore({
            reducer: { products: productsReducer },
        });

        store.dispatch(setSearch("phone"));
        store.dispatch(setCategory("electronics"));
        store.dispatch(setSort("desc"));

        const state = store.getState();
        expect(state.products.search).toBe("phone");
        expect(state.products.category).toBe("electronics");
        expect(state.products.sort).toBe("desc");
    });

    it("should add and remove favorites correctly", () => {
        const store = configureStore({
            reducer: { favorites: favoritesReducer },
        });

        const product: Product = { id: 1, title: "iPhone", price: 100, description: "", category: "electronics", image: "" };

        store.dispatch(addFavorite(product));
        let state = store.getState();
        expect(state.favorites.items).toHaveLength(1);
        expect(state.favorites.items[0].id).toBe(1);

        store.dispatch(removeFavorite(1));
        state = store.getState();
        expect(state.favorites.items).toHaveLength(0);
    });
});
