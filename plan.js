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
                        - Se usen encabezados (&lt;h2&gt;) para cada sección.
                        - Se usen listas (&lt;ul&gt; y &lt;li&gt;) para los destinos y actividades.
                        - Se usen párrafos (&lt;p&gt;) para el itinerario general.
                        - No se incluya código fuera de HTML.
                        - Se incluya un botón CTA al final dentro de un &lt;div class="cta"&gt;.
                        
                        📌 **Ejemplo de estructura esperada**:
                        &lt;div&gt;
                            &lt;h2&gt;Destinos Sugeridos&lt;/h2&gt;
                            &lt;ul&gt;
                                &lt;li&gt;📍 Nombre del destino 1 - Breve descripción.&lt;/li&gt;
                                &lt;li&gt;📍 Nombre del destino 2 - Breve descripción.&lt;/li&gt;
                            &lt;/ul&gt;
                            &lt;h2&gt;📅 Itinerario General&lt;/h2&gt;
                            &lt;p&gt;Resumen del viaje.&lt;/p&gt;
                            &lt;h2&gt;🎯 Actividades Recomendadas&lt;/h2&gt;
                            &lt;ul&gt;
                                &lt;li&gt;🏞️ Actividad 1.&lt;/li&gt;
                                &lt;li&gt;🍽️ Actividad 2.&lt;/li&gt;
                            &lt;/ul&gt;
                            &lt;h2&gt;🚀 Próximos Pasos&lt;/h2&gt;
                            &lt;p&gt;Para personalizar tu viaje, agenda una cita con nosotros.&lt;/p&gt;
                            &lt;div class="cta"&gt;Agenda tu cita con un asesor&lt;/div&gt;
                        &lt;/div&gt;`
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
        planContainer.innerHTML = "";
        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(data.choices[0].message.content, "text/html").body;
        planContainer.appendChild(parsedHTML);


        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        // 📌 Asegurar que el GIF de carga desaparece siempre
        if (loading) loading.style.display = "none";
        if (planContainer) planContainer.classList.remove("hidden");
    }
}
