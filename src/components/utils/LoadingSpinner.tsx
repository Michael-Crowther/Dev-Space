import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export function LoadingSpinner() {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!showSpinner) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <DotLoader
        className="size-96 flex items-center justify-center"
        color="#048AC4"
      />
    </div>
  );
}
