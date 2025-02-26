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
        // 📌 Verifica que los elementos existen antes de usarlos
        if (!planContainer || !loading) {
            console.error("❌ Error: No se encontró el contenedor de plan o el loading.");
            return;
        }

        const response = await fetch("https://plain-resonance-24f2.ingdavidzavala.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { 
                        role: "system", 
                        content: `Eres un asesor de viajes especializado en crear planes personalizados para viajeros latinos. 
                        Devuelve la respuesta en **HTML válido**, asegurando que:
                        - Se usen encabezados `<h2>` para cada sección.
                        - Se usen listas `<ul>` y `<li>` para los destinos y actividades.
                        - Se usen párrafos `<p>` para el itinerario general.
                        - No se incluya código fuera de HTML.
                        - Se incluya un botón CTA al final dentro de un `<div class="cta">`.

                        📌 **Ejemplo de estructura esperada**:
                        <div>
                            <h2>Destinos Sugeridos</h2>
                            <ul>
                                <li>📍 Nombre del destino 1 - Breve descripción.</li>
                                <li>📍 Nombre del destino 2 - Breve descripción.</li>
                            </ul>
                            <h2>📅 Itinerario General</h2>
                            <p>Resumen del viaje.</p>
                            <h2>🎯 Actividades Recomendadas</h2>
                            <ul>
                                <li>🏞️ Actividad 1.</li>
                                <li>🍽️ Actividad 2.</li>
                            </ul>
                            <h2>🚀 Próximos Pasos</h2>
                            <p>Para personalizar tu viaje, agenda una cita con nosotros.</p>
                            <div class="cta">Agenda tu cita con un asesor</div>
                        </div>`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        ${aboutUser} ${specialRequests}.
                        **Devuelve la respuesta solo en HTML, asegurando que siga el formato indicado.**`
                    }
                ]
            })
        });

        const data = await response.json();

        // 📌 Verifica si la respuesta de OpenAI está definida antes de insertarla
        if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
            throw new Error("La API no devolvió una respuesta válida.");
        }

        console.log("🔍 Respuesta de OpenAI:", data.choices[0].message.content);

        // 📌 Insertar la respuesta de OpenAI sin modificaciones
        planContainer.innerHTML = data.choices[0].message.content;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        // 📌 Asegurar que el GIF de carga desaparece siempre
        if (loading) loading.style.display = "none";
        if (planContainer) planContainer.classList.remove("hidden");
    }
}
