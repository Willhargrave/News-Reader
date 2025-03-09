import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function Header() {
const { data: session } = useSession();
const {theme, setTheme} = useTheme()
const [mounted, setMounted] = useState(false)

useEffect(() => setMounted(true), [])

return(
<header className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">Just The News</h1>
<button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-4 py-2 border rounded"
    >
      {mounted ? `Toggle ${theme === 'dark' ? 'Light' : 'Dark'} Mode` : 'Toggle Mode'}
    </button>
  {!session ? (
    <div className="flex space-x-4">
      <Link
        href="/login"
        className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
      >
        Register
      </Link>
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      <p className="text-sm">
        Welcome, {session.user?.name || "User"}!
      </p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  )}
</header>
)
}