import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Flame,
  LogIn,
  LogOut,
  Menu,
  Shield,
  Swords,
  Trophy,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

const navLinks = [
  { to: "/", label: "Home", icon: Flame },
  { to: "/tournaments", label: "Tournaments", icon: Swords },
  { to: "/leaderboard", label: "Leaderboard", icon: BarChart3 },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isLoggingIn = loginStatus === "logging-in";

  const allLinks = isAdmin
    ? [...navLinks, { to: "/admin", label: "Admin", icon: Shield }]
    : navLinks;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Flame className="w-7 h-7 text-fire-orange animate-flicker" />
              <div className="absolute inset-0 blur-md bg-fire-orange/40 animate-pulse-glow rounded-full" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-800 text-lg text-gradient-fire tracking-tight">
                FF Bangladesh
              </span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                Official Tournament
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentPath === link.to ||
                (link.to !== "/" && currentPath.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-ocid="nav.link"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-fire-orange bg-fire-orange/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {identity ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {identity.getPrincipal().toString().slice(0, 10)}...
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  data-ocid="nav.button"
                  className="border-muted text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.primary_button"
                className="hidden md:flex bg-fire-orange hover:bg-fire-orange/90 text-background font-semibold"
              >
                <LogIn className="w-4 h-4 mr-1" />
                {isLoggingIn ? "Connecting..." : "Login"}
              </Button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
            >
              <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {allLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    currentPath === link.to ||
                    (link.to !== "/" && currentPath.startsWith(link.to));
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      data-ocid="nav.link"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "text-fire-orange bg-fire-orange/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
                {identity ? (
                  <button
                    type="button"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.button"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    data-ocid="nav.primary_button"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-fire-orange bg-fire-orange/10"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-fire-orange" />
              <span className="font-heading font-bold text-gradient-fire">
                FF Bangladesh Tournament
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                to="/tournaments"
                data-ocid="nav.link"
                className="hover:text-foreground transition-colors"
              >
                Tournaments
              </Link>
              <Link
                to="/leaderboard"
                data-ocid="nav.link"
                className="hover:text-foreground transition-colors"
              >
                Leaderboard
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fire-orange hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
