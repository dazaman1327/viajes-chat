const chatBox = document.getElementById("chat-box");

async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage("Tú: " + message);
    userInput.value = "";

    try {
        const response = await fetch("https://plain-resonance-24f2.ingdavidzavala.workers.dev/", { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Eres un asesor de viajes experto en Europa para viajeros latinos. Proporciona recomendaciones de destinos, itinerarios y consejos de viaje." }, 
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const reply = data.choices[0].message.content;
            appendMessage("Asesor: " + reply);
        } else {
            appendMessage("Asesor: Lo siento, no pude procesar tu solicitud.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        appendMessage("Asesor: Ocurrió un error al procesar tu solicitud. Intenta de nuevo.");
    }
}

function appendMessage(text) {
    const messageElement = document.createElement("p");
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}


document.getElementById("travel-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const region = document.getElementById("region").value;
    const tripType = document.getElementById("trip-type").value;
    const budget = document.getElementById("budget").value;
    const days = document.getElementById("days").value;  // Capturar días de viaje
    const invest = Array.from(document.querySelectorAll('input[name="invest"]:checked'))
                        .map(el => el.value)
                        .join(", ");

    const params = new URLSearchParams({ region, tripType, budget, days, invest });
    window.location.href = "chat.html?" + params.toString();
});

document.getElementById("budget").addEventListener("input", function () {
    document.getElementById("budget-value").textContent = this.value;
});


document.addEventListener("DOMContentLoaded", function () {
    const budgetSlider = document.getElementById("budget");
    const budgetValue = document.getElementById("budget-value");

    // Actualizar el valor mostrado cuando se mueve el slider
    budgetSlider.addEventListener("input", function () {
        budgetValue.textContent = this.value;
    });
});

