export const sendChat = async (problem) => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
    },
        credentials: "include",
        body: JSON.stringify({ problem }),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.body.getReader(); // 👈 stream return
};