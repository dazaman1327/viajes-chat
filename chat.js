// Obtener parámetros del formulario enviado desde index.html
const params = new URLSearchParams(window.location.search);
const travelInfo = `Región: ${params.get("region")}, Tipo de Viaje: ${params.get("tripType")}, 
Presupuesto: ${params.get("budget")} MXN, Días: ${params.get("days")}, Invertir en: ${params.get("invest")}`;

// Esperar a que la página cargue completamente y enviar la primera pregunta automática
document.addEventListener("DOMContentLoaded", function () {
    sendAutomaticMessage();
});

// 🔹 Enviar la primera pregunta con los datos del formulario
async function sendAutomaticMessage() {
    showLoading(true);
    disableInput(true);

    const message = `Hola, quiero planear un viaje. ${travelInfo}`;
    appendMessage("Tú", message);

    await sendMessageToAPI(message);

    showLoading(false);
    disableInput(false);
}

// 🔹 Enviar mensaje cuando el usuario escriba algo y presione "Enviar"
async function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();
    if (message === "") return;

    showLoading(true);
    disableInput(true);
    appendMessage("Tú", message);
    userInput.value = "";

    await sendMessageToAPI(message);

    showLoading(false);
    disableInput(false);
}

// 🔹 Llamada a la API de OpenAI a través de Cloudflare Worker
async function sendMessageToAPI(message) {
    const chatBox = document.getElementById("chat-box");

    try {
        const response = await fetch("https://plain-resonance-24f2.ingdavidzavala.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Eres un asesor de viajes." },
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        appendMessage("PaoAI", data.choices[0].message.content);
    } catch (error) {
        appendMessage("PaoAI", "Hubo un error al procesar tu solicitud. Intenta de nuevo.");
        console.error("Error en la API:", error);
    }
}

// 🔹 Función para agregar mensajes al chat
function appendMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔹 Mostrar o ocultar la imagen de "loading"
function showLoading(show) {
    document.getElementById("loading").classList.toggle("hidden", !show);
}

// 🔹 Habilitar o deshabilitar el input y el botón de enviar
function disableInput(disable) {
    document.getElementById("user-input").disabled = disable;
}
