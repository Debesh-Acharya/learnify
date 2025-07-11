import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyYouTube } from "@/components/ui/lazy-youtube";
import Image from "next/image";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    platform: string;
    type: string;
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

  const isYouTubeVideo = resource.platform === "YouTube" && resource.type === "video";
  const youtubeVideoId = isYouTubeVideo ? resource.id : null;

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 h-48 md:h-auto relative">
          {isYouTubeVideo ? (
            <LazyYouTube videoId={youtubeVideoId!} title={resource.title} />
          ) : (
            <Image 
              src={resource.thumbnailUrl} 
              alt={resource.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
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
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">&#9733;</span>
              <span className="text-sm">{resource.ratings.average} ({resource.ratings.count})</span>
            </div>
          </div>
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
  );
}
