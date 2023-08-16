import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen">
      <div className="h-full w-full border-slate-400">
        {props.children}
      </div>
    </main>
  );
};
