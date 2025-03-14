"use client";
import { Fragment } from "react";
import { Dialog, DialogTitle, DialogPanel, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useFeedCountsContext } from "@/app/providers/FeedCountContext";
import { useSession } from "next-auth/react";

export default function UserSettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useFeedCountsContext();

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        await signOut();
        router.push("/");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleConfirmSettings = async () => {
    try {
      const res = await fetch("/api/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultArticleCount: state.defaultCount }),
      });
      if (res.ok) {
        onClose();
      } else {
        console.error("Error updating settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const panelClasses = `inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left 
    align-middle transition-all transform shadow-xl rounded-2xl ${
      theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
    }`;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
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
          <span className="inline-block h-screen align-middle" aria-hidden="true">
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
            <DialogPanel className={panelClasses}>
              <DialogTitle as="h3" className="text-lg font-medium leading-6">
                User Settings for {session?.user?.name || "User"}
              </DialogTitle>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Default Article Count
                </label>
                <input
                  type="number"
                  min={1}
                  value={state.defaultCount}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_DEFAULT",
                      payload: Number(e.target.value),
                      selectedFeeds: state.selectedFeeds,
                    })
                  }
                  className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleConfirmSettings}
                  className="px-4 py-2 border border-blue-500 text-sm rounded hover:bg-blue-100 dark:hover:bg-blue-600"
                >
                  Confirm
                </button>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-4 py-2 border border-gray-500 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-red-500 text-sm rounded hover:bg-red-100 dark:hover:bg-red-600"
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
            </DialogPanel>
          </Transition>
        </div>
      </Dialog>
    </Transition>
  );
}

