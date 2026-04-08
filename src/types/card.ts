export type CardItem = {
  id: number;
  title: string;
  amount: number | string | React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
};
