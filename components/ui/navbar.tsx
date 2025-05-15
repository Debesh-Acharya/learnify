// components/navbar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Learnify</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/explore"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/explore" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Explore
            </Link>
            <Link
              href="/topics"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/topics")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Topics
            </Link>
            <Link
              href="/collections"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith("/collections")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Collections
            </Link>
          </nav>
        </div>
        
        <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
          <span className="font-bold text-xl">Learnify</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <form onSubmit={handleSearch} className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for anything..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
