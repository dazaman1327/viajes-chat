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
                        content: `Eres un asesor de viajes especializado en crear planes personalizados para viajeros latinos. 
                        Tu objetivo es inspirar al usuario con una propuesta de viaje emocionante y atractiva. 
                        Usa los siguientes datos para hacer el plan más personalizado:
                        - **Datos del usuario**: ${aboutUser}
                        - **Petición especial**: ${specialRequests}
                        Devuelve la respuesta en **formato HTML** con la siguiente estructura:
                        <h2>Destinos Sugeridos</h2>
                        <ul>
                            <li>Nombre del destino 1 - Breve descripción</li>
                            <li>Nombre del destino 2 - Breve descripción</li>
                        </ul>
                        <h2>Itinerario General</h2>
                        <p>Resumen de lo que podría incluir el viaje.</p>
                        <h2>Actividades Recomendadas</h2>
                        <ul>
                            <li>Actividad 1</li>
                            <li>Actividad 2</li>
                        </ul>
                        <h2>🎯 Próximos Pasos</h2>
                        <p>Para personalizar tu viaje y reservar con nosotros, agenda una cita.</p>
                        <div class="cta">Agenda tu cita con un asesor</div>`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        ${aboutUser} ${specialRequests}
                        Devuelve la respuesta en HTML con encabezados, listas y una llamada a la acción al final.` 
                    }
                ]
            })
        });

        const data = await response.json();
        
        // Mostrar el plan generado como HTML estructurado
        planContainer.innerHTML = data.choices[0].message.content;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        // Ocultar la imagen de carga y mostrar el plan
        loading.classList.add("hidden");
        planContainer.classList.remove("hidden");
    }
}
