import {
  HardHat,
  HeartPulse,
  Stethoscope,
  UserRoundCheck,
  Users,
  UserX,
} from "lucide-react";
import Layout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import type { CardItem } from "../../types/card";

const Dashboard = () => {
  const cardItem: CardItem[] = [
    {
      id: 1,
      title: "Total Karyawan",
      amount: 100,
      icon: Users,
    },
    {
      id: 2,
      title: "Dokter",
      amount: 20,
      icon: Stethoscope,
    },
    {
      id: 3,
      title: "Perawat",
      amount: 10,
      icon: HeartPulse,
    },
    {
      id: 4,
      title: "Staff Non-Medis",
      amount: 12,
      icon: HardHat,
    },
    {
      id: 5,
      title: "Sedang Bertugas",
      amount: 48,
      icon: UserRoundCheck,
    },
    {
      id: 6,
      title: "Absen Hari Ini",
      amount: 48,
      icon: UserX,
    },
  ];
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:auto-cols-max lg:grid-cols-3 gap-4 w-full">
        {cardItem.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="flex items-center justify-start gap-4 min-w-60 border-none py-6 px-0 pl-10"
            >
              <CardHeader className="border-none m-0 p-0">
                <div className="p-2 flex items-center justify-center w-12 h-12 rounded bg-primary/10">
                  <Icon className="text-blue-dark" />
                </div>
              </CardHeader>
              <CardContent className="border-none m-0 p-0">
                <p className="text-blue-dark/60 text-sm">{item.title}</p>
                <p className="text-2xl font-bold text-blue-dark">
                  {item.amount}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

export default Dashboard;
