import type { Metadata } from "next";
import { Ifrs16Portfolio } from "@/components/calculator/Ifrs16Portfolio";

export const metadata: Metadata = {
  title: "IFRS 16 — Aurel",
  description: "멀티 자산 IFRS 16 포트폴리오 상각 스케줄 및 통합 전표 관리",
};

export default function Ifrs16Page() {
  return <Ifrs16Portfolio />;
}
