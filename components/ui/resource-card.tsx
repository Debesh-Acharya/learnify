import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    platform: string;
    type: string;
    isPaid?: boolean; // Make this optional
    price?: number;
    duration?: string;
    thumbnailUrl: string;
    url: string;
    ratings: {
      average: number;
      count: number;
    };
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'reddit':
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          <img 
            src={resource.thumbnailUrl} 
            alt={resource.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={cn("font-normal", getPlatformColor(resource.platform))}>
                  {resource.platform}
                </Badge>
                <Badge variant="outline">{resource.type}</Badge>
                {/* Remove the isPaid badge */}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm">{resource.ratings.average} ({resource.ratings.count})</span>
            </div>
          </div>
          {resource.duration && (
            <p className="text-sm text-muted-foreground mb-4">Duration: {resource.duration}</p>
          )}
          <CardFooter className="px-0 pt-2 pb-0 flex justify-between">
            <Button variant="outline" size="sm">
              <Bookmark className="mr-1 h-4 w-4" /> Save
            </Button>
            <Button size="sm" asChild>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">View Resource</a>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  )
}
