// test-utils.tsx
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import productsReducer from "../features/products/productsSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";

export function renderWithStoreAndRouter(
    ui: React.ReactElement,
    {
        preloadedState = {},
        route = "/",
        store = configureStore({
            reducer: { products: productsReducer, favorites: favoritesReducer } as any,
            preloadedState,
        }),
    }: any = {}
) {
    window.history.pushState({}, "Test page", route);

    return {
        store,
        ...render(
            <Provider store={store}>
                <MemoryRouter>{ui}</MemoryRouter>
            </Provider>
        ),
    };
}
