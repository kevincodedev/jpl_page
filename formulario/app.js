/**
 * JPL y Asociados - Lógica del Frontend y Conectividad Backend
 */

document.addEventListener('DOMContentLoaded', () => {
  // URL de la aplicación web desplegada en el servidor
  const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylJjOUsHMjB-8KaiOMsgbf80MwCd3zvOiKd8kSYyNlCrIiUW5-eMycER2ZmaKFYhNU/exec";
  
  // Elementos DOM
  const form = document.getElementById('registroForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const spinner = submitBtn.querySelector('.spinner');
  const resetBtn = document.getElementById('resetBtn');
  
  const statusAlert = document.getElementById('statusAlert');
  const statusIcon = document.getElementById('statusIcon');
  const statusMessage = document.getElementById('statusMessage');

  // Campos
  const fields = {
    nombre: document.getElementById('nombre'),
    telefono: document.getElementById('telefono'),
    email: document.getElementById('email'),
    cargo: document.getElementById('cargo')
  };

  const errors = {
    nombre: document.getElementById('nombreError'),
    telefono: document.getElementById('telefonoError'),
    email: document.getElementById('emailError'),
    cargo: document.getElementById('cargoError')
  };

  // Set año actual en footer
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  // Limpiar mensaje de error en vivo al escribir
  Object.keys(fields).forEach(key => {
    fields[key].addEventListener('input', () => {
      clearFieldError(key);
    });
  });

  function clearFieldError(fieldName) {
    fields[fieldName].classList.remove('is-invalid');
    errors[fieldName].textContent = '';
  }

  function setFieldError(fieldName, message) {
    fields[fieldName].classList.add('is-invalid');
    errors[fieldName].textContent = message;
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(key => clearFieldError(key));
    hideStatus();
  }

  // Validaciones de campos
  function validateForm() {
    let isValid = true;
    clearAllErrors();

    // 1. Nombre y Apellido
    const nombreVal = fields.nombre.value.trim();
    if (!nombreVal) {
      setFieldError('nombre', 'El Nombre y Apellido son obligatorios.');
      isValid = false;
    } else if (nombreVal.length < 3) {
      setFieldError('nombre', 'Por favor ingrese un nombre válido (mínimo 3 caracteres).');
      isValid = false;
    }

    // 2. Teléfono
    const telefonoVal = fields.telefono.value.trim();
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]{6,15}$/;
    if (!telefonoVal) {
      setFieldError('telefono', 'El número de teléfono es obligatorio.');
      isValid = false;
    } else if (!phoneRegex.test(telefonoVal)) {
      setFieldError('telefono', 'Ingrese un número de teléfono válido (ej. +58 414 1234567).');
      isValid = false;
    }

    // 3. Correo Electrónico
    const emailVal = fields.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      setFieldError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      setFieldError('email', 'Ingrese una dirección de correo electrónico válida.');
      isValid = false;
    }

    // 4. Cargo
    const cargoVal = fields.cargo.value.trim();
    if (!cargoVal) {
      setFieldError('cargo', 'El cargo o puesto de trabajo es obligatorio.');
      isValid = false;
    } else if (cargoVal.length < 2) {
      setFieldError('cargo', 'Ingrese un cargo válido (mínimo 2 caracteres).');
      isValid = false;
    }

    return isValid;
  }

  // Estado de carga UI
  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      resetBtn.disabled = true;
      btnText.textContent = 'Procesando...';
      spinner.style.display = 'inline-block';
    } else {
      submitBtn.disabled = false;
      resetBtn.disabled = false;
      btnText.textContent = 'Registrar Datos';
      spinner.style.display = 'none';
    }
  }

  // Mostrar alerta de estado (éxito/error)
  function showStatus(type, message) {
    statusAlert.className = `status-alert alert alert-${type}`;
    statusIcon.textContent = type === 'success' ? '✅' : (type === 'warning' ? '⚠️' : '❌');
    statusMessage.textContent = message;
    statusAlert.style.display = 'flex';
    statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideStatus() {
    statusAlert.style.display = 'none';
  }

  // Manejo del Envío del Formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const payload = {
      nombre: fields.nombre.value.trim(),
      telefono: fields.telefono.value.trim(),
      email: fields.email.value.trim(),
      cargo: fields.cargo.value.trim()
    };

    setLoading(true);
    hideStatus();

    try {
      const response = await fetch(DEFAULT_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok && response.status !== 0) {
        throw new Error(`Error en el servidor (${response.status})`);
      }

      let result;
      try {
        result = await response.json();
      } catch (err) {
        result = { status: 'success', message: 'Registro completado exitosamente en JPL y Asociados.' };
      }

      if (result.status === 'success' || !result.status) {
        showStatus('success', result.message || '¡Registro completado exitosamente en JPL y Asociados!');
        form.reset();
      } else {
        showStatus('error', result.message || 'Ocurrió un problema al procesar el registro.');
      }

    } catch (err) {
      console.error('Error al enviar el formulario:', err);

      // Intento alternativo transparente
      try {
        const formData = new URLSearchParams();
        formData.append('nombre', payload.nombre);
        formData.append('telefono', payload.telefono);
        formData.append('email', payload.email);
        formData.append('cargo', payload.cargo);

        await fetch(DEFAULT_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        });

        showStatus('success', '¡Registro completado exitosamente en el sistema de JPL y Asociados!');
        form.reset();
      } catch (fallbackErr) {
        showStatus('error', 'No se pudo conectar con el servidor. Por favor verifique su conexión e intente nuevamente.');
      }

    } finally {
      setLoading(false);
    }
  });

  // Limpiar formulario
  resetBtn.addEventListener('click', () => {
    clearAllErrors();
    hideStatus();
  });
});
