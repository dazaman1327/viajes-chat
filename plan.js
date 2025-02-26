// Obtener los datos enviados desde index.html
const params = new URLSearchParams(window.location.search);
const travelInfo = `Región: ${params.get("region")}, Tipo de Viaje: ${params.get("tripType")}, 
Presupuesto: ${params.get("budget")} MXN, Días: ${params.get("days")}, Invertir en: ${params.get("invest")}`;

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
                        Devuelve la respuesta estructurada en HTML con los siguientes elementos:
                        - **Encabezados (`<h2>`)** para cada sección (Destinos, Itinerario, Actividades, etc.).
                        - **Listas (`<ul>`)** para enumerar destinos y actividades.
                        - **Párrafos (`<p>`)** con descripciones inspiradoras.
                        - **Una llamada a la acción al final** que motive al usuario a agendar una cita con la agencia.` 
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        Estructura la respuesta en HTML usando títulos, listas y una llamada a la acción al final.` 
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
