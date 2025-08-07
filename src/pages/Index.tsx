import { useState } from "react";
import { VideoUpload } from "@/components/VideoUpload";
import { LiveVideoCapture } from "@/components/LiveVideoCapture";
import { TargetSelector } from "@/components/TargetSelector";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Eye } from "lucide-react";

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [targets, setTargets] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "error">("idle");
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string>("");

  const handleVideoSelect = (file: File) => {
    setSelectedVideo(file);
    setProcessedVideoUrl(""); // Clear previous results
  };

  const handleClearVideo = () => {
    setSelectedVideo(null);
    setProcessedVideoUrl("");
  };

  const handleStreamStart = (stream: MediaStream) => {
    setCurrentStream(stream);
    setIsStreaming(true);
    setProcessedVideoUrl(""); // Clear previous results
  };

  const handleStreamStop = () => {
    setCurrentStream(null);
    setIsStreaming(false);
  };

  const canProcess = (selectedVideo || isStreaming) && targets.length > 0;

  const handleStartProcessing = async () => {
    if (!canProcess) return;
    
    setIsProcessing(true);
    setStatus("processing");
    setProgress(0);
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStatus("completed");
          // In a real implementation, this would be the URL from your backend
          setProcessedVideoUrl("https://example.com/processed-video.mp4");
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const handleStopProcessing = () => {
    setIsProcessing(false);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                YOLOv8 Vision
              </h1>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Object Detection & Segmentation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Input Controls */}
          <div className="space-y-6">
            {/* Video Input */}
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="upload">Upload Video</TabsTrigger>
                <TabsTrigger value="live">Live Camera</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-4">
                <VideoUpload
                  onVideoSelect={handleVideoSelect}
                  selectedVideo={selectedVideo}
                  onClearVideo={handleClearVideo}
                />
              </TabsContent>
              <TabsContent value="live" className="mt-4">
                <LiveVideoCapture
                  onStreamStart={handleStreamStart}
                  onStreamStop={handleStreamStop}
                  isStreaming={isStreaming}
                />
              </TabsContent>
            </Tabs>

            {/* Target Selection */}
            <TargetSelector
              targets={targets}
              onTargetsChange={setTargets}
            />

            {/* Processing Controls */}
            <ProcessingStatus
              isProcessing={isProcessing}
              progress={progress}
              onStartProcessing={handleStartProcessing}
              onStopProcessing={handleStopProcessing}
              canProcess={canProcess}
              status={status}
            />
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Original Video Preview */}
            {selectedVideo && (
              <VideoPlayer
                videoUrl={URL.createObjectURL(selectedVideo)}
                title="Original Video"
              />
            )}

            {/* Processed Video Results */}
            <VideoPlayer
              videoUrl={processedVideoUrl}
              title="Processed Results"
              isProcessedVideo={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
