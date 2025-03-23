document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("travel-form");
    const budgetSlider = document.getElementById("budget");
    const budgetValue = document.getElementById("budget-value");

    const fixedDates = document.getElementById("fixed-dates");
    const openDates = document.getElementById("open-dates");

    // Mostrar valor dinámico del presupuesto
    budgetSlider.addEventListener("input", function () {
        budgetValue.textContent = `${this.value.toLocaleString()} MXN`;
    });

    // Mostrar campos según selección de fechas
    const dateRadios = document.querySelectorAll('input[name="dateType"]');
    dateRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "fijas" || this.value === "estimadas") {
                fixedDates.classList.remove("hidden");
                openDates.classList.add("hidden");
            } else if (this.value === "abiertas") {
                fixedDates.classList.add("hidden");
                openDates.classList.remove("hidden");
            }
        });
    });

    // Enviar formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const region = document.getElementById("region").value;
        const budget = document.getElementById("budget").value;

        // Fechas
        let dateType = "";
        document.querySelectorAll('input[name="dateType"]').forEach(el => {
            if (el.checked) {
                dateType = el.value;
            }
        });

        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const monthEstimate = document.getElementById("monthEstimate").value;
        const daysEstimate = document.getElementById("daysEstimate").value;

        // Tipo de viaje
        let tripType = "";
        document.querySelectorAll('input[name="tripType"]').forEach(el => {
            if (el.checked) {
                tripType = el.value;
            }
        });
        if (tripType === "Otro") {
            tripType = document.getElementById("tripTypeOther").value || "Otro";
        }

        // Preferencias de inversión
        let invest = [];
        document.querySelectorAll('input[name="invest"]:checked').forEach(el => {
            invest.push(el.value);
        });

        // Destino específico
        const specificDestination = document.getElementById("specificDestination").value;

        // Ritmo de viaje
        let pace = "";
        document.querySelectorAll('input[name="pace"]').forEach(el => {
            if (el.checked) {
                pace = el.value;
            }
        });

        // Compañía
        let company = "";
        document.querySelectorAll('input[name="company"]').forEach(el => {
            if (el.checked) {
                company = el.value;
            }
        });
        if (company === "Otro") {
            company = document.getElementById("companyOther").value || "Otro";
        }

        // Campos opcionales
        const aboutYou = document.getElementById("aboutYou").value;
        const specialRequests = document.getElementById("specialRequests").value;

        // Construir parámetros
        const params = new URLSearchParams({
            region,
            budget,
            dateType,
            startDate,
            endDate,
            monthEstimate,
            daysEstimate,
            tripType,
            invest: invest.join(", "),
            specificDestination,
            pace,
            company,
            aboutYou,
            specialRequests
        });

        // Redirigir al chat
        window.location.href = "chat.html?" + params.toString();
    });
});
