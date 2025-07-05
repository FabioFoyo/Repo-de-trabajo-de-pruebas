const BASE_URL = 'http://localhost:3000';

function mostrarCampos(tipo) {
    document.getElementById('comentarioSection').classList.add('hidden');
    document.getElementById('quejaSection').classList.add('hidden');

    if (tipo === 'comentario') {
        document.getElementById('comentarioSection').classList.remove('hidden');
    } else if (tipo === 'queja') {
        document.getElementById('quejaSection').classList.remove('hidden');
    }
}

function mostrarDatosPersonales(tipoQueja) {
    const datosPersonales = document.getElementById('datosPersonales');
    if (tipoQueja === 'personal') {
        datosPersonales.classList.remove('hidden');
    } else {
        datosPersonales.classList.add('hidden');
    }
}

// Validación del número de teléfono
document.addEventListener("DOMContentLoaded", function () {
    const telefonoInput = document.querySelector("[name=telefono]");
    if (telefonoInput) {
        telefonoInput.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario");
    form.addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevenimos el envío tradicional del formulario
        
        const tipo = document.getElementById("tipo").value;
        let isValid = true;
        let endpoint = BASE_URL;
        let requestData = {};

        // Validación y preparación de datos
        if (tipo === "comentario") {
            const comentario = form.querySelector("[name=comentario]").value.trim();
            if (!comentario) {
                alert("Por favor, escribe tu comentario.");
                isValid = false;
            } else {
                endpoint += '/api/comentarios';
                requestData = {
                    tipo: 'comentario',
                    comentario: comentario
                };
            }
        } else if (tipo === "queja") {
            const tipoQueja = document.getElementById("tipoQueja").value;
            const planteamiento = form.querySelector("[name=planteamiento]").value.trim();

            if (!planteamiento) {
                alert("Por favor, describe tu queja.");
                isValid = false;
            } else {
                endpoint += '/api/quejas';
                requestData = {
                    tipo: 'queja',
                    tipoQueja: tipoQueja,
                    planteamiento: planteamiento
                };

                if (tipoQueja === "personal") {
                    const nombre = form.querySelector("[name=nombre]").value.trim();
                    const email = form.querySelector("[name=email]").value.trim();
                    const telefono = form.querySelector("[name=telefono]").value.trim();

                    if (!nombre || !email || !telefono) {
                        alert("Por favor, completa todos tus datos personales.");
                        isValid = false;
                    } else {
                        requestData.nombre = nombre;
                        requestData.email = email;
                        requestData.telefono = telefono;
                    }
                }
            }
        }

        // Si todo es válido, hacemos la petición al backend
        if (isValid) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.mensaje || 'Reporte enviado con éxito');
                    form.reset(); // Limpiamos el formulario
                    
                    // Redirigir a consultas.html después de 2 segundos
                    setTimeout(() => {
                        window.location.href = 'consultas.html';
                    }, 2000);
                } else {
                    alert(result.error || 'Error al enviar el reporte');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Ocurrió un error al enviar el formulario. Por favor intenta nuevamente.');
            }
        }
    });
});