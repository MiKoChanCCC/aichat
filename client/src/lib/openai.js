const completionsFetch = async (messages, handleChunk) => {
  const response = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  // 读取SSE流
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    // 按行解析 SSE 数据
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6); // 去掉 "data: " 前缀
        if (data === "[DONE]") break;

        try {
          const parsed = JSON.parse(data);
          result += parsed.content;
          handleChunk(result);
        } catch (error) {}
      }
    }
  }

  return result;
};

export default completionsFetch;
