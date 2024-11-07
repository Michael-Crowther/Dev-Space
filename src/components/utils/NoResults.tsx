import { useEffect, useState } from "react";

export function NoResults({
  title,
  delayRender = false,
}: {
  title: string;
  delayRender?: boolean;
}) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (delayRender) {
      const timer = setTimeout(() => {
        setShowMessage(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setShowMessage(true);
    }
  }, [delayRender]);

  if (!showMessage) {
    return null;
  }

  return (
    <div className="flex h-full flex-1 items-center justify-center p-3">
      <h6 className="text-xl text-muted-foreground">{title}</h6>
    </div>
  );
}
