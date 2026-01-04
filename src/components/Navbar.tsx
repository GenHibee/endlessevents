import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Wallet, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Calendar,
  Plus,
  Ticket,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/my-tickets", label: "My Tickets", icon: Ticket },
  { href: "/my-poaps", label: "POAPs", icon: Award },
];

const hostLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create-event", label: "Create Event", icon: Plus },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, switchRole } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-strong mt-4 rounded-2xl px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Ticket className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Endless<span className="text-gradient">Events</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.role === "host" && (
                <>
                  <div className="w-px h-6 bg-border mx-2" />
                  {hostLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>

            {/* Right section */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-primary/30">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glass-strong" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.walletAddress}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-tickets")}>
                      <Ticket className="mr-2 h-4 w-4" />
                      My Tickets
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-poaps")}>
                      <Award className="mr-2 h-4 w-4" />
                      My POAPs
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => switchRole(user.role === "host" ? "attendee" : "host")}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Switch to {user.role === "host" ? "Attendee" : "Host"} Mode
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuth} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Sign In
                  </Button>
                  <Button variant="gradient" onClick={() => navigate("/login")}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass-strong mt-2 rounded-2xl p-4"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user?.role === "host" && (
                  <>
                    <div className="border-t border-border my-2" />
                    {hostLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    ))}
                  </>
                )}
                <div className="border-t border-border my-2" />
                {isAuthenticated ? (
                  <Button variant="destructive" onClick={handleAuth} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <Button variant="gradient" onClick={() => navigate("/login")} className="w-full">
                    <Wallet className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
