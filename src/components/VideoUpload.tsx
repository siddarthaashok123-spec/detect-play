import { useState, useRef, useCallback } from "react";
import { Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
  selectedVideo: File | null;
  onClearVideo: () => void;
}

export const VideoUpload = ({ onVideoSelect, selectedVideo, onClearVideo }: VideoUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      onVideoSelect(videoFile);
      toast.success("Video uploaded successfully!");
    } else {
      toast.error("Please upload a valid video file");
    }
  }, [onVideoSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      onVideoSelect(file);
      toast.success("Video uploaded successfully!");
    } else {
      toast.error("Please select a valid video file");
    }
  }, [onVideoSelect]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 bg-gradient-secondary border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Upload Video</h3>
          {selectedVideo && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearVideo}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {selectedVideo ? (
          <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
            <Video className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedVideo.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragOver
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
          >
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                Drop your video file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports MP4, AVI, MOV, WebM
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </Card>
  );
};