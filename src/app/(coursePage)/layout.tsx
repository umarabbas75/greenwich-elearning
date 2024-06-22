interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function CourseLayout({ children }: DashboardLayoutProps) {
  return <div className="h-screen bg-[#F2F3F5] dark:bg-[#0d1117]">{children}</div>;
}
