import Footer from './_components/Footer';
import PublicNavBar from './home/components/PublicNavBar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}
export default async function PublicLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="h-screen bg-[#F2F3F5] dark:bg-[#0d1117]">
      {' '}
      <PublicNavBar />
      {children}
      <Footer />
    </div>
  );
}
