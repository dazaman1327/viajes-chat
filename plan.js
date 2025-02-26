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

                        📌 **FORMATO DE RESPUESTA (IMPORTANTE)**  
                        - Devuelve **solo HTML** válido y estructurado.  
                        - **No uses código fuera de HTML** (no metas JavaScript ni clases extrañas).  
                        - Usa `<h2>` para títulos, `<ul>` y `<li>` para listas, y `<p>` para texto.  
                        - Asegúrate de **cerrar todas las etiquetas correctamente**.  

                        **Ejemplo de estructura esperada**:
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
                        </div>
                        
                        No devuelvas nada fuera de este formato HTML.`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        ${aboutUser} ${specialRequests}. **Devuelve la respuesta solo en HTML, siguiendo el formato indicado.**`
                    }
                ]
            })
        });

        const data = await response.json();

        console.log("🔍 Respuesta de OpenAI:", data.choices[0].message.content); // Verificar la respuesta en consola

        // 📌 Mostrar directamente la respuesta SIN modificaciones
        planContainer.innerHTML = data.choices[0].message.content;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        // Ocultar el loader y mostrar el plan
        if (loading) loading.style.display = "none";
        if (planContainer) planContainer.classList.remove("hidden");
    }
}
