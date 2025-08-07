import { useState } from "react";
import { Target, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TargetSelectorProps {
  targets: string[];
  onTargetsChange: (targets: string[]) => void;
}

const commonTargets = [
  "person", "car", "truck", "bus", "bicycle", "motorcycle",
  "dog", "cat", "bird", "horse", "sheep", "cow",
  "chair", "sofa", "table", "bed", "laptop", "phone",
  "bottle", "cup", "fork", "knife", "spoon", "bowl"
];

export const TargetSelector = ({ targets, onTargetsChange }: TargetSelectorProps) => {
  const [newTarget, setNewTarget] = useState("");

  const addTarget = (target: string) => {
    const trimmedTarget = target.trim().toLowerCase();
    if (trimmedTarget && !targets.includes(trimmedTarget)) {
      onTargetsChange([...targets, trimmedTarget]);
      setNewTarget("");
    }
  };

  const removeTarget = (targetToRemove: string) => {
    onTargetsChange(targets.filter(target => target !== targetToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTarget(newTarget);
    }
  };

  return (
    <Card className="p-6 bg-gradient-secondary border shadow-card">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Target Objects</h3>
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Enter target object (e.g., person, car)"
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={() => addTarget(newTarget)}
            disabled={!newTarget.trim()}
            size="sm"
            className="px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {targets.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Selected targets:</p>
            <div className="flex flex-wrap gap-2">
              {targets.map((target) => (
                <Badge
                  key={target}
                  variant="secondary"
                  className="pr-1 bg-primary/10 text-primary border-primary/20"
                >
                  {target}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTarget(target)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Common targets:</p>
          <div className="flex flex-wrap gap-2">
            {commonTargets.map((target) => (
              <Button
                key={target}
                variant="outline"
                size="sm"
                className={`text-xs ${
                  targets.includes(target)
                    ? "bg-primary/20 border-primary text-primary"
                    : "hover:bg-muted hover:border-primary/50"
                }`}
                onClick={() => {
                  if (targets.includes(target)) {
                    removeTarget(target);
                  } else {
                    addTarget(target);
                  }
                }}
              >
                {target}
                {targets.includes(target) && <X className="ml-1 h-3 w-3" />}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};