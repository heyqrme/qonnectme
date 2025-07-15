
'use client';

import Link from "next/link";
import { QrCode, User, ShoppingCart, Store, Menu, LogOut, Edit, Rss, Bell, Home, Users, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/activity", label: "Activity", icon: Rss },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/store", label: "Shop", icon: Store },
];

export function AppHeader() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const NavLink = ({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) => (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        pathname === href ? "text-foreground font-semibold" : "text-muted-foreground",
        className
      )}
      prefetch={false}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <Link href="/profile" className="flex items-center gap-2 font-semibold" prefetch={false}>
        <QrCode className="h-6 w-6 text-primary" />
        <span className="font-headline text-lg">Qonnectme</span>
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
        {navLinks.map(link => (
          <NavLink key={link.href} href={link.href}>{link.label}</NavLink>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/profile" className="flex items-center gap-2 text-lg font-semibold mb-4" prefetch={false}>
              <QrCode className="h-6 w-6 text-primary" />
              <span className="font-headline">Qonnectme</span>
            </Link>
            {navLinks.map(link => (
               <NavLink key={link.href} href={link.href} className="flex items-center gap-4">
                <link.icon className="h-5 w-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial" />
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Cart</span>
            </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@janedoe" data-ai-hint="female portrait" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/profile/edit" className="flex items-center"><Edit className="mr-2 h-4 w-4" />Edit Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/admin" className="flex items-center"><Shield className="mr-2 h-4 w-4" />Admin</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="flex items-center"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
