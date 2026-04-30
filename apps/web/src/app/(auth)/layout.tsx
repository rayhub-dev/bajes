import { ToastContainer } from "@/components/ui/Toast";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-screen flex-col bg-bajes-bg">
      <ToastContainer />
      {children}
    </div>
  );
}
