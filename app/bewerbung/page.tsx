import type { Metadata } from "next";
import { BewerbungFunnel } from "@/components/BewerbungFunnel";

type BewerbungPageProps = {
  searchParams?: Promise<{
    status?: string;
    step?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bewerbung",
  description: "Bewerbung als Servicekraft beim Landgut Seebühne in Vestenbergsgreuth.",
  alternates: {
    canonical: "/bewerbung"
  },
  openGraph: {
    url: "/bewerbung"
  },
  robots: {
    index: false,
    follow: true
  }
};

export default async function BewerbungPage({ searchParams }: BewerbungPageProps) {
  const params = await searchParams;

  return <BewerbungFunnel status={params?.status} step={params?.step} />;
}
