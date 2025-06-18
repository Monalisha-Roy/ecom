import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

// ProfileDropdown.tsx
export function ProfileDropdown({
  isLoggedIn,
  user,
  profileOpen,
  setProfileOpen,
  handleLogout,
  loggingOut
}: {
    isLoggedIn: boolean;
    user?: { name?: string; email?: string };
    profileOpen: boolean;
    setProfileOpen: (open: boolean) => void;
    handleLogout: () => void;
    loggingOut?: boolean;
}) {
  return isLoggedIn ? (
    <div className="relative ml-4">
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary"
      >
        <FaUserCircle size={24} />
        <span className="font-medium">{user?.name || "Profile"}</span>
      </button>

      {profileOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setProfileOpen(false)}
          />
          <div className="absolute right-0 top-10 mt-2 bg-white rounded-xl shadow-xl p-4 w-56 z-50 border border-gray-100">
            <div className="flex flex-col items-start border-b pb-3 mb-3">
              <Link href="/profile" className="w-full">
                <span className="flex items-center gap-2 px-2 py-1 rounded-md font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
                  <FaUserCircle size={20} className="text-primary" />
                  Profile
                </span>
              </Link>
              <span className="text-xs text-gray-500 mt-1 px-2 break-all">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium transition-colors"
              disabled={loggingOut}
            >
              <FiLogOut size={18} />
              {loggingOut ? (
                <span className="animate-pulse text-red-400">Logging out...</span>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  ) : (
    <Link
      href="/auth"
      className="text-gray-700  hover:text-primary mx-4"
    >
      Login
    </Link>
  );
}