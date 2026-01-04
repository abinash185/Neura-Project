import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearch } from "../features/products/productsSlice";
import { AppDispatch } from "../app/store";
import "primeicons/primeicons.css";
export default function SearchBar() {
    const dispatch = useDispatch<AppDispatch>();
    const [value, setValue] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            dispatch(setSearch(value));
        }, 300);

        return () => clearTimeout(handler);
    }, [value, dispatch]);

    return (
        <div className="relative w-full md:w-1/2">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-white text-sm" />

            <input
                type="text"
                placeholder="Search products..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="
          w-full
          pl-10 pr-3
          py-2.5
          rounded-lg
          border border-gray-300
          text-sm
          text-white
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          transition
        "
            />
        </div>
    );
}
