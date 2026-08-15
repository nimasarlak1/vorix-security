import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        <Link href="/" className="text-xl font-bold">
          Vorix Security
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>

          <Link href="/dashboard" className="hover:text-gray-600">
            Dashboard
          </Link>

          <Link href="/security" className="hover:text-gray-600">
            Security
          </Link>

          <Link href="/about" className="hover:text-gray-600">
            About
          </Link>

          <Link href="/contact" className="hover:text-gray-600">
            Contact
          </Link>
        </div>

        <Link
          href="/login"
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Login
        </Link>

      </nav>
    </header>
  );
}
