import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import SearchBar from "./SearchBar";
import productsReducer from "../features/products/productsSlice";

function renderWithStore() {
    const store = configureStore({
        reducer: { products: productsReducer },
    });

    return {
        store,
        ...render(
            <Provider store={store}>
                <SearchBar />
            </Provider>
        ),
    };
}

describe("SearchBar component", () => {
    beforeEach(() => {
        vi.useFakeTimers(); // For debounce
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders input and search icon", () => {
        renderWithStore();
        expect(screen.getByPlaceholderText("Search products...")).toBeInTheDocument();
        expect(document.querySelector(".pi-search")).toBeInTheDocument();
    });

    it("updates input value on typing", () => {
        renderWithStore();
        const input = screen.getByPlaceholderText("Search products...") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "iPhone" } });
        expect(input.value).toBe("iPhone");
    });

    it("dispatches setSearch after debounce", async () => {
        const { store } = renderWithStore();
        const input = screen.getByPlaceholderText("Search products...") as HTMLInputElement;

        fireEvent.change(input, { target: { value: "iPhone" } });

        // Advance timers by debounce delay
        vi.advanceTimersByTime(300);

        // Force pending useEffect to run
        await Promise.resolve();

        // Check store state
        expect(store.getState().products.search).toBe("iPhone");
    });
});
