import { Toaster } from "sonner";
import SidebarAdmin from "../../features/components/SidebarAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarAdmin />

      <div className="flex-1 overflow-y-auto p-4">
        <Toaster richColors position="top-right" />
        {children}
      </div>
    </div>
  );
}
