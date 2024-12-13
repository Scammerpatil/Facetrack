import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./../(Home)/globals.css";
import { Toaster } from "react-hot-toast";
import SideNav from "./SideNav";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FaceTrack | Redefining Attendance, One Face at a Time",
  description:
    "This platform empowers users to identify malicious websites with ease. Simply enter a URL, and our system, powered by cutting-edge machine learning models like MLP and ResMLP, generates a detailed security report. Stay one step ahead of cyber threats with our accurate and user-friendly tool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <body className={`antialiased ${roboto.className}`}>
        <Toaster />
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
}
