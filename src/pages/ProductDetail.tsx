import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../features/products/productsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";
import { RootState } from "../app/store";
import gsap from "gsap";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    const isFavorite = favorites.some((p) => p.id === Number(id));

    const imageRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                setProduct(null); // handle fetch failure
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    // Entry animations
    useEffect(() => {
        if (!loading && product) {
            gsap.fromTo(
                imageRef.current,
                { opacity: 0, scale: 0.9, rotationY: -10 },
                { opacity: 1, scale: 1, rotationY: 0, duration: 0.7, ease: "power2.out" }
            );

            if (contentRef.current?.children)
                gsap.fromTo(
                    contentRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 }
                );
        }
    }, [loading, product]);

    // Hover 3D tilt and scale
    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = image.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the image
            const y = e.clientY - rect.top; // y position within the image
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
            const rotateY = ((x - centerX) / centerX) * 10; // max 10deg

            gsap.to(image, {
                rotationX: -rotateX,
                rotationY: rotateY,
                scale: 1.05,
                transformPerspective: 500,
                transformOrigin: "center",
                duration: 0.3,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(image, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.5, ease: "power2.out" });
        };

        image.addEventListener("mousemove", handleMouseMove);
        image.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            image.removeEventListener("mousemove", handleMouseMove);
            image.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [imageRef.current]);

    const handleFavoriteClick = () => {
        if (!product) return;

        gsap.fromTo(buttonRef.current, { scale: 1 }, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 });
        isFavorite ? dispatch(removeFavorite(product.id)) : dispatch(addFavorite(product));
    };

    if (loading) return <p className="p-4 h-[96vh]">Loading product...</p>;
    if (!product) return <p className="p-4 h-[96vh]">Product not found.</p>;

    return (
        <div
            className="p-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center"
            style={{ height: "calc(100vh - 5rem)" }} // keep your existing height
        >
            {/* Image */}
            <div className="perspective-1000 flex justify-center items-start">
                <img
                    ref={imageRef}
                    src={product.image}
                    alt={product.title}
                    className="h-80 object-contain mx-auto rounded-lg shadow-lg cursor-pointer"
                />
            </div>

            {/* Content */}
            <div
                ref={contentRef}
                className="space-y-4 overflow-y-auto md:overflow-y-visible"
                style={{ maxHeight: "100%" }} // allow scroll if content exceeds container
            >
                <h1 className="text-xl font-semibold">{product.title}</h1>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <p className="text-2xl font-bold">${product.price}</p>
                <button
                    ref={buttonRef}
                    onClick={handleFavoriteClick}
                    className={`px-5 py-2.5 rounded-lg text-white font-medium transition-colors ${
                        isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
            </div>
        </div>
    );
}
