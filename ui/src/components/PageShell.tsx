import { ReactNode } from "react";
import { HeaderBar } from "./HeaderBar";

export const PageShell = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div>
        <HeaderBar />
      </div>
      <div>{children}</div>
    </>
  );
};
