"use client";

import { Fragment} from "react";
import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultArticleCount: number;
  setDefaultArticleCount: (count: number) => void;
}

export default function UserSettingsModal({
  isOpen,
  onClose,
  defaultArticleCount,
  setDefaultArticleCount,
}: UserSettingsModalProps) {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        await signOut();
        router.push("/");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition
            as={Fragment}
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition>

          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition
            as={Fragment}
            show={isOpen}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                User Settings
              </DialogTitle>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Article Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={defaultArticleCount}
                  onChange={(e) =>
                    setDefaultArticleCount(Number(e.target.value))
                  }
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-100"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-red-500 text-sm rounded hover:bg-red-100 dark:hover:bg-red-600 dark:text-gray-100"
                >
                  Delete Account
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-blue-500 underline"
                >
                  Close
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
}

