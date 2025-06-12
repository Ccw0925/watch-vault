import { LucideIcon } from "lucide-react";
import React from "react";

type Props = {
  icon: LucideIcon;
  cardTitle: string;
  cardDescription: string;
};

const AnimeInfoCard = ({ icon: Icon, cardTitle, cardDescription }: Props) => {
  return (
    <div className="p-4 flex gap-3 items-center rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-md font-inter">
      <Icon className="text-blue-500" />
      <div>
        <p className="text-sm lg:text-base font-medium">{cardTitle}</p>
        <p className="text-xs lg:text-sm text-muted-foreground">
          {cardDescription}
        </p>
      </div>
    </div>
  );
};

export default AnimeInfoCard;
