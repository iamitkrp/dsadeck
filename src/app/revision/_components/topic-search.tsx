"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export function TopicSearch({
  items,
  onSelect,
  activeKey,
}: {
  items: { key: string; title: string; description: string }[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(s) ||
        it.description.toLowerCase().includes(s)
    );
  }, [q, items]);

  return (
    <div className="grid gap-2 p-2">
      <Input
        placeholder="Search topics..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="h-8"
      />
      <ul>
        {filtered.map((item) => (
          <li key={item.key}>
            <button
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-foreground/5 ${
                item.key === activeKey ? "bg-foreground/10" : ""
              }`}
              onClick={() => onSelect(item.key)}
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopicSearch;


