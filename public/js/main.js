
//      HERO SLIDER LOGIC        //

let currentSlideIndex = 0;
function changeSlide(n) {
  showSlide(currentSlideIndex += n);
}
function currentSlide(n) {
  showSlide(currentSlideIndex = n);
}
function showSlide(n) {
  const slides = document.querySelectorAll('.slider-slide');
  const indicators = document.querySelectorAll('.indicator');
  if (n >= slides.length) {
    currentSlideIndex = 0;
  }
  if (n < 0) {
    currentSlideIndex = slides.length - 1;
  }
  const container = document.querySelector('.slider-container');
  container.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  indicators.forEach(indicator => indicator.classList.remove('active'));
  indicators[currentSlideIndex].classList.add('active');
}
// Auto-advance slider every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);
// Initialize slider on page load
document.addEventListener('DOMContentLoaded', () => {
  showSlide(currentSlideIndex);
  setupReservationForm();
});

//    RESERVATION MODAL LOGIC    //

let currentStep = 1;
const totalSteps = 3;
let datePicker = null;
// Open Modal
function openReservationModal() {
  const modal = document.getElementById('reservationModal');
  if (modal) {
    modal.classList.add('show');
    currentStep = 1;
    showStep(1);
  }
  if (!datePicker) {
    datePicker = flatpickr("#date", {
      inline: true,
      dateFormat: "Y-m-d",
      minDate: "today",
      locale: flatpickr.l10ns.es,
      disableMobile: true
    });
  }
}
// Close Modal
function closeReservationModal() {
  const modal = document.getElementById('reservationModal');
  const form = document.getElementById('reservationForm');
  
  // Check if form has any data filled
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const time = document.getElementById('time').value;
  const date = document.getElementById('date').value;
  
  const hasData = firstName || lastName || cedula || phone || email || time || date;
  
  if (hasData) {
    // Show confirmation dialog
    showConfirmationDialog(
      '¿Seguro desea cerrar la página?',
      '¿Estás seguro de que quieres cerrar? Se cancelará tu reserva y se perderán todos los datos ingresados.',
      () => {
        // User clicked "Sí"
        if (modal) {
          modal.classList.remove('show');
          resetForm();
        }
      },
      () => {
        // User clicked "No" - do nothing, dialog closes
      }
    );
  } else {
    // No data filled, just close the modal
    if (modal) {
      modal.classList.remove('show');
      resetForm();
    }
  }
}
// Show specific step
function showStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(el => el.classList.remove('active'));
  
  const stepEl = document.getElementById(`step${step}`);
  if (stepEl) {
    stepEl.classList.add('active');
  }
  // Update step indicator and titles
  const stepNumber = document.getElementById('stepNumber');
  const modalTitle = document.querySelector('.modal-header-title p');
  if (stepNumber) {
    stepNumber.textContent = step;
  }
  // Update titles based on step
  if (modalTitle) {
    if (step === 1) {
      modalTitle.textContent = 'Reservación - Datos Cliente';
    } else if (step === 2) {
      modalTitle.textContent = 'Reservación - Datos Reserva';
    } else if (step === 3) {
      modalTitle.textContent = 'Confirmación';
    }
  }
  // Update button visibility
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const submitBtn = document.getElementById('submitBtn');
  if (step === 1) {
    backBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  } else if (step === 2) {
    backBtn.style.display = 'inline-block';
    nextBtn.style.display = 'inline-block';
    submitBtn.style.display = 'none';
  } else if (step === 3) {
    backBtn.style.display = 'inline-block';
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'inline-block';
    generateSummary();
  }
}
// Next step
function nextStep() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}
// Previous step
function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// Confirmation Dialog
function showConfirmationDialog(title, message, onConfirm, onCancel) {
  const existingDialog = document.getElementById('confirmationModal');
  if (existingDialog) {
    existingDialog.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'confirmationModal';
  modal.className = 'confirmation-modal';
  modal.innerHTML = `
    <div class="confirmation-modal-content">
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirmation-buttons">
        <button class="btn-confirm btn-no" id="btnNo">No</button>
        <button class="btn-confirm btn-yes" id="btnYes">Sí</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const btnYes = document.getElementById('btnYes');
  const btnNo = document.getElementById('btnNo');

  btnYes.addEventListener('click', () => {
    modal.remove();
    onConfirm();
  });

  btnNo.addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onCancel) onCancel();
    }
  });
}

function showFormMessage(type, title, message,) {
  const modal = document.getElementById('formErrorModal');
  const box = document.getElementById('errorBox');
  const actions = document.getElementById('formActions');
  const closeBtn = document.getElementById('formCloseBtn');
  // Limpiar clases anteriores
  box.className = 'error-modal-content';
  actions.innerHTML = '';
  actions.classList.add('hidden');

  if (closeBtn) closeBtn.classList.remove('hidden');
  
  // Asignar tipo visual
  if (type === 'warning') box.classList.add('error-warning');
  if (type === 'format') box.classList.add('error-format');
  if (type === 'success') box.classList.add('error-success');

  document.getElementById('errorTitle').textContent = title;
  document.getElementById('errorMessage').innerHTML = message;

  modal.classList.remove('hidden');
  if (type === 'success') {
    if (closeBtn) closeBtn.classList.add('hidden');
    actions.classList.remove('hidden');
    actions.innerHTML = `
      <button class="btn-primary" id="goHomeBtn">
        Volver al inicio
      </button>
    `;
    document.getElementById('goHomeBtn').onclick = () => {
      window.location.href = '/index.html'; 
    };
  }else {
    closeBtn.classList.remove('hidden'); 
  }
}

function closeFormError() {
  document.getElementById('formErrorModal').classList.add('hidden');
}


function validateStep(step) {
  const form = document.getElementById('reservationForm');
  
  if (step === 1) {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos. <br>Por favor ingresa tu nombre.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    if (!lastName) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor ingresa tus apellidos.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    if (!cedula) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor ingresa tu cédula.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    if (!isValidCedula(cedula)) {
      showFormMessage(
        'format',
        'Ups… algo salió mal',
        'La cédula ingresada no es válida.<br>Por favor verifica que sea una cédula ecuatoriana correcta.'
      );
      return false;
    }

    if (!phone) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor ingresa tu teléfono.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }

    if (!isValidPhone(phone)) {
      showFormMessage(
        'format',
        ' Ups… algo salió mal',
        'El número de teléfono debe tener 10 dígitos y comenzar con 09.<br>Ejemplo: 0991234567'
      );
      return false;
    }

    if (!email) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor ingresa tu correo electrónico.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    if (!isValidEmail(email)) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que el correo electrónico no es válido.<br>Por favor ingresa un correo electrónico válido.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
  }
  
  if (step === 2) {
    const time = document.getElementById('time').value;
    const date = document.getElementById('date').value;
    
    if (!time) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor selecciona un horario.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    if (!date) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que olvidaste completar algunos campos.<br>Por favor selecciona una fecha.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
    
    // Validate that date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      showFormMessage(
        'warning',
        '⚠️ Revisa tus datos',
        'Parece que seleccionaste una fecha pasada.<br>Por favor selecciona una fecha futura.<br>Revísalos para que podamos continuar con tu reserva 💛'
      );
      return false;
    }
  }
  if (step === 3) {
    const terms = document.getElementById('terms');

    if (!terms.checked) {
      showFormMessage(
        'warning',
        'Un último paso...',
        'Para finalizar tu reserva, necesitamos que aceptes los términos y condiciones del restaurante 🩷'
      );
      return false;
    }
  }
  return true;
}

// Email validation
function isValidEmail(email) {
  // Usuario: letras, números y puntos, pero no termina en punto
  const emailRegex = /^[a-zA-Z0-9.]+[a-zA-Z0-9]@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateSummary() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const cedula = document.getElementById('cedula').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const people = document.getElementById('people').value;
  const time = document.getElementById('time').value;
  const location = document.querySelector('input[name="location"]:checked').value;
  const date = new Date(document.getElementById('date').value);
  const formattedDate = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const summaryContent = document.getElementById('summaryContent');
  /*summaryContent.innerHTML = `
    <div class="summary-item">
      <strong>Nombre:</strong> <span>${firstName} ${lastName}</span>
    </div>
    <div class="summary-item">
      <strong>Cédula:</strong> <span>${cedula}</span>
    </div>
    <div class="summary-item">
      <strong>Teléfono:</strong> <span>${phone}</span>
    </div>
    <div class="summary-item">
      <strong>Email:</strong> <span>${email}</span>
    </div>
    <div class="summary-item">
      <strong>Número de Personas:</strong> <span>${people}</span>
    </div>
    <div class="summary-item">
      <strong>Horario:</strong> <span>${time}</span>
    </div>
    <div class="summary-item">
      <strong>Ubicación:</strong> <span>${location}</span>
    </div>
    <div class="summary-item">
      <strong>Fecha:</strong> <span>${formattedDate}</span>
    </div>
  `;*/
  summaryContent.innerHTML = `
    <div class="summary-card">
      
      <div class="summary-grid">

        <div class="summary-field">
          <h4>Nombre Cliente:</h4>
          <p>${firstName} ${lastName}</p>
        </div>

        <div class="summary-field">
          <h4>Cédula Cliente:</h4>
          <p>${cedula}</p>
        </div>

        <div class="summary-field">
          <h4>N° Personas:</h4>
          <p>${people}</p>
        </div>

        <div class="summary-field">
          <h4>Teléfono:</h4>
          <p>${phone}</p>
        </div>

        <div class="summary-field summary-full">
          <h4>Fecha y Hora:</h4>
          <p>${time} — ${formattedDate}</p>
        </div>

      </div>

    </div>
  `;

}

// Reset form
function resetForm() {
  document.getElementById('reservationForm').reset();
  currentStep = 1;
  showStep(1);
}

function submitReservation() {
  if (!validateStep(3)) return;

  const firstName = document.getElementById('firstName').value;

  showFormMessage(
    'success',
    '¡Tu mesa está lista!',
    `¡Gracias ${firstName}! <br>
     Tu reserva se realizó con éxito. <br>
     ¡Te esperamos pronto en Sweet Crumbs! 🍪✨`
  );

  setTimeout(() => {
    closeReservationModal();
  }, 300);
}



/* Setup reservation form*/
document.addEventListener('DOMContentLoaded', () => {
  setupReservationForm();
});

function setupReservationForm() {
  const peopleInput = document.getElementById('people');
  const peopleValue = document.getElementById('peopleValue');

  if (!peopleInput || !peopleValue) return;

  // valor inicial
  peopleValue.textContent = peopleInput.value;

  peopleInput.addEventListener('input', () => {
    peopleValue.textContent = peopleInput.value;
  });
}



// Close modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  const modal = document.getElementById('reservationModal');
  if (event.target === modal) {
    closeReservationModal();
  }
});

// ============================= //
//    NAVIGATION ACTIVE STATE    //
// ============================= //

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    if (currentPage.includes(link.getAttribute('href'))) {
      link.classList.add('active');
    }
  });
});

// Validacion Cedula
function isValidCedula(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;

  const province = parseInt(cedula.substring(0, 2), 10);
  if (province < 1 || province > 24) return false;

  const digits = cedula.split('').map(Number);
  const verifier = digits[9];

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let value = digits[i];
    if (i % 2 === 0) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
  }

  const calculatedVerifier = (10 - (sum % 10)) % 10;
  return calculatedVerifier === verifier;
}

// validacion telefono 
function isValidPhone(phone) {
  return /^09\d{8}$/.test(phone);
}
