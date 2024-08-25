import React from "react";
import Image from "next/image";

export default function Chip({
  value,
  background,
  setBet,
}: {
  value: string;
  background: string;
  setBet: () => void;
}) {
  return (
    <button
      className="relative flex w-12 items-center justify-center"
      onClick={setBet}
    >
      <Image
        src="/content/images/chips/chip.png"
        alt={value.toString()}
        className={`absolute z-[5] w-full rounded-full object-cover ${background}`}
        width={20}
        height={20}
      />
      <span className="z-[10] text-[.8rem] font-bold">{value}</span>
    </button>
  );
}
