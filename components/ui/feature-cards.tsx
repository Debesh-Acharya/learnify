// components/feature-cards.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Bookmark } from "lucide-react"

export function FeatureCards() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tighter">Why Learnify?</h2>
        <p className="text-muted-foreground mt-2">
          Discover the benefits of using our platform for your learning journey
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <Search className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Search Everywhere</CardTitle>
            <CardDescription>
              Find resources from YouTube, Udemy, Coursera, and more with a single search.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our platform aggregates content from multiple sources, saving you time and effort.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Filter className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Perfect Matches</CardTitle>
            <CardDescription>
              Filter results by format, price, duration, and difficulty to find exactly what you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced filtering helps you discover the most relevant learning resources for your needs.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <Bookmark className="h-6 w-6 mb-2 text-primary" />
            <CardTitle>Track Progress</CardTitle>
            <CardDescription>
              Save resources, build learning paths, and track your progress over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Organize your learning journey and never lose track of valuable resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
