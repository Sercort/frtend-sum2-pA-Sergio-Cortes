document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.reserve-form');
  const destino = document.getElementById('destino');
  const paqueteRadios = Array.from(document.querySelectorAll('input[name="paquete"]'));
  const fechaSalida = document.getElementById('fecha-salida');
  const fechaRegreso = document.getElementById('fecha-regreso');
  const duracion = document.getElementById('duracion');
  const puerto = document.getElementById('puerto');
  const puertoOtro = document.getElementById('puerto-otro');
  const mayoresCheckbox = document.getElementById('mayores-checkbox');
  const mayoresCantidad = document.getElementById('mayores-cantidad');
  const nombre = document.getElementById('nombre');
  const documento = document.getElementById('documento');
  const nacimiento = document.getElementById('nacimiento');
  const nacionalidad = document.getElementById('nacionalidad');
  const email = document.getElementById('email');
  const telefono = document.getElementById('telefono');
  const especialesCheckbox = document.getElementById('especiales-checkbox');
  const especialesTexto = document.getElementById('especiales-texto');
  const habitacionRadios = Array.from(document.querySelectorAll('input[name="habitacion"]'));
  const regimen = document.getElementById('regimen');
  const presupuesto = document.getElementById('presupuesto');
  const origen = document.getElementById('origen');
  const comentarios = document.getElementById('comentarios');
  const counter = document.getElementById('counter');
  const terminos = document.querySelector('input[name="terminos"]');
  const privacidad = document.querySelector('input[name="privacidad"]');

  function getContainer(element) {
    return element.closest('.form-group') || element.closest('.fieldset-group') || element.closest('fieldset') || element.parentElement;
  }

  function clearValidationStates() {
    form.querySelectorAll('.campo-error, .campo-ok').forEach(el => el.classList.remove('campo-error', 'campo-ok'));
    form.querySelectorAll('.error-text').forEach(el => el.remove());
  }

  function setFieldState(element, valid, message) {
    const container = getContainer(element);
    if (!container) {
      return valid;
    }

    const existingError = container.querySelector('.error-text');
    if (existingError) {
      existingError.remove();
    }

    if (!valid) {
      container.classList.add('campo-error');
      container.classList.remove('campo-ok');
      if (element instanceof HTMLElement) {
        element.classList.add('campo-error');
        element.classList.remove('campo-ok');
      }
      const error = document.createElement('div');
      error.className = 'error-text';
      error.textContent = message;
      container.appendChild(error);
      return false;
    }

    container.classList.remove('campo-error');
    container.classList.add('campo-ok');
    if (element instanceof HTMLElement) {
      element.classList.remove('campo-error');
      element.classList.add('campo-ok');
    }
    return true;
  }

  function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function validateDestino() {
    const valid = destino.value.trim() !== '';
    return setFieldState(destino, valid, 'Seleccione un destino válido.');
  }

  function validatePaquete() {
    const valid = paqueteRadios.some(radio => radio.checked);
    return setFieldState(paqueteRadios[0], valid, 'Seleccione un tipo de paquete.');
  }

  function validateFechaSalida() {
    const salida = parseDate(fechaSalida.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7);

    const valid = salida instanceof Date && salida >= minDate;
    return setFieldState(fechaSalida, valid, 'La fecha de salida debe ser al menos 7 días desde hoy.');
  }

  function validateFechaRegreso() {
    const salida = parseDate(fechaSalida.value);
    const regreso = parseDate(fechaRegreso.value);
    const valid = regreso instanceof Date && salida instanceof Date && regreso > salida;
    return setFieldState(fechaRegreso, valid, 'La fecha de regreso debe ser posterior a la fecha de salida.');
  }

  function validateDuracion() {
    const valid = duracion.value.trim() !== '';
    return setFieldState(duracion, valid, 'Seleccione la duración aproximada.');
  }

  function validatePuertoOtro() {
    if (puerto.value !== 'otro') {
      return setFieldState(puerto, true);
    }

    const valid = puertoOtro.value.trim().length > 0;
    return setFieldState(puertoOtro, valid, 'Especifique la ciudad de salida.');
  }

  function validateAdultos() {
    const value = adultos.value.trim();
    const number = Number(value);
    const valid = /^[0-9]+$/.test(value) && Number.isInteger(number) && number >= 1 && number <= 10;
    return setFieldState(adultos, valid, 'La cantidad de adultos debe ser un número entero entre 1 y 10.');
  }

  function validateMenores() {
    const adultosValue = Number(adultos.value.trim()) || 0;
    const menoresValue = Number(menores.value.trim()) || 0;
    const valid = /^[0-9]+$/.test(menores.value.trim()) && menoresValue >= 0 && menoresValue <= 8 && menoresValue <= adultosValue * 2;
    return setFieldState(menores, valid, 'Cantidad de menores inválida. Máximo 8 y no puede superar el doble de adultos.');
  }

  function validateNombre() {
    const value = nombre.value.trim();
    const valid = /^[A-Za-zÀ-ÿ\s]{5,80}$/.test(value);
    return setFieldState(nombre, valid, 'Ingrese un nombre válido de 5 a 80 letras y espacios.');
  }

  function validateDocumento() {
    const value = documento.value.trim();
    const valid = /^[A-Za-z0-9]{7,12}$/.test(value);
    return setFieldState(documento, valid, 'Ingrese un pasaporte o DNI válido de 7 a 12 caracteres.');
  }

  function validateNacimiento() {
    const fecha = parseDate(nacimiento.value);
    if (!(fecha instanceof Date)) {
      return setFieldState(nacimiento, false, 'Ingrese la fecha de nacimiento.');
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad -= 1;
    }

    const valid = edad >= 18;
    return setFieldState(nacimiento, valid, 'El pasajero debe ser mayor de 18 años.');
  }

  function validateNacionalidad() {
    const valid = nacionalidad.value.trim() !== '';
    return setFieldState(nacionalidad, valid, 'Seleccione la nacionalidad.');
  }

  function validateEmail() {
    const value = email.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return setFieldState(email, valid, 'Ingrese un correo electrónico válido.');
  }

  function validateTelefono() {
    const value = telefono.value.trim();
    const digits = value.replace(/[^0-9]/g, '');
    const valid = /^[+\d][0-9\s-]+$/.test(value) && digits.length >= 8;
    return setFieldState(telefono, valid, 'Ingrese un teléfono válido con al menos 8 dígitos.');
  }

  function validateEspeciales() {
    if (!especialesCheckbox.checked) {
      return setFieldState(especialesTexto, true);
    }
    const valid = especialesTexto.value.trim().length > 0;
    return setFieldState(especialesTexto, valid, 'Describa las necesidades especiales.');
  }

  function validateHabitacion() {
    const valid = habitacionRadios.some(radio => radio.checked);
    return setFieldState(habitacionRadios[0], valid, 'Seleccione un tipo de habitación.');
  }

  function validateRegimen() {
    const valid = regimen.value.trim() !== '';
    return setFieldState(regimen, valid, 'Seleccione un régimen de comidas.');
  }

  function validatePresupuesto() {
    const valid = presupuesto.value.trim() !== '';
    return setFieldState(presupuesto, valid, 'Seleccione un presupuesto estimado.');
  }

  function validateOrigen() {
    const valid = origen.value.trim() !== '';
    return setFieldState(origen, valid, 'Seleccione cómo se enteró de ViajarYa.');
  }

  function validateComentarios() {
    const length = comentarios.value.trim().length;
    const valid = length <= 300;
    return setFieldState(comentarios, valid, 'El comentario no puede superar los 300 caracteres.');
  }

  function validateTerminos() {
    const valid = terminos.checked;
    return setFieldState(terminos, valid, 'Debe aceptar los Términos y Condiciones.');
  }

  function validatePrivacidad() {
    const valid = privacidad.checked;
    return setFieldState(privacidad, valid, 'Debe aceptar la Política de Privacidad.');
  }

  function updateVisibility() {
    document.getElementById('puerto-otro-group').classList.toggle('hidden', puerto.value !== 'otro');
    document.getElementById('mayores-cantidad-group').classList.toggle('hidden', !mayoresCheckbox.checked);
    document.getElementById('especiales-group').classList.toggle('hidden', !especialesCheckbox.checked);
  }

  function updateCounter() {
    const remaining = 300 - comentarios.value.length;
    counter.textContent = remaining;
  }

  function showConfirmation() {
    clearValidationStates();
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmacion';
    confirmation.innerHTML = `
      <section class="confirmacion-card">
        <h2>¡Reserva enviada!</h2>
        <p>Tu solicitud ha sido recibida. Nuestro equipo de ViajarYa revisará los datos y te contactará a la brevedad.</p>
        <button id="volver-form" class="btn">Volver al formulario</button>
      </section>
    `;

    document.body.appendChild(confirmation);
    form.classList.add('hidden');

    document.getElementById('volver-form').addEventListener('click', () => {
      confirmation.remove();
      form.classList.remove('hidden');
      form.reset();
      clearValidationStates();
      updateVisibility();
      updateCounter();
    });
  }

  function validateForm(event) {
    event.preventDefault();

    const validations = [
      validateDestino(),
      validatePaquete(),
      validateFechaSalida(),
      validateFechaRegreso(),
      validateDuracion(),
      validatePuertoOtro(),
      validateAdultos(),
      validateMenores(),
      validateNombre(),
      validateDocumento(),
      validateNacimiento(),
      validateNacionalidad(),
      validateEmail(),
      validateTelefono(),
      validateEspeciales(),
      validateHabitacion(),
      validateRegimen(),
      validatePresupuesto(),
      validateOrigen(),
      validateComentarios(),
      validateTerminos(),
      validatePrivacidad(),
    ];

    const allValid = validations.every(Boolean);
    if (allValid) {
      showConfirmation();
      return;
    }

    const firstError = form.querySelector('.campo-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  destino.addEventListener('change', validateDestino);
  paqueteRadios.forEach(radio => radio.addEventListener('change', validatePaquete));
  fechaSalida.addEventListener('change', () => {
    validateFechaSalida();
    validateFechaRegreso();
  });
  fechaRegreso.addEventListener('change', validateFechaRegreso);
  duracion.addEventListener('change', validateDuracion);
  puerto.addEventListener('change', () => {
    updateVisibility();
    validatePuertoOtro();
  });
  puertoOtro.addEventListener('input', validatePuertoOtro);
  adultos.addEventListener('input', () => {
    validateAdultos();
    validateMenores();
  });
  menores.addEventListener('input', validateMenores);
  mayoresCheckbox.addEventListener('change', () => {
    updateVisibility();
    validateMenores();
  });
  nombre.addEventListener('input', validateNombre);
  documento.addEventListener('input', validateDocumento);
  nacimiento.addEventListener('change', validateNacimiento);
  nacionalidad.addEventListener('change', validateNacionalidad);
  email.addEventListener('input', validateEmail);
  telefono.addEventListener('input', validateTelefono);
  especialesCheckbox.addEventListener('change', () => {
    updateVisibility();
    validateEspeciales();
  });
  especialesTexto.addEventListener('input', validateEspeciales);
  habitacionRadios.forEach(radio => radio.addEventListener('change', validateHabitacion));
  regimen.addEventListener('change', validateRegimen);
  presupuesto.addEventListener('change', validatePresupuesto);
  origen.addEventListener('change', validateOrigen);
  comentarios.addEventListener('input', () => {
    updateCounter();
    validateComentarios();
  });
  terminos.addEventListener('change', validateTerminos);
  privacidad.addEventListener('change', validatePrivacidad);

  form.addEventListener('submit', validateForm);
  form.addEventListener('reset', () => {
    setTimeout(() => {
      clearValidationStates();
      updateVisibility();
      updateCounter();
    }, 0);
  });

  updateVisibility();
  updateCounter();
});
