import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Shirt, Palette, User } from "lucide-react";

interface AvatarFeature {
  id: string;
  name: string;
  preview: string;
}

interface AvatarCustomizationProps {
  onFeatureSelect?: (category: string, featureId: string) => void;
  selectedFeatures?: Record<string, string>;
  availableFeatures?: Record<string, AvatarFeature[]>;
}

const defaultFeatures: Record<string, AvatarFeature[]> = {
  outfits: [
    {
      id: "casual",
      name: "Casual",
      preview: "https://dummyimage.com/60/4F46E5/ffffff&text=C",
    },
    {
      id: "business",
      name: "Business",
      preview: "https://dummyimage.com/60/4F46E5/ffffff&text=B",
    },
    {
      id: "sporty",
      name: "Sporty",
      preview: "https://dummyimage.com/60/4F46E5/ffffff&text=S",
    },
  ],
  colors: [
    {
      id: "blue",
      name: "Blue",
      preview: "https://dummyimage.com/60/3B82F6/ffffff&text=B",
    },
    {
      id: "green",
      name: "Green",
      preview: "https://dummyimage.com/60/10B981/ffffff&text=G",
    },
    {
      id: "purple",
      name: "Purple",
      preview: "https://dummyimage.com/60/8B5CF6/ffffff&text=P",
    },
  ],
  features: [
    {
      id: "hair1",
      name: "Hair Style 1",
      preview: "https://dummyimage.com/60/6B7280/ffffff&text=H1",
    },
    {
      id: "hair2",
      name: "Hair Style 2",
      preview: "https://dummyimage.com/60/6B7280/ffffff&text=H2",
    },
    {
      id: "face1",
      name: "Face Style 1",
      preview: "https://dummyimage.com/60/6B7280/ffffff&text=F1",
    },
  ],
};

const AvatarCustomization: React.FC<AvatarCustomizationProps> = ({
  onFeatureSelect = () => {},
  selectedFeatures = {},
  availableFeatures = defaultFeatures,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg space-y-6">
      <h2 className="text-lg font-semibold mb-4">Customize Your Avatar</h2>

      <Tabs defaultValue="outfits" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger
            value="outfits"
            className="flex flex-col items-center gap-1 p-3"
          >
            <Shirt className="h-5 w-5" />
            <span className="text-xs">Outfits</span>
          </TabsTrigger>
          <TabsTrigger
            value="colors"
            className="flex flex-col items-center gap-1 p-3"
          >
            <Palette className="h-5 w-5" />
            <span className="text-xs">Colors</span>
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="flex flex-col items-center gap-1 p-3"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Features</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(availableFeatures).map(([category, features]) => (
          <TabsContent
            key={category}
            value={category}
            className="mt-0 space-y-4"
          >
            <div className="space-y-4">
              <Label className="text-sm font-medium block mb-3">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Label>
              <RadioGroup
                defaultValue={selectedFeatures[category]}
                onValueChange={(value) => onFeatureSelect(category, value)}
                className="grid grid-cols-3 gap-4"
              >
                {features.map((feature) => (
                  <div key={feature.id} className="text-center">
                    <RadioGroupItem
                      value={feature.id}
                      id={feature.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={feature.id}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-muted hover:bg-accent peer-checked:border-primary peer-checked:bg-primary/5 cursor-pointer transition-all"
                    >
                      <img
                        src={feature.preview}
                        alt={feature.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="text-xs font-medium">
                        {feature.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="pt-4 border-t">
        <Button
          className="w-full"
          onClick={() => console.log("Save customization")}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AvatarCustomization;
