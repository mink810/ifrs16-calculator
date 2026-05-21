import type { Metadata } from "next";
import { Ifrs16Calculator } from "@/components/calculator/Ifrs16Calculator";

export const metadata: Metadata = {
  title: "IFRS 16 — Aurel",
  description: "IFRS 16 리스회계 상각 스케줄 및 전표 계산",
};

export default function Ifrs16Page() {
  return <Ifrs16Calculator />;
}
