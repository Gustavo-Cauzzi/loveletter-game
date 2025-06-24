import type { Card, CardType } from "../../../types/Game.types";

interface CardProps {
  card: Card;
}

const cardConfigs: Record<
  CardType,
  {
    color: string;
    name: string;
    value: number;
  }
> = {
  princess: {
    color: "bg-background-400",
    name: "Princess",
    value: 9,
  },
  countess: {
    color: "bg-background-400",
    name: "Countess",
    value: 8,
  },
  king: {
    color: "bg-background-400",
    name: "King",
    value: 7,
  },
  chancellor: {
    color: "bg-background-400",
    name: "Chancellor",
    value: 6,
  },
  prince: {
    color: "bg-background-400",
    name: "Prince",
    value: 5,
  },
  handmaid: {
    color: "bg-background-400",
    name: "Handmaid",
    value: 4,
  },
  baron: {
    color: "bg-background-400",
    name: "Baron",
    value: 3,
  },
  priest: {
    color: "bg-background-400",
    name: "Priest",
    value: 2,
  },
  guard: {
    color: "bg-background-400",
    name: "Guard",
    value: 1,
  },
  spy: {
    color: "bg-background-400",
    name: "Spy",
    value: 0,
  },
};

export function Card({ card }: CardProps) {
  const cardConfig = cardConfigs[card.type];

  return (
    <div className={`aspect-[2/3] ${cardConfig.color} rounded-lg shadow-md`}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold">{cardConfig.name}</div>
      </div>
    </div>
  );
}
