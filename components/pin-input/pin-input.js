// PIN Input Component
export class PinInput extends HTMLElement {
  constructor() {
    super();
    this.digits = [];
    this.value = '';
    this.onComplete = null;
  }

  connectedCallback() {
    this.classList.add('pin-input-container');
    this.createDigitInputs();
    this.setupEventListeners();
    // Focus first input when component is mounted
    this.focus();
  }

  createDigitInputs() {
    for (let i = 0; i < 4; i++) {
      const input = document.createElement('input');
      input.type = 'password';
      input.maxLength = 1;
      input.className = 'pin-digit';
      input.dataset.index = i;
      input.pattern = '[0-9]';
      input.inputMode = 'numeric';
      this.digits.push(input);
      this.appendChild(input);
    }
  }

  setupEventListeners() {
    this.digits.forEach((input, index) => {
      // Handle digit input
      input.addEventListener('input', (e) => {
        // Only allow numbers
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value) {
          // Update internal value
          this.updateValue();
          
          // Move to next input
          if (index < 3) {
            this.digits[index + 1].focus();
          } else {
            // Last digit entered
            input.blur();
            if (this.onComplete) {
              this.onComplete(this.value);
            }
          }
        }
      });

      // Handle backspace
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!e.target.value && index > 0) {
            // Move to previous input
            this.digits[index - 1].focus();
          }
          this.updateValue();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          this.digits[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < 3) {
          e.preventDefault();
          this.digits[index + 1].focus();
        }
      });

      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
        if (pastedData) {
          const digits = pastedData.split('').slice(0, 4);
          digits.forEach((digit, i) => {
            if (i < 4) {
              this.digits[i].value = digit;
            }
          });
          this.updateValue();
          if (digits.length === 4 && this.onComplete) {
            this.onComplete(this.value);
          }
        }
      });
    });
  }

  updateValue() {
    this.value = this.digits.map(input => input.value).join('');
    this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
  }

  clear() {
    this.digits.forEach(input => input.value = '');
    this.value = '';
    this.digits[0].focus();
  }

  setError(show = true) {
    this.digits.forEach(input => {
      input.classList.toggle('error', show);
    });
  }

  focus() {
    this.digits[0].focus();
  }
}

// Register the custom element
customElements.define('pin-input', PinInput);