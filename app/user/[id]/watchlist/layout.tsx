import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Watchlist - Movie Base",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
