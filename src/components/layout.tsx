import { type PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen">
      <div className="h-full h-min-screen w-full w-max-screen
      border-slate-400 overflow-x-hidden no-scrollbar">
        {props.children}
      </div>
    </main>
  );
};
