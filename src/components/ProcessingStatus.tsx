import { useState, useEffect } from "react";
import { Play, Pause, RotateCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  onStartProcessing: () => void;
  onStopProcessing: () => void;
  canProcess: boolean;
  status: "idle" | "processing" | "completed" | "error";
  error?: string;
}

export const ProcessingStatus = ({
  isProcessing,
  progress,
  onStartProcessing,
  onStopProcessing,
  canProcess,
  status,
  error
}: ProcessingStatusProps) => {
  const [estimatedTime, setEstimatedTime] = useState<string>("");

  useEffect(() => {
    if (isProcessing && progress > 0) {
      const elapsed = Date.now() - (Date.now() - progress * 1000);
      const remaining = ((100 - progress) / progress) * elapsed;
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setEstimatedTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
  }, [progress, isProcessing]);

  const getStatusColor = () => {
    switch (status) {
      case "processing":
        return "text-primary";
      case "completed":
        return "text-green-500";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <RotateCw className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "Ready to process";
      case "processing":
        return "Processing video...";
      case "completed":
        return "Processing completed!";
      case "error":
        return error || "Processing failed";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Processing</h3>
          <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            {estimatedTime && (
              <p className="text-xs text-muted-foreground text-center">
                Estimated time remaining: {estimatedTime}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center">
          {!isProcessing ? (
            <Button
              onClick={onStartProcessing}
              disabled={!canProcess}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8"
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Processing
            </Button>
          ) : (
            <Button
              onClick={onStopProcessing}
              variant="destructive"
              size="lg"
              className="px-8"
            >
              <Pause className="w-5 h-5 mr-2" />
              Stop Processing
            </Button>
          )}
        </div>

        {!canProcess && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Please upload a video or start live capture, and select target objects to begin processing.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};