import SidebarTester from "@/features/components/SidebarTester";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarTester />
      <div className="flex-1 overflow-y-auto p-4">
        <Toaster richColors position="top-right" />
        {children}
      </div>
    </div>
  );
}
