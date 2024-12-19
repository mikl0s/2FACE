// Modal component
export function createModal(content) {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <div class="modal-content">
      ${content}
    </div>
  `;
  
  document.body.appendChild(modal);
  // Trigger animation after modal is added to DOM
  requestAnimationFrame(() => modal.classList.add('show'));

  // Set up close button handler
  const closeButton = modal.querySelector('.modal-header .close-button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.remove(), 300); // Match transition duration
    });
  }

  return modal;
}