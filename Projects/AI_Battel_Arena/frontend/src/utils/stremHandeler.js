export const handleStream = async (reader, pendingId, setMessages) => {
  const decoder = new TextDecoder();

  let shouldStop = false;

  while (!shouldStop) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(Boolean);

    for (const line of lines) {
      let data;
      try {
        data = JSON.parse(line);
      } catch {
        continue;
      }

      if (data.type === "judge") {
        shouldStop = true;

        setMessages(prev =>
          prev.map(msg => {
            if (msg.id !== pendingId) return msg;

            return {
              ...msg,
              status: "done",
              response: {
                ...msg.response,
                judge: data.data
              }
            };
          })
        );

        break; // 👈 ONLY here
      }

      setMessages(prev =>
        prev.map(msg => {
          if (msg.id !== pendingId) return msg;

          if (data.model === "mistral") {
            return {
              ...msg,
              status: "streaming",
              response: {
                ...msg.response,
                solution_1: (msg.response.solution_1 || "") + data.content
              }
            };
          }

          if (data.model === "cohere") {
            return {
              ...msg,
              status: "streaming",
              response: {
                ...msg.response,
                solution_2: (msg.response.solution_2 || "") + data.content
              }
            };
          }

          return msg;
        })
      );
    }
  }
};