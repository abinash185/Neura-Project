import { Link } from "react-router-dom";
import { Product } from "../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const dispatch = useDispatch();

    const favorites = useSelector((state: RootState) => state.favorites.items);

    const isFavorite = favorites.some((fav) => fav.id === product.id);

    const handleFavoriteToggle = () => {
        if (isFavorite) {
            dispatch(removeFavorite(product.id));
        } else {
            dispatch(addFavorite(product));
        }
    };

    return (
        <div className="group relative bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
            {/* Favorite Icon */}
            <button
                onClick={handleFavoriteToggle}
                aria-label="Toggle favorite"
                className="
          absolute top-3 right-3
          w-9 h-9
          rounded-full
          bg-black/70
          flex items-center justify-center
          hover:bg-black
          transition
        "
            >
                <i className={`pi pi-heart text-sm transition-colors ${isFavorite ? "text-red-500" : "text-white"}`} />
            </button>

            {/* Image */}
            <div className="h-36 flex items-center justify-center mb-3">
                <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
            </div>

            {/* Content */}
            <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.title}</h3>

            <p className="text-lg font-semibold text-gray-900 mb-3">${product.price}</p>

            <div className="mt-auto">
                <Link to={`/product/${product.id}`} className="text-sm text-blue-600 hover:underline">
                    View details
                </Link>
            </div>
        </div>
    );
}
