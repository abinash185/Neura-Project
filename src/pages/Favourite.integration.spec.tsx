import { screen } from "@testing-library/react";
import Favorites from "./Favorites";
import { renderWithStoreAndRouter } from "./test-utils";

describe("Integration: Favorites Page", () => {
    it("shows favorite products", () => {
        renderWithStoreAndRouter(<Favorites />, {
            preloadedState: {
                favorites: { items: [{ id: 1, title: "iPhone", price: 100, description: "", category: "", image: "" }] },
            },
        });

        expect(screen.getByText("iPhone")).toBeInTheDocument();
    });
});
