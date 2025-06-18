'use client';
import { useEffect, useState } from "react";
import { Category } from "@/types/types";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { MobileMenu } from "./mobilemenu";
import { DesktopNav } from "./desktopnav";
import { MobileSearch } from "./mobilesearch";
import { MobileNav } from "./mobilenav";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category_id, setCategoryId] = useState("");
  const [price, setPrice] = useState<number>(500);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const { user } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.products || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) return;

      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          type CartItem = { quantity: number };
          const totalItems = data.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
          setCartCount(totalItems);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('cartUpdate', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdate', handleCartUpdate);
    };
  }, [user]);

  const handleFilter = () => {
    if (!category_id && !price) return;
    else if (price == 0) router.push(`/category/${category_id}`);
    else if (!category_id && price) router.push(`/filter/0/${price}`);
    else router.push(`/filter/${category_id}/${price}`);
    setFilterOpen(false);
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setProductsOpen(false);
    setMenuOpen(false);
    router.push(`/category/${categoryId}`);
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
        credentials: "include"
      });

      if (res.ok) {
        window.dispatchEvent(new Event('authChange'));
        setProfileOpen(false);
        setMenuOpen(false);
        router.refresh?.();
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-background shadow z-50">
        <div className="w-11/12 h-16 flex items-center justify-between mx-auto">
          <div className="items-start">
            <p className="text-3xl text-primary font-bold">SHOPEase</p>
          </div>

          <DesktopNav
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            categories={categories.map(cat => ({
              id: cat.id,
              slug: cat.slug
            }))}
            category_id={category_id}
            setCategoryId={setCategoryId}
            price={price}
            setPrice={setPrice}
            handleFilter={handleFilter}
            productsOpen={productsOpen}
            setProductsOpen={setProductsOpen}
            handleCategoryClick={handleCategoryClick}
            cartCount={cartCount}
            isLoggedIn={isLoggedIn}
            user={user ?? undefined}
            profileOpen={profileOpen}
            setProfileOpen={setProfileOpen}
            handleLogout={handleLogout}
            loggingOut={loggingOut}
          />

          <MobileNav
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            cartCount={cartCount}
          />
        </div>

        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          productsOpen={productsOpen}
          setProductsOpen={setProductsOpen}
          categories={categories.map(cat => ({
            id: Number(cat.id),
            slug: cat.slug
          }))}
          handleCategoryClick={(categoryId: number) => handleCategoryClick(String(categoryId))}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          category_id={category_id}
          setCategoryId={(id: string | null) => setCategoryId(id ?? "")}
          price={price}
          setPrice={(price: number | null) => setPrice(price ?? 0)}
          handleFilter={handleFilter}
          isLoggedIn={isLoggedIn}
          user={user ?? undefined}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          handleLogout={handleLogout}
          loggingOut={loggingOut}
        />
      </nav>

      <MobileSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
      />
    </>
  );
}












