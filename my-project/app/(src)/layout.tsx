import Navbar from "@/components/Navbar";
import React from "react";
import { Toaster } from "sonner";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <Navbar />
      <div className="pt-[4rem] h-[calc(100vh-4rem)] w-full">{children}</div>
      <Toaster richColors />
    </main>
  );
};

export default layout;
