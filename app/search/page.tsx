// app/search/page.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ResourceCard } from "@/components/ui/resource-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  thumbnailUrl: string;
  url: string;
  ratings: {
    average: number;
    count: number;
  };
  dateIndexed: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initialTypes = searchParams.getAll("type");
  const initialPlatforms = searchParams.getAll("platform");
  const initialSortBy = (searchParams.get("sortBy") as "relevance" | "newest" | "rating") || "relevance";

  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialPlatforms);
  const [sortBy, setSortBy] = useState<"relevance" | "newest" | "rating">(initialSortBy);

  // Fetch all resources without filtering at the API level
  useEffect(() => {
    async function fetchResults() {
      if (!query) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        setResources(data.results || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch resources");
      } finally {
        setLoading(false);
      }
    }
    
    fetchResults();
  }, [query]);

  // Filter resources client-side
  const filteredResources = resources.filter(resource => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(resource.type)) {
      return false;
    }
    
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(resource.platform)) {
      return false;
    }
    
    return true;
  });

  // Sort resources client-side
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.dateIndexed).getTime() - new Date(a.dateIndexed).getTime();
    } else if (sortBy === "rating") {
      return b.ratings.average - a.ratings.average;
    }
    return 0;
  });

  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete("type");
    selectedTypes.forEach(type => params.append("type", type));
    
    params.delete("platform");
    selectedPlatforms.forEach(platform => params.append("platform", platform));
    
    params.set("sortBy", sortBy);

    const newUrl = `/search?${params.toString()}`;
    if (window.location.search !== `?${params.toString()}`) {
      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    }
  }, [selectedTypes, selectedPlatforms, sortBy, router, searchParams]);

  const handleTypeChange = (type: string, checked: boolean) => {
    setSelectedTypes(prev => 
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setSelectedPlatforms(prev => 
      checked ? [...prev, platform] : prev.filter(p => p !== platform)
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedPlatforms([]);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 md:px-6 py-6 flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Results for "{query}"</h1>
          <p className="text-muted-foreground">
            {loading ? "Searching..." : `Found ${sortedResources.length} resources`}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Resource Type</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="video" 
                    checked={selectedTypes.includes("video")}
                    onCheckedChange={(checked) => 
                      handleTypeChange("video", checked === true)
                    }
                  />
                  <label htmlFor="video" className="text-sm">Videos</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="article" 
                    checked={selectedTypes.includes("article")}
                    onCheckedChange={(checked) => 
                      handleTypeChange("article", checked === true)
                    }
                  />
                  <label htmlFor="article" className="text-sm">Articles</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Platforms</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="youtube" 
                    checked={selectedPlatforms.includes("YouTube")}
                    onCheckedChange={(checked) => 
                      handlePlatformChange("YouTube", checked === true)
                    }
                  />
                  <label htmlFor="youtube" className="text-sm">YouTube</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reddit" 
                    checked={selectedPlatforms.includes("Reddit")}
                    onCheckedChange={(checked) => 
                      handlePlatformChange("Reddit", checked === true)
                    }
                  />
                  <label htmlFor="reddit" className="text-sm">Reddit</label>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={clearFilters}
              disabled={isPending || loading}
            >
              Clear Filters
            </Button>
          </div>
          
          <div className="md:col-span-3">
            <Tabs
              defaultValue="relevance"
              value={sortBy}
              onValueChange={(value) => setSortBy(value as "relevance" | "newest" | "rating")}
              className="mb-6"
            >
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="relevance">Relevance</TabsTrigger>
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="rating">Highest Rated</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>

            {(loading || isPending) ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Searching for resources...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Error</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            ) : sortedResources.length > 0 ? (
              <div className="space-y-4">
                {sortedResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
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
  );
}
