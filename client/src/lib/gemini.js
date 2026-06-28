const interactionsFetch = async (prompt) => {
  const interaction = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const data = await interaction.json();
  return data.text;
};

export default interactionsFetch;
