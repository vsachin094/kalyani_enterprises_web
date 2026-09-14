"use client";

import { Link } from 'react-router-dom';
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { AssetImage } from "@/components/ui/Card";

export function CompactRelatedCard({ name, description, icon, image, href, category }: { name: string; description: string; icon: ReactNode; image?: string; href: string; category: "product" | "service" }) {
  return (
    <Link to={href} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-orange-50">
        {image ? <AssetImage src={image} alt="" placeholderLabel="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-orange-600">{icon}</div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-600">{category}</p>
        <h3 className="truncate text-sm font-bold text-gray-900 group-hover:text-orange-600">{name}</h3>
        <p className="truncate text-xs text-gray-500">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-orange-600" />
    </Link>
  );
}
