"use client";

// Home.tsx
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "~/components/Button";

export default function Home() {

  return (
    <div className="h-full min-h-screen w-full bg-[#000] pt-6 text-white flex justify-center items-center flex-col gap-4">
      <h1 className="text-[2rem]">BlackJack</h1>
      <button
        className=""
      >
        <Link href="/game" className="px-4 py-2 border-[2px] border-white bg-[red] uppercase rounded-[10px]">Play</Link>
      </button>
    </div>
  );
}
