import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
}

interface ProductsState {
    items: Product[];
    status: "idle" | "loading" | "failed";
    search: string;
    category: string;
    sort: "asc" | "desc";
}

const initialState: ProductsState = {
    items: [],
    status: "idle",
    search: "",
    category: "all",
    sort: "asc",
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
    const res = await axios.get<Product[]>("https://fakestoreapi.com/products");
    return res.data;
});

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
        },
        setCategory(state, action: PayloadAction<string>) {
            state.category = action.payload;
        },
        setSort(state, action: PayloadAction<"asc" | "desc">) {
            state.sort = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = "idle";
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export const { setSearch, setCategory, setSort } = productsSlice.actions;
export default productsSlice.reducer;
