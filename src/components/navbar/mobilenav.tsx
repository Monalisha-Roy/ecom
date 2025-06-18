import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { TiShoppingCart } from "react-icons/ti";

// MobileNav.tsx
export function MobileNav({ menuOpen, setMenuOpen, cartCount }: { 
  menuOpen: boolean, 
  setMenuOpen: (open: boolean) => void,
  cartCount: number 
}) {
  return !menuOpen ? (
    <div className="flex gap-1 items-center justify-center md:hidden">
      <Link
        href="/cart"
        className="text-gray-700 flex gap-0.5 hover:text-primary mx-4 relative"
      >
        <TiShoppingCart size={25} />
        Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>
      <button
        className=" flex items-center px-2 py-1 text-gray-700"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <RxHamburgerMenu size={30} />
      </button>
    </div>
  ) : (
    <button
      className="absolute top-4 right-6 text-gray-500 text-5xl font-extralight md:hidden hover:text-black"
      onClick={() => setMenuOpen(false)}
      aria-label="Close menu"
    >
      &times;
    </button>
  );
}