import { useState, useRef, useCallback } from "react";
import { Camera, CameraOff, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface LiveVideoCaptureProps {
  onStreamStart: (stream: MediaStream) => void;
  onStreamStop: () => void;
  isStreaming: boolean;
}

export const LiveVideoCapture = ({ onStreamStart, onStreamStop, isStreaming }: LiveVideoCaptureProps) => {
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCapture = useCallback(async () => {
    try {
      setIsInitializing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      onStreamStart(stream);
      toast.success("Camera started successfully!");
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    } finally {
      setIsInitializing(false);
    }
  }, [onStreamStart]);

  const stopCapture = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    onStreamStop();
    toast.success("Camera stopped");
  }, [onStreamStop]);

  return (
    <Card className="p-6 bg-gradient-secondary border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Live Camera</h3>
          <div className="flex items-center space-x-2">
            {isStreaming && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                <span className="text-sm text-destructive font-medium">LIVE</span>
              </div>
            )}
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
          {!isStreaming ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <Camera className="h-16 w-16 text-muted-foreground" />
              <p className="text-muted-foreground text-center">
                Click start to begin live video capture
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex justify-center space-x-3">
          {!isStreaming ? (
            <Button
              onClick={startCapture}
              disabled={isInitializing}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isInitializing ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Camera
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={stopCapture}
              variant="destructive"
              className="transition-all duration-300"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};