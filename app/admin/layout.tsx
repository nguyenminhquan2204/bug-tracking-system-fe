import SidebarAdmin from "../../features/components/SidebarAdmin";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="flex flex-row">
      <SidebarAdmin />
      <div className="flex-1 p-4">
         {children}
      </div>
   </div>
  );
}
