import SideBar from './_components/SideBar';
import Topbar from './_components/Topbar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <SideBar />

      <main className="relative h-full max-h-screen transition-all duration-200 ease-soft-in-out md:ml-80 rounded-xl">
        <Topbar />
        <div className="w-full p-6 mx-auto">{children}</div>
      </main>
    </>
  );
}
