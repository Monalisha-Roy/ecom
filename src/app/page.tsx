import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center">
      <Image src={"/bg.jpg"} alt="Background" layout="fill" objectFit="cover" className="absolute inset-0 z-0 opacit0 brightness-20" />
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center">
        <header className="w-full py-6 bg-opacity-90 relative">

        </header>
        <main className="flex-1 w-full flex flex-col items-center justify-center px-4 relative z-10">
          <div className="w-9/12 text-center mt-12">
            <h1 className="text-3xl font-bold text-center text-white">ShopEase</h1>
            <h2 className="text-6xl font-semibold mb-2">Your One-Stop Shop for Everything!</h2>
            <p className="mb-6 text-lg text-white">
              Explore a wide range of products at unbeatable prices. Fast shipping, easy returns, and 24/7 customer support.
            </p>
            <Link href={"/public/homepage"} >
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Shop Now
            </button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Image src="/electronics.png" alt="Electronics" width={80} height={80} />
              <h3 className="mt-4 font-medium">Electronics</h3>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/fashion.png" alt="Fashion" width={80} height={80} />
              <h3 className="mt-4 font-medium">Fashion</h3>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/home.png" alt="Home & Living" width={80} height={80} />
              <h3 className="mt-4 font-medium">Home & Living</h3>
            </div>
          </div>
        </main>
      </div>

    </div>

  );
}
