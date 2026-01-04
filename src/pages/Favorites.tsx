import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { removeFavorite } from "../features/favorites/favoritesSlice";
import { Link } from "react-router-dom";
import "primeicons/primeicons.css";

export default function Favorites() {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);

    if (favorites.length === 0) {
        return (
            <div className="h-[90vh] flex flex-col items-center justify-center gap-2">
                <i className="pi pi-heart text-4xl text-gray-300" />
                <p className="text-gray-600">No favorite products yet</p>
                <Link to="/" className="text-blue-600 underline">
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div className=" mx-auto px-4 py-6 h-[95vh]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <i className="pi pi-heart-fill text-red-500" />
                Your Favorites
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((product) => (
                    <div key={product.id} className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col">
                        {/* Image */}
                        <div className="relative h-40 flex items-center justify-center mb-4">
                            <img src={product.image} alt={product.title} className="max-h-full object-contain" />

                            {/* Remove favorite */}
                            <button
                                onClick={() => dispatch(removeFavorite(product.id))}
                                className="absolute top-2 right-2"
                                aria-label="Remove from favorites"
                            >
                                <i className="pi pi-heart-fill text-red-500 text-lg hover:scale-110 transition-transform" />
                            </button>
                        </div>

                        {/* Content */}
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{product.title}</h3>

                        <p className="text-lg font-semibold text-gray-900 mb-3">${product.price}</p>

                        {/* Actions */}
                        <Link to={`/product/${product.id}`} className="mt-auto text-sm text-blue-600 hover:underline">
                            View details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
