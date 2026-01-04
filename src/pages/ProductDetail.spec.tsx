import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductDetail from "./ProductDetail";
import favoritesReducer from "../features/favorites/favoritesSlice";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

/* ---------------- MOCK GSAP ---------------- */
vi.mock("gsap", () => ({
    default: { fromTo: vi.fn(), to: vi.fn() },
}));

/* ---------------- MOCK AXIOS ---------------- */
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

/* ---------------- HELPER: render with store and router ---------------- */
function renderWithStoreAndRouter(preloadedState: any, initialRoute = "/product/1") {
    const store = configureStore({
        reducer: { favorites: favoritesReducer } as any,
        preloadedState,
    });

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/product/:id" element={<ProductDetail />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
}

/* ---------------- TEST DATA ---------------- */
const mockProduct = {
    id: 1,
    title: "iPhone",
    description: "Phone description",
    price: 999,
    image: "iphone.png",
    category: "electronics",
};

/* ---------------- TESTS ---------------- */
describe("ProductDetail Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state initially", () => {
        renderWithStoreAndRouter({ favorites: { items: [] } });
        expect(screen.getByText("Loading product...")).toBeInTheDocument();
    });

    it("renders product details after fetch", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        renderWithStoreAndRouter({ favorites: { items: [] } });

        await waitFor(() => expect(screen.getByText("iPhone")).toBeInTheDocument());
        expect(screen.getByText("Phone description")).toBeInTheDocument();
        expect(screen.getByText("$999")).toBeInTheDocument();
        expect(screen.getByText("Add to Favorites")).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", "iphone.png");
    });

    it("shows 'Product not found.' if fetch fails", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));

        renderWithStoreAndRouter({ favorites: { items: [] } });

        await waitFor(() => expect(screen.getByText("Product not found.")).toBeInTheDocument());
    });

    it("dispatches addFavorite when favorite button is clicked", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        const store = configureStore({
            reducer: { favorites: favoritesReducer },
            preloadedState: { favorites: { items: [] } },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/product/1"]}>
                    <Routes>
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText("Add to Favorites")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Add to Favorites"));

        // Check store updated
        const state = store.getState().favorites.items;
        expect(state.find((p) => p.id === mockProduct.id)).toBeDefined();
    });

    it("dispatches removeFavorite when product is already a favorite", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        const store = configureStore({
            reducer: { favorites: favoritesReducer },
            preloadedState: { favorites: { items: [mockProduct] } },
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={["/product/1"]}>
                    <Routes>
                        <Route path="/product/:id" element={<ProductDetail />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => expect(screen.getByText("Remove from Favorites")).toBeInTheDocument());

        fireEvent.click(screen.getByText("Remove from Favorites"));

        const state = store.getState().favorites.items;
        expect(state.find((p) => p.id === mockProduct.id)).toBeUndefined();
    });
});
