"use client";

import dynamic from "next/dynamic";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function ConfettiRain() {
  const { width } = useWindowSize();

  return (
    <Confetti 
      className="w-full"
      width={width}
      height={document.body.scrollHeight}
      numberOfPieces={50}
      tweenDuration={75000}
      opacity={0.4}
    />
  )
}

export default dynamic(() => Promise.resolve(ConfettiRain), { ssr: false });