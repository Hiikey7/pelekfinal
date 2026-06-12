import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logoPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoLongPressTriggered = useRef(false);

  const desktopLinks = [
    { to: "/", label: "Home" },
    { to: "/properties", label: "Properties" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const mobileLinks = [
    { to: "/", label: "Home" },
    { to: "/properties", label: "Properties" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
    { to: "/favorites", label: "Favourites" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const cancelLogoPress = () => {
    if (logoPressTimer.current) {
      clearTimeout(logoPressTimer.current);
      logoPressTimer.current = null;
    }
  };

  const startLogoPress = () => {
    cancelLogoPress();
    logoLongPressTriggered.current = false;
    logoPressTimer.current = setTimeout(() => {
      logoLongPressTriggered.current = true;
      navigate("/admin/login");
    }, 3000);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="w-[90%] mx-auto flex items-center justify-between h-16">
        {/* Logo - Left */}
        <Link
          to="/"
          className="flex items-center rounded-lg bg-white px-2 py-1 select-none"
          aria-label="Pelek Properties home"
          onPointerDown={startLogoPress}
          onPointerUp={cancelLogoPress}
          onPointerCancel={cancelLogoPress}
          onPointerLeave={cancelLogoPress}
          onContextMenu={(event) => event.preventDefault()}
          onClick={(event) => {
            if (logoLongPressTriggered.current) {
              event.preventDefault();
              logoLongPressTriggered.current = false;
            }
          }}
        >
          <img
            src="/logo-nav.png"
            alt="Pelek Properties"
            className="h-20 w-auto bg-white"
            width={160}
            height={80}
            decoding="async"
            draggable={false}
          />
        </Link>

        {/* Nav Links - Center */}
        <div className="hidden md:flex items-center gap-8">
          {desktopLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "text-[#06c6b6]"
                  : "text-muted-foreground hover:text-[#06c6b6]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Book Now Button - Right */}
        <Link
          to="/properties?category=airbnb"
          className="hidden md:inline-flex bg-[#06c6b6] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#05b3a3] transition-colors"
        >
          Book Now
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg hover:bg-muted text-foreground"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="w-[90%] mx-auto py-4 flex flex-col gap-1">
              {mobileLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.to)
                      ? "text-[#06c6b6]"
                      : "text-muted-foreground hover:text-[#06c6b6]"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Favorites Button */}
      <Link
        to="/favorites"
        className="fixed bottom-6 right-6 z-50 bg-[#06c6b6] text-white p-4 rounded-full shadow-lg hover:bg-[#05b3a3] transition-colors hidden md:block"
        aria-label="Favourites"
      >
        <Heart className="w-6 h-6" />
      </Link>
    </nav>
  );
}
