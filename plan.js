// Obtener los datos enviados desde index.html
const params = new URLSearchParams(window.location.search);
const travelInfo = `Región: ${params.get("region")}, Tipo de Viaje: ${params.get("tripType")}, 
Presupuesto: ${params.get("budget")} MXN, Días: ${params.get("days")}, Invertir en: ${params.get("invest")}`;

const aboutUser = params.get("aboutYou") ? `Información sobre el viajero: ${params.get("aboutYou")}` : "";
const specialRequests = params.get("specialRequests") ? `Petición especial del usuario: ${params.get("specialRequests")}` : "";

// Esperar a que la página cargue completamente antes de solicitar el plan
document.addEventListener("DOMContentLoaded", function () {
    generatePlan();
});

async function generatePlan() {
    const planContainer = document.getElementById("plan-container");
    const loading = document.getElementById("loading");

    try {
        const response = await fetch("https://plain-resonance-24f2.ingdavidzavala.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                   {
                        "role": "system",
                        "content": `Eres un asesor de viajes especializado en crear planes personalizados. 
                        Tu objetivo es inspirar al usuario con una propuesta de viaje emocionante.  
                        Usa las siguientes reglas de formato en HTML:
                    
                        - Separa las secciones con encabezados <h2> y una línea decorativa debajo.
                        - Asegura que todas las listas tengan bullets claros y bien espaciados.
                        - Usa <p> para bloques de texto y <ul><li> para listas.
                        - Incluye una llamada a la acción clara con un botón estilizado.
                    
                        📌 **Ejemplo del formato esperado:**
                        <h2>🌍 Destinos Sugeridos</h2>
                        <hr>
                        <ul>
                            <li>📍 Nombre del destino - Breve descripción</li>
                            <li>📍 Otro destino - Breve descripción</li>
                        </ul>
                        <h2>📅 Itinerario General</h2>
                        <hr>
                        <p>Texto detallado sobre el viaje y las actividades.</p>
                        <h2>🎯 Actividades Recomendadas</h2>
                        <hr>
                        <ul>
                            <li>🏞️ Actividad 1</li>
                            <li>🍽️ Actividad 2</li>
                        </ul>
                        <h2>🚀 Próximos Pasos</h2>
                        <hr>
                        <p>Para personalizar tu viaje y reservar, agenda una cita con nuestro equipo.</p>
                        <div class="cta"><button>Agenda tu cita con un asesor</button></div>`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        ${aboutUser} ${specialRequests} `
                    }
                ]
            })
        });

        const data = await response.json();
        console.log("Respuesta de OpenAI:", data);
        let planHTML = data.choices[0].message.content;

        // Mostrar el plan en la página
        console.log("Contenido insertado en HTML:", data.choices[0].message.content);
        planContainer.innerHTML = planHTML;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        if (loading) loading.style.display = "none";
        if (planContainer) planContainer.classList.remove("hidden");
    }
}
