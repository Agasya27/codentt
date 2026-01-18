import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isAuthenticated, getCurrentUser, clearAuth } from "@/lib/auth";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  onCtaClick: () => void;
}

const NavbarLogo = () => (
  <svg
    className="h-10 w-auto"
    viewBox="0 0 520 140"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Codentt"
  >
    <path
      d="M60 30 L30 70 L60 110"
      fill="none"
      stroke="#F97316"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M140 30 L170 70 L140 110"
      fill="none"
      stroke="#2563EB"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <ellipse cx="100" cy="60" rx="14" ry="26" fill="#111827" />
    <circle cx="100" cy="55" r="5" fill="#60A5FA" />
    <polygon points="100,20 90,38 110,38" fill="#111827" />
    <polygon points="86,70 70,90 88,86" fill="#1F2937" />
    <polygon points="114,70 130,90 112,86" fill="#1F2937" />
    <polygon points="100,92 90,118 100,108 110,118" fill="#F97316" />
    <polygon points="100,96 94,112 100,106 106,112" fill="#FACC15" />
    <text
      x="200"
      y="75"
      fontFamily="Inter, Segoe UI, Arial, sans-serif"
      fontSize="48"
      fontWeight="700"
      fill="#111827"
    >
      Codentt
    </text>
    <text
      x="200"
      y="105"
      fontFamily="Inter, Segoe UI, Arial, sans-serif"
      fontSize="14"
      letterSpacing="1.5"
      fill="#6B7280"
    >
      CODE. COMPETE. CONQUER.
    </text>
  </svg>
);

const Navbar = ({ onCtaClick }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      if (auth) {
        setUser(getCurrentUser());
      }
    };
    checkAuth();
    // Check auth state periodically
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      setAuthenticated(false);
      setUser(null);
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      // Even if logout fails, clear local storage
      clearAuth();
      setAuthenticated(false);
      setUser(null);
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been logged out.",
        variant: "default",
      });
    }
  };

  const navLinks = [
    { href: "#features", label: "Features", hasDropdown: true },
    { to: "/experts", label: "Experts", isLink: true },
    { href: "#faq", label: "FAQ" },
  ];

  const featurePages = [
    { to: "/dsa", label: "DSA Practice", description: "Master data structures & algorithms" },
    { to: "/dbms", label: "DBMS Concepts", description: "Learn database fundamentals" },
    { to: "/hr", label: "HR Interview", description: "Ace behavioral questions" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      {/* Curved pill navbar container */}
      <div className="bg-white border border-codentt-blue/20 rounded-full px-4 py-2 flex items-center gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center px-4">
          <NavbarLogo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.href} className="relative">
              {link.hasDropdown ? (
                <div
                  className="relative"
                  onMouseEnter={() => setIsFeaturesOpen(true)}
                  onMouseLeave={() => setIsFeaturesOpen(false)}
                >
                  <button
                    className="flex items-center gap-1 text-codentt-blue hover:text-codentt-dark transition-colors duration-200 font-medium text-sm px-4 py-2 rounded-full hover:bg-codentt-light"
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Modern Semi-Blurred Dropdown */}
                  {isFeaturesOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 animate-fade-in">
                      <div className="bg-white/95 backdrop-blur-2xl border border-codentt-blue/15 rounded-2xl shadow-2xl shadow-codentt-blue/15 p-2 min-w-[280px]">
                        {featurePages.map((page) => (
                          <Link
                            key={page.to}
                            to={page.to}
                            className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-codentt-light transition-all duration-200 group"
                          >
                            <span className="font-medium text-codentt-blue group-hover:text-codentt-dark transition-colors">
                              {page.label}
                            </span>
                            <span className="text-xs text-slate-500">
                              {page.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : link.isLink ? (
                <Link
                  to={link.to!}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 font-medium text-sm px-4 py-2 rounded-full hover:bg-codentt-light"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 font-medium text-sm px-4 py-2 rounded-full hover:bg-codentt-light"
                >
                  {link.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA / Profile */}
        <div className="hidden md:flex items-center ml-2 gap-2">
          {authenticated ? (
            <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="rounded-full h-9 w-9 p-0 text-codentt-blue hover:text-codentt-dark hover:bg-codentt-light"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profilePictureUrl} alt={user?.username} />
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border border-codentt-blue/20">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/auth/login")}
                className="rounded-full text-codentt-blue hover:text-codentt-dark hover:bg-codentt-light"
              >
                Login
              </Button>
              <Button
                onClick={onCtaClick}
                className="bg-codentt-blue hover:bg-codentt-dark text-white rounded-full px-5 py-5 font-medium text-sm gap-2 group transition-all duration-300 shadow-lg shadow-codentt-blue/30 hover:shadow-codentt-blue/40"
              >
                Start Your Journey
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-codentt-blue hover:text-codentt-dark hover:bg-codentt-light"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-x-4 top-20 md:hidden bg-white/95 backdrop-blur-xl border border-codentt-blue/20 rounded-2xl shadow-2xl p-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            {/* Features with sub-items */}
            <div className="space-y-1">
              <button
                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                className="flex items-center justify-between w-full text-codentt-blue hover:text-codentt-dark transition-colors duration-200 py-2 px-3 rounded-xl hover:bg-codentt-light font-medium"
              >
                Features
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFeaturesOpen && (
                <div className="pl-4 space-y-1 animate-fade-in">
                  {featurePages.map((page) => (
                    <Link
                      key={page.to}
                      to={page.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 px-3 text-codentt-blue hover:text-codentt-dark transition-colors rounded-lg hover:bg-codentt-light"
                    >
                      {page.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              link.isLink ? (
                <Link
                  key={link.to}
                  to={link.to!}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 py-2 px-3 rounded-xl hover:bg-codentt-light font-medium"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 py-2 px-3 rounded-xl hover:bg-codentt-light font-medium"
                >
                  {link.label}
                </a>
              )
            ))}
            
            {authenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 py-2 px-3 rounded-xl hover:bg-codentt-light font-medium"
                >
                  Profile
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full mt-2 rounded-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-codentt-blue hover:text-codentt-dark transition-colors duration-200 py-2 px-3 rounded-xl hover:bg-codentt-light font-medium"
                >
                  Login
                </Link>
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onCtaClick();
                  }}
                  className="w-full mt-2 rounded-full gap-2 bg-codentt-blue hover:bg-codentt-dark"
                >
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
