const completionsFetch = async (messages) => {
  const completion = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await completion.json();
  return data.answer;
};

export default completionsFetch;
