import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import favoritesReducer from "./features/favorites/favoritesSlice";
import App from "./App";

/* ------------------ MOCK SCREENS ------------------ */
vi.mock("./pages/ProductList", () => ({
    default: () => <div>Mock ProductList</div>,
}));

vi.mock("./pages/ProductDetail", () => ({
    default: () => <div>Mock ProductDetail</div>,
}));

vi.mock("./pages/Favorites", () => ({
    default: () => <div>Mock Favorites</div>,
}));

/* ------------------ RENDER HELPER ------------------ */
function renderApp(preloadedFavorites: any[] = []) {
    const store = configureStore({
        reducer: {
            favorites: favoritesReducer,
        },
        preloadedState: {
            favorites: {
                items: preloadedFavorites,
            },
        },
    });

    return render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}

/* ------------------ TESTS ------------------ */
describe("App Component", () => {
    it("renders navbar links", () => {
        renderApp();

        expect(screen.getByText("Products")).toBeInTheDocument();
        expect(screen.getByText("Favorites")).toBeInTheDocument();
    });

    it("shows favorites count badge when favorites exist", () => {
        renderApp([{ id: 1, title: "Test Product" }]);

        expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("renders ProductList on default route", () => {
        renderApp();

        expect(screen.getByText("Mock ProductList")).toBeInTheDocument();
    });

    it("navigates to Favorites page", async () => {
        renderApp();

        screen.getByText("Favorites").click();

        expect(await screen.findByText("Mock Favorites")).toBeInTheDocument();
    });
});
