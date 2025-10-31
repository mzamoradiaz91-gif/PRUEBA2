// Variables globales para almacenar los datos del formulario
let userData = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    edad: '',
    genero: '',
    colonia: '',
    codigoPostal: '',
    idCliente: '',
    servicioSeleccionado: null,
    fechaCita: '',
    horaCita: '',
    precioServicio: 0,
    descuentoAplicado: false,
    montoPagar: 0,
    tipoCabello: ''
};

// Elementos DOM
const pages = document.querySelectorAll('.page');
const progressSteps = document.querySelectorAll('.progress-step');

// Página 1: Datos personales
const fechaNacimientoInput = document.getElementById('fecha-nacimiento');
const edadInput = document.getElementById('edad');
const idClienteInput = document.getElementById('id-cliente');
const btnNext1 = document.getElementById('btn-next-1');
const genderOptions = document.querySelectorAll('.gender-option');
const generoInput = document.getElementById('genero');
const showTermsBtn = document.getElementById('show-terms');
const termsModal = document.getElementById('terms-modal');
const closeTermsBtn = document.getElementById('close-terms');

// Página 2: Servicios para hombres
const servicioCardsHombres = document.querySelectorAll('#page2 .service-card');
const btnNext2 = document.getElementById('btn-next-2');
const btnBack2 = document.getElementById('btn-back-2');

// Página 3: Servicios para mujeres
const servicioCardsMujeres = document.querySelectorAll('#page3 .service-card');
const tipoCabelloSelect = document.getElementById('tipo-cabello');
const btnNext3 = document.getElementById('btn-next-3');
const btnBack3 = document.getElementById('btn-back-3');

// Página 4: Fecha y hora
const fechaCitaInput = document.getElementById('fecha-cita');
const timeSlotsContainer = document.getElementById('time-slots');
const btnNext4 = document.getElementById('btn-next-4');
const btnBack4 = document.getElementById('btn-back-4');

// Página 5: Resumen y pago
const resumenDatosDiv = document.getElementById('resumen-datos');
const detallePagoDiv = document.getElementById('detalle-pago');
const monto30Span = document.getElementById('monto-30');
const codigoDescuentoInput = document.getElementById('codigo-descuento');
const btnAplicarDescuento = document.getElementById('btn-aplicar-descuento');
const btnConfirmarPago = document.getElementById('btn-confirmar-pago');
const btnBack5 = document.getElementById('btn-back-5');

// Página 6: Confirmación
const resumenFinalDiv = document.getElementById('resumen-final');
const btnWhatsApp = document.getElementById('btn-whatsapp');
const btnFinalizar = document.getElementById('btn-finalizar');

// Función de ayuda para accesibilidad (clic con teclado)
function addKeyboardAccessibility(element, clickHandler) {
    element.addEventListener('click', clickHandler);
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); // Evita que la barra espaciadora haga scroll
            element.click(); // Simula el evento de clic
        }
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Establecer fecha mínima para la cita (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    fechaCitaInput.min = tomorrow.toISOString().split('T')[0];
    
    // Generar horarios disponibles
    generarHorarios();
    
    // Event listeners para la página 1
    fechaNacimientoInput.addEventListener('change', calcularEdad);
    
    // Event listeners para selección de género
    genderOptions.forEach(option => {
        addKeyboardAccessibility(option, function() {
            genderOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            generoInput.value = this.getAttribute('data-value');
            userData.genero = generoInput.value;
        });
    });
    
    btnNext1.addEventListener('click', function() {
        if (validarFormulario1()) {
            guardarDatosPersonales();
            
            if (userData.genero === 'hombre') {
                mostrarPagina(2);
            } else {
                mostrarPagina(3);
            }
        }
    });
    
    // Event listeners para términos y condiciones
    showTermsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'flex';
    });
    
    closeTermsBtn.addEventListener('click', function() {
        termsModal.style.display = 'none';
    });
    
    // Event listeners para la página 2 (HOMBRES)
    servicioCardsHombres.forEach(card => {
        addKeyboardAccessibility(card, function() {
            // Remover selección anterior
            servicioCardsHombres.forEach(c => c.classList.remove('selected'));
            
            // Seleccionar esta tarjeta
            this.classList.add('selected');
            
            // Obtener precio del servicio
            const precio = this.getAttribute('data-price');
            userData.precioServicio = parseFloat(precio);
            userData.servicioSeleccionado = this.querySelector('h3').textContent;
            
            // Habilitar botón siguiente
            btnNext2.disabled = false;
        });
    });
    
    btnNext2.addEventListener('click', function() {
        mostrarPagina(4);
    });
    
    btnBack2.addEventListener('click', function() {
        mostrarPagina(1);
    });
    
    // Event listeners para la página 3 (MUJERES)
    tipoCabelloSelect.addEventListener('change', function() {
        userData.tipoCabello = this.value;
        verificarEstadoBotonMujeres();
    });
    
    servicioCardsMujeres.forEach(card => {
        addKeyboardAccessibility(card, function() {
            // Remover selección anterior
            servicioCardsMujeres.forEach(c => c.classList.remove('selected'));
            
            // Seleccionar esta tarjeta
            this.classList.add('selected');
            
            // Obtener precio del servicio
            const precio = this.getAttribute('data-price');
            userData.precioServicio = parseFloat(precio);
            userData.servicioSeleccionado = this.querySelector('h3').textContent;
            
            // Verificar estado del botón
            verificarEstadoBotonMujeres();
        });
    });
    
    btnNext3.addEventListener('click', function() {
        if (validarFormularioMujeres()) {
            mostrarPagina(4);
        }
    });
    
    btnBack3.addEventListener('click', function() {
        mostrarPagina(1);
    });
    
    // Event listeners para la página 4
    fechaCitaInput.addEventListener('change', function() {
        userData.fechaCita = this.value;
        // Habilitar botón siguiente si también hay hora seleccionada
        if (userData.horaCita) {
            btnNext4.disabled = false;
        }
    });
    
    btnNext4.addEventListener('click', function() {
        mostrarPagina(5);
        mostrarResumen();
    });
    
    btnBack4.addEventListener('click', function() {
        const genero = userData.genero;
        if (genero === 'hombre') {
            mostrarPagina(2);
        } else {
            mostrarPagina(3);
        }
    });
    
    // Event listeners para la página 5
    btnAplicarDescuento.addEventListener('click', aplicarDescuento);
    btnConfirmarPago.addEventListener('click', confirmarPago);
    btnBack5.addEventListener('click', function() {
        mostrarPagina(4);
    });
    
    // Event listeners para la página 6
    btnWhatsApp.addEventListener('click', enviarWhatsApp);
    btnFinalizar.addEventListener('click', function() {
        // Reiniciar el formulario
        document.getElementById('personal-data-form').reset();
        userData = {
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: '',
            fechaNacimiento: '',
            edad: '',
            genero: '',
            colonia: '',
            codigoPostal: '',
            idCliente: '',
            servicioSeleccionado: null,
            fechaCita: '',
            horaCita: '',
            precioServicio: 0,
            descuentoAplicado: false,
            montoPagar: 0,
            tipoCabello: ''
        };
        
        // Resetear selección de género
        genderOptions.forEach(opt => opt.classList.remove('selected'));
        generoInput.value = '';
        
        // Resetear selección de servicios
        servicioCardsHombres.forEach(card => card.classList.remove('selected'));
        servicioCardsMujeres.forEach(card => card.classList.remove('selected'));
        
        // Resetear tipo de cabello
        tipoCabelloSelect.value = '';
        
        // Deshabilitar botones de siguiente
        btnNext2.disabled = true;
        btnNext3.disabled = true;
        btnNext4.disabled = true;
        
        mostrarPagina(1);
    });
});

// Funciones
function mostrarPagina(numeroPagina) {
    // Ocultar todas las páginas
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar la página solicitada
    document.getElementById(`page${numeroPagina}`).classList.add('active');
    
    // Actualizar barra de progreso
    progressSteps.forEach((step, index) => {
        if (index < numeroPagina) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function calcularEdad() {
    const fechaNacimiento = new Date(fechaNacimientoInput.value);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    
    edadInput.value = edad;
    userData.edad = edad;
    
    // Generar ID del cliente
    generarIdCliente();
}

function generarIdCliente() {
    const nombre = document.getElementById('nombre').value.substring(0, 2).toUpperCase();
    const fechaNacimiento = fechaNacimientoInput.value.replace(/-/g, '');
    const colonia = document.getElementById('colonia').value.substring(0, 3).toUpperCase();
    
    if (nombre && fechaNacimiento && colonia) {
        const id = nombre + fechaNacimiento + colonia;
        idClienteInput.value = id;
        userData.idCliente = id;
    }
}

function validarFormulario1() {
    const inputs = document.querySelectorAll('#personal-data-form input[required]');
    let valido = true;
    
    inputs.forEach(input => {
        if (!input.value) {
            valido = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    if (!generoInput.value) {
        alert('Por favor, selecciona tu género');
        valido = false;
    }
    
    return valido;
}

function validarFormularioMujeres() {
    if (!userData.tipoCabello) {
        alert('Por favor, selecciona tu tipo de cabello');
        tipoCabelloSelect.style.borderColor = 'red';
        return false;
    }
    
    tipoCabelloSelect.style.borderColor = '#ddd';
    return true;
}

function verificarEstadoBotonMujeres() {
    // Habilitar botón siguiente solo si hay servicio seleccionado y tipo de cabello
    if (userData.servicioSeleccionado && userData.tipoCabello) {
        btnNext3.disabled = false;
    } else {
        btnNext3.disabled = true;
    }
}

function guardarDatosPersonales() {
    userData.nombre = document.getElementById('nombre').value;
    userData.apellidoPaterno = document.getElementById('apellido-paterno').value;
    userData.apellidoMaterno = document.getElementById('apellido-materno').value;
    userData.fechaNacimiento = fechaNacimientoInput.value;
    userData.colonia = document.getElementById('colonia').value;
    userData.codigoPostal = document.getElementById('codigo-postal').value;
}

function generarHorarios() {
    // Generar horarios de 10:00 AM a 8:00 PM
    for (let hora = 10; hora <= 20; hora++) {
        for (let minuto = 0; minuto < 60; minuto += 30) {
            if (hora === 20 && minuto > 0) break; // No generar después de las 8:00 PM
            
            const horaFormateada = hora.toString().padStart(2, '0');
            const minutoFormateado = minuto.toString().padStart(2, '0');
            const horaCompleta = `${horaFormateada}:${minutoFormateado}`;
            
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = horaCompleta;
            
            // Accesibilidad para horarios
            timeSlot.setAttribute('role', 'button');
            timeSlot.setAttribute('tabindex', '0');
            
            addKeyboardAccessibility(timeSlot, function() {
                // Remover selección anterior
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                
                // Seleccionar este horario
                this.classList.add('selected');
                userData.horaCita = horaCompleta;
                
                // Habilitar botón siguiente si también hay fecha seleccionada
                if (userData.fechaCita) {
                    btnNext4.disabled = false;
                }
            });
            
            timeSlotsContainer.appendChild(timeSlot);
        }
    }
}

function mostrarResumen() {
    // Calcular monto a pagar (30% del servicio)
    userData.montoPagar = userData.precioServicio * 0.3;
    
    // Mostrar el monto del 30% en el texto
    monto30Span.textContent = `$${userData.montoPagar.toFixed(2)} (equivalente al 30% del servicio)`;
    
    // Mostrar datos personales
    let htmlResumen = `
        <h3>Datos Personales</h3>
        <div class="summary-item">
            <span class="summary-label">Nombre completo:</span> 
            ${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}
        </div>
        <div class="summary-item">
            <span class="summary-label">Fecha de nacimiento:</span> 
            ${userData.fechaNacimiento} (${userData.edad} años)
        </div>
        <div class="summary-item">
            <span class="summary-label">Género:</span> 
            ${userData.genero}
        </div>
        <div class="summary-item">
            <span class="summary-label">Colonia y C.P.:</span> 
            ${userData.colonia}, ${userData.codigoPostal}
        </div>
        <div class="summary-item">
            <span class="summary-label">ID Cliente:</span> 
            ${userData.idCliente}
        </div>
        
        <h3>Detalles de la Cita</h3>
        <div class="summary-item">
            <span class="summary-label">Servicio:</span> 
            ${userData.servicioSeleccionado}
        </div>`;
    
    // Agregar tipo de cabello si es mujer
    if (userData.genero === 'mujer' && userData.tipoCabello) {
        htmlResumen += `
        <div class="summary-item">
            <span class="summary-label">Tipo de cabello:</span> 
            ${userData.tipoCabello}
        </div>`;
    }
    
    htmlResumen += `
        <div class="summary-item">
            <span class="summary-label">Precio del servicio:</span> 
            $${userData.precioServicio.toFixed(2)}
        </div>
        <div class="summary-item">
            <span class="summary-label">Fecha y hora:</span> 
            ${userData.fechaCita} a las ${userData.horaCita}
        </div>
    `;
    
    resumenDatosDiv.innerHTML = htmlResumen;
    
    // Mostrar detalles de pago
    detallePagoDiv.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Servicio seleccionado:</span> 
            $${userData.precioServicio.toFixed(2)}
        </div>
        <div class="summary-item">
            <span class="summary-label">Monto a pagar (30%):</span> 
            $${userData.montoPagar.toFixed(2)}
        </div>
    `;
}

function aplicarDescuento() {
    const codigo = codigoDescuentoInput.value.trim();
    
    // Verificar si el código es válido
    if (codigo === 'COLORS' || codigo === 'INFINITO') {
        userData.descuentoAplicado = true;
        
        // Aplicar 40% de descuento al precio del servicio
        const precioConDescuento = userData.precioServicio * 0.6;
        userData.montoPagar = precioConDescuento * 0.3; // 30% del precio con descuento
        
        // Actualizar detalles de pago
        detallePagoDiv.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Servicio seleccionado:</span> 
                $${userData.precioServicio.toFixed(2)}
            </div>
            <div class="summary-item" style="color: var(--success-color);">
                <span class="summary-label">Descuento aplicado (40%):</span> 
                -$${(userData.precioServicio * 0.4).toFixed(2)}
            </div>
            <div class="summary-item">
                <span class="summary-label">Nuevo precio del servicio:</span> 
                $${(userData.precioServicio * 0.6).toFixed(2)}
            </div>
            <div class="summary-item">
                <span class="summary-label">Monto a pagar (30%):</span> 
                $${userData.montoPagar.toFixed(2)}
            </div>
        `;
        
        // Actualizar el texto del monto del 30%
        monto30Span.textContent = `$${userData.montoPagar.toFixed(2)} (equivalente al 30% del servicio con descuento)`;
        
        alert('¡Descuento aplicado correctamente!');
    } else {
        alert('Código de descuento no válido. Por favor, inténtalo de nuevo.');
    }
}

function confirmarPago() {
    // En una aplicación real, aquí se procesaría el pago
    // Por ahora, simplemente avanzamos a la página de confirmación
    
    // Mostrar resumen final
    let htmlFinal = `
        <h3>Resumen de tu reserva</h3>
        <div class="summary-item">
            <span class="summary-label">Nombre:</span> 
            ${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}
        </div>
        <div class="summary-item">
            <span class="summary-label">Servicio:</span> 
            ${userData.servicioSeleccionado}
        </div>`;
    
    // Agregar tipo de cabello si es mujer
    if (userData.genero === 'mujer' && userData.tipoCabello) {
        htmlFinal += `
        <div class="summary-item">
            <span class="summary-label">Tipo de cabello:</span> 
            ${userData.tipoCabello}
        </div>`;
    }
    
    htmlFinal += `
        <div class="summary-item">
            <span class="summary-label">Fecha y hora:</span> 
            ${userData.fechaCita} a las ${userData.horaCita}
        </div>
        <div class="summary-item">
            <span class="summary-label">Monto a pagar:</span> 
            $${userData.montoPagar.toFixed(2)}
        </div>
        ${userData.descuentoAplicado ? '<div class="summary-item" style="color: var(--success-color);"><span class="summary-label">Descuento aplicado:</span> 40%</div>' : ''}
    `;
    
    resumenFinalDiv.innerHTML = htmlFinal;
    
    mostrarPagina(6);
    
    // Enviar mensaje de WhatsApp automáticamente (simulado)
    // Descomenta la siguiente línea si quieres que se abra WhatsApp automáticamente
    // setTimeout(enviarWhatsApp, 1000);
}

function enviarWhatsApp() {
    let mensaje = `Hola, he realizado una reserva en D FLORENS & COLORS con los siguientes datos:
    
Nombre: ${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}
ID Cliente: ${userData.idCliente}
Servicio: ${userData.servicioSeleccionado}`;

    // Agregar tipo de cabello si es mujer
    if (userData.genero === 'mujer' && userData.tipoCabello) {
        mensaje += `\nTipo de cabello: ${userData.tipoCabello}`;
    }

    mensaje += `
Fecha: ${userData.fechaCita}
Hora: ${userData.horaCita}
Monto a pagar: $${userData.montoPagar.toFixed(2)}
${userData.descuentoAplicado ? 'Descuento aplicado: 40%' : ''}

Por favor, confirmar mi cita. Adjunto mi comprobante de pago.`;

    // Codificar el mensaje para URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Número de WhatsApp
    const numeroWhatsApp = '5544465633'; // Revisa que este sea el número correcto
    
    // Crear enlace de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
    
    // Abrir enlace en una nueva pestaña
    window.open(urlWhatsApp, '_blank');
}