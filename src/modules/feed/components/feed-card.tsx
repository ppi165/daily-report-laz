"use client";

import { useState, useRef } from "react";
import CardFrontFace from "./card-front-face";
import CardBackFace from "./card-back-face";
import { ParsedFeedReport } from "../use-cases/get-feed-reports.use-case";

interface FeedCardProps {
  report: ParsedFeedReport;
  currentUser?: {
    id: string;
    name: string;
    division: string;
  } | null;
}

export default function FeedCard({ report, currentUser }: FeedCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showBackLayout, setShowBackLayout] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flipToBack = () => {
    setIsFlipped(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowBackLayout(true);
    }, 250);
  };

  const flipToFront = () => {
    setIsFlipped(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowBackLayout(false);
    }, 250);
  };

  return (
    <div className="w-full [perspective:1200px]">
      <div
        className={`w-full relative transition-transform duration-500 ease-in-out [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"
        }`}
      >
        {/* Sisi Depan: Aktivitas & Sosial */}
        <div
          className={`w-full [backface-visibility:hidden] ${
            showBackLayout
              ? "absolute inset-0 h-full pointer-events-none"
              : "relative"
          }`}
        >
          <CardFrontFace
            report={report}
            currentUser={currentUser}
            onFlipToBack={flipToBack}
          />
        </div>

        {/* Sisi Belakang: Hasil / Output Pekerjaan */}
        <div
          className={`w-full [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            showBackLayout
              ? "relative"
              : "absolute inset-0 h-full pointer-events-none"
          }`}
        >
          <CardBackFace
            report={report}
            onFlipToFront={flipToFront}
          />
        </div>
      </div>
    </div>
  );
}
