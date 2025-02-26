const chatBox = document.getElementById("chat-box");

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("Tú: " + message);
    userInput.value = "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer TU_API_KEY_AQUI"
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "Eres un asesor de viajes experto en destinos de Europa para viajeros latinos." }, 
                       { role: "user", content: message }]
        })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    appendMessage("Asesor: " + reply);
}

function appendMessage(text) {
    const messageElement = document.createElement("p");
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
