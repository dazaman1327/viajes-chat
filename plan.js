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
                        El plan debe ser de **alto nivel**, sin demasiados detalles, pero mostrando un abanico de opciones interesantes. 
                        También debe incluir una **llamada a la acción**, motivando al usuario a **agendar una cita personal con nuestra agencia** 
                        para afinar detalles y reservar su viaje.`
                    },
                    { 
                        role: "user", 
                        content: `Hola, quiero un plan de viaje con estos detalles: ${travelInfo}. 
                        Por favor, dame una propuesta inspiradora que muestre posibles destinos, actividades clave y una visión general del viaje. 
                        Termina con una llamada a la acción invitándome a agendar una cita con la agencia para personalizar mi experiencia.` 
                    }
                ]
            })
        });

        const data = await response.json();
        
        // Mostrar el plan generado
        planContainer.innerHTML = `<p><strong>📍 Tu Plan de Viaje:</strong></p>
                                   <p>${data.choices[0].message.content}</p>`;
        
    } catch (error) {
        planContainer.innerHTML = `<p>❌ Hubo un error al generar tu plan de viaje. Inténtalo de nuevo.</p>`;
        console.error("Error en la API:", error);
    } finally {
        // Ocultar la imagen de carga y mostrar el plan
        loading.classList.add("hidden");
        planContainer.classList.remove("hidden");
    }
}
