import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ 
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "California Wildfire Tracker - Chinchilla AI Academy",
  description: "Real-time California wildfire tracking system built with AWS Amplify for Chinchilla AI Academy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
