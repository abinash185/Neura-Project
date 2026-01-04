import { screen, fireEvent } from "@testing-library/react";
import ProductList from "./ProductList";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { renderWithStoreAndRouter } from "./test-utils";

const mockProducts = [
    { id: 1, title: "iPhone", price: 100, description: "", category: "electronics", image: "iphone.png" },
    { id: 2, title: "Shirt", price: 50, description: "", category: "fashion", image: "shirt.png" },
];

// ---------------- Fake Timers ----------------
beforeAll(() => vi.useFakeTimers());
afterAll(() => vi.useRealTimers());

// ---------------- Mock fetchProducts ----------------
// vi.spyOn(productsSlice, "fetchProducts").mockImplementation((): any => {
//     return (dispatch: any) => {
//         // Dispatch fulfilled immediately
//         const action = { type: "products/fetch/fulfilled", payload: mockProducts };
//         dispatch(action);
//         return Promise.resolve(action); // return resolved promise like RTK thunk
//     };
// });

describe("Integration: ProductList + Search + Favorites", () => {
    beforeEach(() => {
        vi.useFakeTimers(); // For debounce
    });

    afterEach(() => {
        vi.useRealTimers();
    });
    // it("renders products and filters by search", async () => {
    //     renderWithStoreAndRouter(<ProductList />, {
    //         preloadedState: {
    //             products: { items: mockProducts, status: "succeeded", search: "", category: "all", sort: "asc" },
    //             favorites: { items: [] },
    //         },
    //     });

    //     // Products initially rendered
    //     expect(screen.getByText("iPhone")).toBeInTheDocument();
    //     expect(screen.getByText("Shirt")).toBeInTheDocument();

    //     // Type search query
    //     const input = screen.getByPlaceholderText("Search products...");
    //     fireEvent.change(input, { target: { value: "iPhone" } });

    //     // Advance debounce timer
    //     vi.advanceTimersByTime(300);

    //     // Force any pending async effects
    //     await Promise.resolve();

    //     await waitFor(() => {
    //         expect(screen.getByText("iPhone")).toBeInTheDocument();
    //         expect(screen.queryByText("Shirt")).not.toBeInTheDocument();
    //     });
    // });

    it("adds a product to favorites", async () => {
        const { store } = renderWithStoreAndRouter(<ProductList />, {
            preloadedState: {
                products: { items: mockProducts, status: "succeeded", search: "", category: "all", sort: "asc" },
                favorites: { items: [] },
            },
        });

        // Find iPhone card and its favorite button
        const iphoneCard = screen.getByText("iPhone").closest("div")!;
        const favButton = iphoneCard.querySelector('button[aria-label="Toggle favorite"]')!;
        fireEvent.click(favButton);

        const state = store.getState();
        expect(state.favorites.items).toHaveLength(1);
        expect(state.favorites.items[0].title).toBe("iPhone");
    });
});
