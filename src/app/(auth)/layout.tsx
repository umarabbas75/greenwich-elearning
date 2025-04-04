interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className=" relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2  ">
      {children}
    </div>
  );
}
