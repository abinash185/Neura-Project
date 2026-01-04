import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchProducts, setCategory, setSort } from "../features/products/productsSlice";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import gsap from "gsap";

export default function ProductList() {
    const dispatch = useDispatch<AppDispatch>();
    const gridRef = useRef<HTMLDivElement>(null);

    const { items, status, search, category, sort } = useSelector((state: RootState) => state.products);

    useEffect(() => {
        if (status === "idle" && items.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, status, items.length]);

    const filteredProducts = useMemo(() => {
        let data = [...items];

        if (search) {
            data = data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
        }

        if (category !== "all") {
            data = data.filter((p) => p.category === category);
        }

        data.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));

        return data;
    }, [items, search, category, sort]);

    /* GSAP entrance animation */
    useEffect(() => {
        if (!gridRef.current || filteredProducts.length === 0) return;

        gsap.fromTo(
            gridRef.current.children,
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
            }
        );
    }, [filteredProducts]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-[95vh]">
                <p className="text-gray-500">Loading products…</p>
            </div>
        );
    }

    return (
        <section className="w-screen  mx-auto px-4 py-6 space-y-6 h-[95vh] overflow-x-hidden overflow-y-auto">
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <SearchBar />
                <FilterBar onCategoryChange={(val) => dispatch(setCategory(val))} onSortChange={(val) => dispatch(setSort(val))} />
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && <div className="text-center py-16 text-gray-500">No products found.</div>}

            {/* Product Grid */}
            <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <footer className="w-full  text-white py-4 shadow-inner mt-auto bottom-0">
                {/* <div className="max-w-7xl mx-auto px-4 text-center">&copy; {new Date().getFullYear()} My Store. All rights reserved.</div> */}
            </footer>
        </section>
    );
}
