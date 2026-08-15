import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="text-xl font-bold">
          Vorix Security
        </Link>

        <div className="flex gap-6 text-sm">
          <Link href="/">خانه</Link>
          <Link href="/dashboard">داشبورد</Link>
          <Link href="/security">امنیت</Link>
          <Link href="/about">درباره ما</Link>
          <Link href="/contact">تماس</Link>
        </div>

        <Link
          href="/login"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          ورود
        </Link>

      </nav>
    </header>
  );
}
