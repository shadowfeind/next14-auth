"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({ children, mode, asChild }: LoginButtonProps) => {
  const router = useRouter();
  const clickHandler = () => router.push("/auth/login");
  return (
    <span className="cursor-pointer" onClick={clickHandler}>
      {children}
    </span>
  );
};

export default LoginButton;
