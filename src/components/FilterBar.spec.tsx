import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import FilterBar from "./FilterBar";

describe("FilterBar Component", () => {
    let onCategoryChange: (value: string) => void;
    let onSortChange: (value: "asc" | "desc") => void;

    beforeEach(() => {
        // Cast vi.fn() to the correct function type
        onCategoryChange = vi.fn() as unknown as (value: string) => void;
        onSortChange = vi.fn() as unknown as (value: "asc" | "desc") => void;
    });

    it("renders category select with all options", () => {
        render(<FilterBar onCategoryChange={onCategoryChange} onSortChange={onSortChange} />);

        const selects = screen.getAllByRole("combobox");
        expect(selects).toHaveLength(2); // category + sort

        const options = screen.getAllByRole("option");
        expect(options.map((o) => o.textContent)).toEqual([
            "All Categories",
            "Electronics",
            "Jewelery",
            "Men",
            "Women",
            "Price: Low → High",
            "Price: High → Low",
        ]);
    });

    it("calls onCategoryChange when a category is selected", () => {
        render(<FilterBar onCategoryChange={onCategoryChange} onSortChange={onSortChange} />);

        const categorySelect = screen.getAllByRole("combobox")[0];
        fireEvent.change(categorySelect, { target: { value: "electronics" } });

        expect(onCategoryChange).toHaveBeenCalledWith("electronics");
        expect(onCategoryChange).toHaveBeenCalledTimes(1);
    });

    it("calls onSortChange when a sort option is selected", () => {
        render(<FilterBar onCategoryChange={onCategoryChange} onSortChange={onSortChange} />);

        const sortSelect = screen.getAllByRole("combobox")[1];
        fireEvent.change(sortSelect, { target: { value: "desc" } });

        expect(onSortChange).toHaveBeenCalledWith("desc");
        expect(onSortChange).toHaveBeenCalledTimes(1);
    });
});
