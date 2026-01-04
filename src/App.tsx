import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import { RootState } from "./app/store";

import "primeicons/primeicons.css";

export default function App() {
    const favoriteCount = useSelector((state: RootState) => state.favorites.items.length);

    return (
        <BrowserRouter>
            {/* Full-width sticky navbar */}
            <nav className="sticky top-0 z-50 w-full bg-gray-900 shadow-md mt-0">
                <div className="w-screen mx-auto px-4 py-6 flex gap-6 items-center">
                    <Link to="/" className="text-white hover:text-gray-200 font-medium">
                        Products
                    </Link>
                    <Link to="/favorites" className="relative text-white hover:text-gray-200 font-medium flex items-center justify-center gap-2">
                        Favorites
                        {favoriteCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full items-center flex justify-center">
                                {favoriteCount}
                            </span>
                        )}
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <main className="flex-1 flex flex-col">
                <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/favorites" element={<Favorites />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
