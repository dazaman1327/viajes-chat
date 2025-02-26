const params = new URLSearchParams(window.location.search);
const travelInfo = `Región: ${params.get("region")}, Tipo de Viaje: ${params.get("tripType")}, 
Presupuesto: ${params.get("budget")} MXN, Invertir en: ${params.get("invest")}`;

async function sendMessage() {
    const chatBox = document.getElementById("chat-box");
    const message = document.getElementById("user-input").value;
    
    chatBox.innerHTML += `<p><strong>Tú:</strong> ${message}</p>`;

    const response = await fetch("https://plain-resonance-24f2.ingdavidzavala.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "system", content: "Eres un asesor de viajes." },
                       { role: "user", content: `Hola, quiero planear un viaje. ${travelInfo}` },
                       { role: "user", content: message }]
        })
    });

    const data = await response.json();
    chatBox.innerHTML += `<p><strong>PaoAI:</strong> ${data.choices[0].message.content}</p>`;
}
