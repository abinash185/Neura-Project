interface Props {
    onCategoryChange: (value: string) => void;
    onSortChange: (value: "asc" | "desc") => void;
}

export default function FilterBar({ onCategoryChange, onSortChange }: Props) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Category */}
            <div className="relative">
                <i className="pi pi-filter absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                <select
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="
            appearance-none
            pl-10 pr-8
            py-2.5
            rounded-lg
            border border-gray-300
            text-sm
            bg-white
            text-gray-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            transition
            cursor-pointer
          "
                >
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Men</option>
                    <option value="women's clothing">Women</option>
                </select>
            </div>

            {/* Sort */}
            <div className="relative">
                <i className="pi pi-sort-alt absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                <select
                    onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}
                    className="
            appearance-none
            pl-10 pr-8
            py-2.5
            rounded-lg
            border border-gray-300
            text-sm
            bg-white
            text-gray-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-blue-500
            transition
            cursor-pointer
          "
                >
                    <option value="asc">Price: Low → High</option>
                    <option value="desc">Price: High → Low</option>
                </select>
            </div>
        </div>
    );
}
