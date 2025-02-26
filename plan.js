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
                        role: "system", 
                        content: `Eres un asesor de viajes experto en diseñar planes inspiradores y personalizados para viajeros latinos. 
                        Tu misión es ofrecer un itinerario que genere emoción y curiosidad, brindando una visión clara de lo que podría ser su viaje. 
                        
                        🎯 **Puntos clave del plan de viaje:**  
                        - **Debe ser emocionante** y despertar interés.  
                        - **Debe ser de alto nivel**, sin demasiados detalles, pero suficiente para inspirar.  
                        - **Debe incluir una llamada a la acción** para agendar una cita con un asesor.

                        📌 **FORMATO DE RESPUESTA EN HTML (IMPORTANTE)**  
                        - Usa encabezados <h2> para cada sección.  
                        - Usa listas <ul> y <li> para los destinos y actividades recomendadas.  
                        - Usa párrafos <p> para describir el itinerario general.  
                        - **No incluyas listas vacías o elementos sin contenido.**  
                        - Finaliza con una llamada a la acción <div class="cta"> que invite a agendar una cita.

                        📌 **Estructura esperada en HTML:**  
                        <h2>🌍 Destinos Sugeridos</h2>
                        <ul>
                            <li>📍 Nombre del destino 1 - Breve descripción.</li>
                            <li>📍 Nombre del destino 2 - Breve descripción.</li>
                        </ul>
                        <h2>📅 Itinerario General</h2>
                        <p>Descripción del recorrido del viaje, destacando las experiencias clave.</p>
                        <h2>🎯 Actividades Recomendadas</h2>
                        <ul>
                            <li>🏞️ Actividad 1</li>
                            <li>🍽️ Actividad 2</li>
                        </ul>
                        <h2>🚀 Próximos Pasos</h2>
                        <p>Para personalizar tu viaje y reservar, agenda una cita con nuestro equipo.</p>
                        <div class="cta"><button>Agenda tu cita con un asesor</button></div>`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        ${aboutUser} ${specialRequests} sigue el formato html indicado.`
                    }
                ]
            })
        });

        const data = await response.json();
        let planHTML = data.choices[0].message.content;

        // Eliminar posibles listas vacías generadas por OpenAI
        planHTML = planHTML.replace(/<ul>\s*<\/ul>/g, '').replace(/<li>\s*<\/li>/g, '');

        // Mostrar el plan en la página
        planContainer.innerHTML = planHTML;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        if (loading) loading.style.display = "none";
        if (planContainer) planContainer.classList.remove("hidden");
    }
}
