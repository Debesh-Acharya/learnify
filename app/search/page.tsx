// app/search/page.tsx
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import { ResourceCard } from "@/components/ui/resource-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'


export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || "";
  
  // Mock data - this would be replaced with actual API calls
  const mockResults = [
    {
      id: "1",
      title: "Introduction to JavaScript Programming",
      platform: "YouTube",
      type: "video",
      isPaid: false,
      duration: "1h 15m",
      thumbnailUrl: "https://i.ytimg.com/vi/W6NZfCO5SIk/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      ratings: { average: 4.7, count: 1253 }
    },
    {
      id: "2",
      title: "Complete Web Development Bootcamp",
      platform: "Udemy",
      type: "course",
      isPaid: true,
      price: 89.99,
      duration: "63h total",
      thumbnailUrl: "https://img-c.udemycdn.com/course/240x135/1565838_e54e_16.jpg",
      url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
      ratings: { average: 4.8, count: 8764 }
    },
    {
      id: "3",
      title: "Modern JavaScript: From Fundamentals to Functional JS",
      platform: "Coursera",
      type: "course",
      isPaid: true,
      price: 49,
      duration: "4 weeks",
      thumbnailUrl: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera-course-photos/4a/83d8b01bdd4b2782a7cb222d27d085/Logo_JavaScript_Basics_Final.png?auto=format%2Ccompress&dpr=1&w=330&h=330&fit=fill&q=25",
      url: "https://www.coursera.org/learn/javascript-basics",
      ratings: { average: 4.6, count: 3421 }
    },
    {
      id: "4",
      title: "JavaScript Crash Course For Beginners",
      platform: "YouTube",
      type: "video",
      isPaid: false,
      duration: "1h 40m",
      thumbnailUrl: "https://i.ytimg.com/vi/hdI2bqOjy3c/hqdefault.jpg",
      url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
      ratings: { average: 4.9, count: 5678 }
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-6 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Results for "{query}"</h1>
          <p className="text-muted-foreground">Found {mockResults.length} resources</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Resource Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="video" />
                  <label htmlFor="video" className="text-sm">Videos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="course" />
                  <label htmlFor="course" className="text-sm">Courses</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="article" />
                  <label htmlFor="article" className="text-sm">Articles</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Platforms</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="youtube" />
                  <label htmlFor="youtube" className="text-sm">YouTube</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="udemy" />
                  <label htmlFor="udemy" className="text-sm">Udemy</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="coursera" />
                  <label htmlFor="coursera" className="text-sm">Coursera</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Price</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="free" />
                  <label htmlFor="free" className="text-sm">Free</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="paid" />
                  <label htmlFor="paid" className="text-sm">Paid</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Duration</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="short" />
                  <label htmlFor="short" className="text-sm">Short (&lt; 1h)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="medium" />
                  <label htmlFor="medium" className="text-sm">Medium (1-5h)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="long" />
                  <label htmlFor="long" className="text-sm">Long (&gt; 5h)</label>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">Clear Filters</Button>
          </div>
          
          {/* Results */}
          <div className="md:col-span-3">
            <Tabs defaultValue="relevance" className="mb-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="relevance">Relevance</TabsTrigger>
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="rating">Highest Rated</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="relevance" className="mt-4 space-y-4">
                {mockResults.map((result) => (
                  <ResourceCard key={result.id} resource={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="newest" className="mt-4 space-y-4">
                {/* Would be sorted by date */}
                {mockResults.map((result) => (
                  <ResourceCard key={result.id} resource={result} />
                ))}
              </TabsContent>
              
              <TabsContent value="rating" className="mt-4 space-y-4">
                {/* Would be sorted by rating */}
                {mockResults.map((result) => (
                  <ResourceCard key={result.id} resource={result} />
                ))}
              </TabsContent>
            </Tabs>
            
            {mockResults.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
