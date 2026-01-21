import { useState, useRef, useEffect } from "react";
import { useChat } from "./store";
import { generate, stopGen } from "./generator";
import { VirtualList } from "./VirtualList";

export default function App() {
  const { messages, add, start, stop, generating, assistantId } = useChat();

  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const onScroll = () => {
    if (!containerRef.current) return;

    const el = containerRef.current;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(distanceToBottom < 100);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    if (!containerRef.current) return;

    const el = containerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [messages, autoScroll]);

  const onGenerate = () => {
    if (!assistantId) {
      const id = crypto.randomUUID();
      add({ id, role: "assistant", content: "" });
      start(id);
      generate(id);
    } else if (!generating) {
      start(assistantId);
      generate(assistantId);
    }
  };

  const onStop = () => {
    stopGen();
    stop();
  };

  return (
    <div className="relative h-screen bg-[#f5f3f2] text-gray-900">
      <header className="h-14 flex items-center px-6 border-b border-gray-300 bg-[#f5f3f2] font-semibold text-lg">
        Milk Chat Ai
      </header>

      <main className="overflow-auto pt-4 pb-20 h-[calc(100vh-56px)]">
        <VirtualList messages={messages} ref={containerRef} />
      </main>

      <div className="absolute bottom-0 left-0 right-0 bg-[#e7e2dd] border-t border-gray-300 px-4 py-4">
        <div className="max-w-3xl mx-auto flex gap-2 justify-center">
          <button
            onClick={onGenerate}
            disabled={generating}
            className="px-6 py-2 rounded-md text-sm bg-[#bc987e] hover:bg-[#a47b68] disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors duration-200"
          >
            Generate
          </button>

          <button
            onClick={onStop}
            disabled={!generating}
            className="px-6 py-2 rounded-md text-sm border border-gray-400 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
