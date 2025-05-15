// app/page.tsx
import { Navbar } from "@/components/ui/navbar"
import { HeroSection } from "@/components/ui/hero-section"
import { FeatureCards } from "@/components/ui/feature-cards"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
        
        {/* Popular Topics Section */}
        <section className="container px-4 md:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">Popular Topics</h2>
            <p className="text-muted-foreground mt-2">
              Explore the most searched topics on Learnify
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {["Programming", "Design", "Business", "Marketing", "Photography", "Music", "Cooking", "Data Science"].map((topic) => (
              <Link
                key={topic}
                href={`/search?q=${topic}`}
                className="group relative overflow-hidden rounded-lg bg-muted px-6 py-8 text-center hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{topic}</h3>
              </Link>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary/5 py-16">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Ready to start learning?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Create an account to save your favorite resources and track your learning progress.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Sign Up for Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Explore Resources</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}