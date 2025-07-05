import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const FeatureUnderDevelopmentDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-inter text-center text-lg">
            Feature still under development
          </DialogTitle>
          <DialogDescription className="font-inter text-center text-base">
            This feature is still in its &quot;Training Arc&quot;! 🏋️‍♂️ Please
            bear with this lone developer as he grinds his coding skills!
          </DialogDescription>

          <div className="relative w-full h-40 mt-4">
            <Image
              src="/business-man-apologize-dogeza.png"
              alt="Under development"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureUnderDevelopmentDialog;
