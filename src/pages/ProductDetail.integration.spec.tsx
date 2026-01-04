import { screen, fireEvent, waitFor } from "@testing-library/react";
import ProductDetail from "./ProductDetail";
import axios from "axios";
import { vi, describe, it, expect } from "vitest";
import { renderWithStoreAndRouter } from "./test-utils";

vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockProduct = { id: 1, title: "iPhone", price: 100, description: "Test", category: "electronics", image: "iphone.png" };

describe("Integration: ProductDetail", () => {
    it("loads product and toggles favorite", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        const { store } = renderWithStoreAndRouter(<ProductDetail />, { route: "/product/1", preloadedState: { favorites: { items: [] } } });

        expect(screen.getByText("Loading product...")).toBeInTheDocument();

        await waitFor(() => screen.getByText("iPhone"));

        const favButton = screen.getByText("Add to Favorites");
        fireEvent.click(favButton);

        const state = store.getState();
        expect(state.favorites.items).toHaveLength(1);
    });
});
