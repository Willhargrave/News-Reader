import Link from "next/link";
import { useSession} from "next-auth/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import UserSettingsModal from "./UserSettingsModal";
export default function Header() {
const { data: session } = useSession();
const {theme, setTheme} = useTheme()
const [mounted, setMounted] = useState(false)
const [showModal, setShowModal] = useState(false);



useEffect(() => setMounted(true), [])

return (
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-bold">Just The News</h1>
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        theme === "dark" ? (
          <SunIcon className="w-6 h-6 text-yellow-400" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-800" />
        )
      ) : (
        "Toggle Mode"
      )}
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
        <button
          onClick={() => setShowModal(true)}
          className="focus:outline-none"
          aria-label="User Options"
        >
          <UserCircleIcon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    )}
    {showModal && (
        <UserSettingsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
    )}
  </header>
);
}