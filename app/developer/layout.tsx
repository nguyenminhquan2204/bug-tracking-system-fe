import SidebarDev from "@/features/components/SiderbarDev";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarDev />
      <div className="flex-1 overflow-y-auto p-4">
        <Toaster richColors position="top-right" />
        {children}
      </div>
    </div>
  );
}
