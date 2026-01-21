import { useChat } from "./store";

const lorem =
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. `.repeat(
    200,
  );

let timer: number | null = null;

export function generate(id: string) {
  const chunkSize = 20;
  const interval = 20;

  if (timer) return;

  timer = window.setInterval(() => {
    const state = useChat.getState();
    if (!state.generating) {
      console.log("Stopped generating");
      clearInterval(timer!);
      timer = null;
      return;
    }

    const currentMessage = state.messages.find((m) => m.id === id);
    if (!currentMessage) {
      console.log("Message not found");
      clearInterval(timer!);
      timer = null;
      return;
    }

    const offset = state.offset;
    const nextChunk = lorem.slice(offset, offset + chunkSize);
    if (nextChunk.length === 0) {
      console.log("No more text to generate");
      clearInterval(timer!);
      timer = null;
      state.stop();
      return;
    }

    console.log(`Appending chunk: "${nextChunk}" at offset ${offset}`);

    console.log("lorem length:", lorem.length);
    console.log("current offset:", offset);

    state.updateContent(id, (prev) => prev + nextChunk);
    useChat.setState((state) => ({
      ...state,
      offset: state.offset + chunkSize,
    }));
  }, interval);
}

export function stopGen() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
