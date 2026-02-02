// ============================= //
//    ACCESSIBILITY CONTROL      //
// ============================= //
// Archivo separado para manejar todas las funciones de accesibilidad
// Mantiene el código modular y fácil de mantener

document.addEventListener('DOMContentLoaded', () => {
  // ============================================
  //        ELEMENTOS DEL MODAL
  // ============================================
  const modal = document.getElementById('accessibilityModal');
  const accessibilityBtn = document.querySelector('.accessibility-btn');
  const closeBtn = document.querySelector('.accessibility-close-btn');
  
  // Elementos de control de tamaño
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeDisplay = document.querySelector('.font-size-display');
  const decreaseBtn = document.querySelector('.font-decrease');
  const increaseBtn = document.querySelector('.font-increase');
  const fontSizeResetBtn = document.querySelector('.font-size-reset');
  
  // Elementos de tipo de fuente
  const fontTypeButtons = document.querySelectorAll('.font-type-btn');
  const fontTypeResetBtn = document.querySelector('.font-type-reset');

  // ============================================
  //        GUARDAR Y CARGAR PREFERENCIAS
  // ============================================
  const loadPreferences = () => {
    const savedFontSize = localStorage.getItem('accessibility-font-size') || '100';
    const savedFontType = localStorage.getItem('accessibility-font-type') || 'concertone';
    
    // Aplicar tamaño guardado
    applyFontSize(parseInt(savedFontSize));
    fontSizeRange.value = savedFontSize;
    fontSizeDisplay.textContent = savedFontSize + '%';
    
    // Aplicar tipo de fuente guardado
    applyFontType(savedFontType);
    fontTypeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-font="${savedFontType}"]`).classList.add('active');
  };

  // ============================================
  //        FUNCIONES DE TAMAÑO DE LETRA
  // ============================================
  const applyFontSize = (percentage) => {
    const scale = percentage / 100;
    document.documentElement.style.fontSize = (16 * scale) + 'px';
    localStorage.setItem('accessibility-font-size', percentage);
  };

  const updateFontSizeDisplay = (value) => {
    fontSizeDisplay.textContent = value + '%';
    applyFontSize(parseInt(value));
  };

  // Escuchar cambios en el range
  if (fontSizeRange) {
    fontSizeRange.addEventListener('input', (e) => {
      updateFontSizeDisplay(e.target.value);
    });
  }

  // Botón de disminuir
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(fontSizeRange.value);
      let newValue = Math.max(80, currentValue - 10);
      fontSizeRange.value = newValue;
      updateFontSizeDisplay(newValue);
    });
  }

  // Botón de aumentar
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      let currentValue = parseInt(fontSizeRange.value);
      let newValue = Math.min(150, currentValue + 10);
      fontSizeRange.value = newValue;
      updateFontSizeDisplay(newValue);
    });
  }

  // Botón de restablecer tamaño
  if (fontSizeResetBtn) {
    fontSizeResetBtn.addEventListener('click', () => {
      fontSizeRange.value = '100';
      updateFontSizeDisplay('100');
    });
  }

  // ============================================
  //        FUNCIONES DE TIPO DE FUENTE
  // ============================================
  const fontFamilies = {
    'concertone': "'ConcertOne', sans-serif",
    'serif': 'Georgia, serif',
    'sans-serif': "'Segoe UI', sans-serif"
  };

  const applyFontType = (fontType) => {
    const fontFamily = fontFamilies[fontType] || fontFamilies['concertone'];
    document.documentElement.style.setProperty('--font-family', fontFamily);
    localStorage.setItem('accessibility-font-type', fontType);
  };

  // Escuchar clics en botones de tipo de fuente
  fontTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const fontType = btn.getAttribute('data-font');
      
      // Remover clase activa de todos los botones
      fontTypeButtons.forEach(b => b.classList.remove('active'));
      
      // Agregar clase activa al botón clickeado
      btn.classList.add('active');
      
      // Aplicar tipo de fuente
      applyFontType(fontType);
    });
  });

  // Botón de restablecer tipo de fuente
  if (fontTypeResetBtn) {
    fontTypeResetBtn.addEventListener('click', () => {
      fontTypeButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-font="concertone"]').classList.add('active');
      applyFontType('concertone');
    });
  }

  // ============================================
  //        CONTROL DEL MODAL
  // ============================================
  
  // Abrir modal
  if (accessibilityBtn) {
    accessibilityBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.add('show');
      }
    });
  }

  // Cerrar modal con botón X
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) {
        modal.classList.remove('show');
      }
    });
  }

  // Cerrar modal al presionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
      modal.classList.remove('show');
    }
  });

  // ============================================
  //        INICIALIZACIÓN
  // ============================================
  loadPreferences();
});
