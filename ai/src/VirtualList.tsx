import { forwardRef } from "react";

import MarkdownIt from "markdown-it";
import { useChat, type Message } from "./store";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

type VirtualListProps = {
  messages: Message[];
};

export const VirtualList = forwardRef<HTMLDivElement, VirtualListProps>(
  ({ messages }, ref) => {
    const { assistantId } = useChat.getState();

    const staticMessages = messages.filter((msg) => msg.id !== assistantId);
    const growingMessage = messages.find((msg) => msg.id === assistantId);

    return (
      <div
        ref={ref}
        className="h-full overflow-auto bg-[#f5f3f2]"
        style={{ position: "relative" }}
      >
        {/* Статичные сообщения */}
        {staticMessages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className="max-w-3xl mx-auto px-6 py-4 rounded-lg my-2 shadow-sm border border-transparent hover:border-gray-300"
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                backgroundColor: isAssistant ? "#f9f7f6" : "#bc987e",
                color: isAssistant ? "#333333" : "#f0e9de",
                whiteSpace: "normal",
              }}
            >
              <div
                className="markdown-body"
                dangerouslySetInnerHTML={{ __html: md.render(msg.content) }}
              />
            </div>
          );
        })}

        {/* Растущее сообщение (только один div, где дописывается текст) */}
        {growingMessage && (
          <div
            key={growingMessage.id}
            className="max-w-3xl mx-auto px-6 py-4 rounded-lg my-2 shadow-sm border border-transparent hover:border-gray-300"
            style={{
              fontFamily: "monospace",
              fontSize: 13,
              backgroundColor: "#f9f7f6",
              color: "#333333",
              whiteSpace: "normal",
            }}
          >
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{
                __html: md.render(growingMessage.content),
              }}
            />
          </div>
        )}
      </div>
    );
  },
);
