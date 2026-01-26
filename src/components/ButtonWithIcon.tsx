import React from "react";

export default function ButtonWithIcon({ children, icon, ...props }: React.PropsWithChildren<React.ComponentProps<'button'> & { icon: React.ReactElement }>) {
  return <div className="flex flex-row">
    <button {...props}>{children}</button>
    <button {...props}>{icon}</button>
  </div>
}
