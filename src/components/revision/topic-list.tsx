"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

type TopicItem = { key: string; title: string; description?: string };

export function TopicList({
  items,
  activeKey,
  onSelect,
}: {
  items: TopicItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}) {
  return (
    <ScrollArea className="h-full">
      <ul className="p-2">
        {items.map((item) => (
          <li key={item.key}>
            <button
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-foreground/5 ${
                item.key === activeKey ? "bg-foreground/10" : ""
              }`}
              onClick={() => onSelect(item.key)}
            >
              <div className="font-medium">{item.title}</div>
              {item.description && (
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default TopicList;


