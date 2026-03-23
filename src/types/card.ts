export type CardItem = {
  id: number;
  title: string;
  amount: number;
  icon: React.ComponentType<{ className?: string }>;
};
