import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <div className="bg-[#f8f9ff] h-full w-full">{children}</div>;
}
