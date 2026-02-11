'use client';

import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Logo = () => (
    <Link href="/" className="flex items-center gap-1">
        <Avatar className="h-9 w-9">
            <AvatarImage src="/kovazzi.jpg" alt="Foto de perfil de @kovazzi" />
            <AvatarFallback>K</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-lg text-foreground">@kovazzi</span>
    </Link>
);


function UserNav() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }
  
  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function Header() {
  const [activeUsers, setActiveUsers] = useState(137);

  useEffect(() => {
    // Start with an initial random number between 100 and 200
    setActiveUsers(Math.floor(Math.random() * (200 - 100 + 1)) + 100);

    const interval = setInterval(() => {
      setActiveUsers(prevUsers => {
        // Fluctuate by -5 to 5
        const change = Math.floor(Math.random() * 11) - 5;
        let newCount = prevUsers + change;
        // Keep it within a realistic range
        if (newCount < 100) newCount = 100;
        if (newCount > 200) newCount = 200;
        return newCount;
      });
    }, 3500); // Update every 3.5 seconds

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run only once

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <span className="text-sm text-muted-foreground">{activeUsers} usuários ativos</span>
            </div>
            <UserNav />
        </div>
      </div>
    </header>
  );
}
