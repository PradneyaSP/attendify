"use client";

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from '@/lib/firebase/auth';

interface variantOptions {
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
}

interface navbarOptionType extends variantOptions {
  label: string;
  href: string;
  authRequired?: boolean;
  isLogout?: boolean;
}

const navbarOptions = [
  { label: "Login", href: "/login", variant: "link", authRequired: false },
  { label: "Sign Up", href: "/sign-up", variant: "default", authRequired: false },
  { label: "Dashboard", href: "/dashboard", variant: "link", authRequired: true },
  { label: "Logout", href: "/", variant: "default", authRequired: true, isLogout: true },
] as navbarOptionType[];

interface User {
	email: string | null;
	uid: string;
	displayName: string | null;
	photoURL: string | null;
}


const Navbar: FC = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const router = useRouter();

  
function useUserSession(initialUser : User | null) {
	// The initialUser comes from the server via a server component
	const [user, setUser] = useState(initialUser);
	const router = useRouter();

	useEffect(() => {
			const unsubscribe = onAuthStateChanged((authUser) => {
					setUser(authUser)
			})

			return () => unsubscribe()
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
			onAuthStateChanged((authUser) => {
					if (user === undefined) return

					// refresh when user changed to ease testing
					if (user?.email !== authUser?.email) {
							router.refresh()
					}
			})
			// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return user;
}

  useEffect(() => {
    setIsSignedIn(useUserSession(null) !== null);
  }, []);

  const filteredOptions = navbarOptions.filter((option) => {
    if (option.authRequired && !isSignedIn) return false;
    if (!option.authRequired && isSignedIn) return false;
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut();
      setIsSignedIn(false);
      router.push('/');
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center py-4 px-20 bg-red-300">
        <Link href="/">
          <p className="font-bold text-3xl text-foreground">Attendify</p>
        </Link>

        <div className="hidden md:flex justify-around items-center gap-6">
          {filteredOptions.map((option) =>
            option.isLogout ? (
              <Button key={option.label} className="text-lg" onClick={handleLogout}>
                {option.label}
              </Button>
            ) : (
              <NavLink key={option.label} href={option.href} text={option.label} variant={option.variant!} />
            )
          )}
        </div>

        <MobileMenu isSignedIn={isSignedIn} handleLogout={handleLogout} options={filteredOptions} />
      </nav>

      <SVGWave />
    </>
  );
};

const NavLink: FC<{ href: string; text: string; variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined }> = ({ href, text, variant }) => (
  <Link href={href}>
    <Button className={`text-lg`} variant={variant!}>
      {text}
    </Button>
  </Link>
);

const MobileMenu: FC<{ isSignedIn: boolean; handleLogout: () => void; options: navbarOptionType[] }> = ({ handleLogout, options }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="flex flex-col md:hidden gap-1 focus:outline-none">
      <MenuIcon />
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-32 sm:w-40 flex flex-col justify-center items-center">
      <DropdownMenuLabel className="text-lg text-center">Menu</DropdownMenuLabel>
      <DropdownMenuSeparator />

      {options.map((option) =>
        option.isLogout ? (
          <DropdownMenuItem key={option.label}>
            <Button onClick={handleLogout}>{option.label}</Button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem key={option.label}>
            <NavLink href={option.href} text={option.label} variant={option.variant} />
          </DropdownMenuItem>
        )
      )}
    </DropdownMenuContent>
  </DropdownMenu>
);

const SVGWave = () => {
  const pathname = usePathname();
  const [isWave, setIsWave] = useState(true);

  useEffect(() => {
    setIsWave(!(pathname === "/dashboard" || pathname === "/attendance"));
  }, [pathname]);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full transition-all duration-500">
        {isWave ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#fca5a5" fillOpacity="1" d="M0,288L80,240C160,192,320,96,480,58.7C640,21,800,43,960,64C1120,85,1280,107,1360,117.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
        ) : (
          <div
            style={{
              width: "100%",
              height: "30px",
              backgroundColor: "#fca5a5",
              transition: "height 1s ease",
            }}
          />
        )}
      </div>
    </div>
  );
};

const MenuIcon = () => (
  <>
    <div className="w-8 h-1 rounded bg-foreground md:hidden"></div>
    <div className="w-8 h-1 rounded bg-foreground md:hidden"></div>
    <div className="w-8 h-1 rounded bg-foreground md:hidden"></div>
  </>
);

export default Navbar;