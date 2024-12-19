import { createModal } from '../modal/modal.js';
import { renderTotpList } from './totp-renderer.js';

export function openTotpModal() {
  const content = `
    <div class="modal-header">
      <h2>TOTP Management</h2>
      <button class="close-button">✕</button>
    </div>
    <div class="modal-body">
      <div class="settings-section">
        <div class="add-secret-form">
          <h3>Add New Secret</h3>
          <div class="form-content">
            <div class="input-group">
              <span class="input-icon" title="Service Name">👤</span>
              <input type="text" class="secret-name" placeholder="Service name (e.g., Google, GitHub)" />
            </div>
            <div class="input-group">
              <span class="input-icon" title="Secret Key">🔑</span>
              <input type="text" class="secret-key" placeholder="Base32 secret key" />
            </div>
            <div class="input-group">
              <span class="input-icon" title="URL Filters">🌐</span>
              <div class="tag-container">
                <input type="text" class="tag-input" placeholder="Type URL filter and press Enter" />
              </div>
            </div>
            <div class="form-actions">
              <button class="primary-button" id="addSecretButton">
                <span class="button-icon">💾</span> Add Secret
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-section">
        <h3>Saved Secrets</h3>
        <div id="secretList" class="secret-list"></div>
      </div>
    </div>
  `;

  const modal = createModal(content);

  // Load and display secrets
  chrome.storage.sync.get(['secrets'], (result) => {
    const secretList = modal.querySelector('#secretList');
    const secrets = result.secrets || [];
    
    secrets.forEach((secret, index) => {
      const div = document.createElement('div');
      div.classList.add('totp-item');
      div.innerHTML = `
        <div class="secret-fields">
          <div class="secret-header">
            <h4>${secret.name}</h4>
            <div class="secret-actions">
              <button class="icon-button edit-button" title="Edit">✏️</button>
              <button class="icon-button remove-button" title="Remove">🗑️</button>
            </div>
          </div>
          <div class="secret-content hidden">
            <div class="input-group">
              <span class="input-icon" title="Service Name">👤</span>
              <input type="text" class="secret-name" value="${secret.name}" placeholder="Service name" />
            </div>
            <div class="input-group">
              <span class="input-icon" title="Secret Key">🔑</span>
              <input type="text" class="secret-key" value="${secret.secret}" placeholder="Base32 secret key" />
            </div>
            <div class="input-group">
              <span class="input-icon" title="URL Filters">🌐</span>
              <div class="tag-container">
                ${(secret.urlFilters || []).map(filter => `
                  <span class="tag">
                    ${filter}
                    <span class="tag-remove" data-tag="${filter}">×</span>
                  </span>
                `).join('')}
                <input type="text" class="tag-input" placeholder="Type URL filter and press Enter" />
              </div>
            </div>
            <div class="form-actions">
              <button class="primary-button save-secret-button" title="Save changes">
                <span class="button-icon">💾</span> Save Changes
              </button>
            </div>
          </div>
        </div>
      `;

      // Set up tag system
      const tagContainer = div.querySelector('.tag-container');
      const tagInput = tagContainer.querySelector('.tag-input');
      const tags = new Set(secret.urlFilters || []);

      tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && tagInput.value.trim()) {
          e.preventDefault();
          const tag = tagInput.value.trim();
          if (!tags.has(tag)) {
            tags.add(tag);
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag');
            tagElement.innerHTML = `
              ${tag}
              <span class="tag-remove" data-tag="${tag}">×</span>
            `;
            tagContainer.insertBefore(tagElement, tagInput);
            tagInput.value = '';
          }
        }
      });

      tagContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-remove')) {
          const tag = e.target.dataset.tag;
          tags.delete(tag);
          e.target.parentElement.remove();
        }
      });

      // Set up edit button
      div.querySelector('.edit-button').addEventListener('click', () => {
        const content = div.querySelector('.secret-content');
        content.classList.toggle('hidden');
        const button = div.querySelector('.edit-button');
        button.textContent = content.classList.contains('hidden') ? '✏️' : '❌';
        button.title = content.classList.contains('hidden') ? 'Edit' : 'Cancel';
      });

      // Set up save button
      div.querySelector('.save-secret-button').addEventListener('click', () => {
        const name = div.querySelector('.secret-name').value.trim();
        const secret = div.querySelector('.secret-key').value.trim();
        const urlFilters = Array.from(tags);

        if (name && secret) {
          secrets[index] = { name, secret, urlFilters };
          chrome.storage.sync.set({ secrets }, () => {
            div.querySelector('.secret-header h4').textContent = name;
            div.querySelector('.secret-content').classList.add('hidden');
            div.querySelector('.edit-button').textContent = '✏️';
            div.querySelector('.edit-button').title = 'Edit';
            renderTotpList(secrets);
          });
        }
      });

      // Set up remove button
      div.querySelector('.remove-button').addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this secret?')) {
          secrets.splice(index, 1);
          chrome.storage.sync.set({ secrets }, () => {
            div.remove();
            renderTotpList(secrets);
          });
        }
      });

      secretList.appendChild(div);
    });
  });

  // Set up add new secret functionality
  const addSecretButton = modal.querySelector('#addSecretButton');
  const addForm = modal.querySelector('.add-secret-form');
  const tags = new Set();

  const tagInput = addForm.querySelector('.tag-input');
  tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && tagInput.value.trim()) {
      e.preventDefault();
      const tag = tagInput.value.trim();
      if (!tags.has(tag)) {
        tags.add(tag);
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.innerHTML = `
          ${tag}
          <span class="tag-remove" data-tag="${tag}">×</span>
        `;
        tagInput.parentElement.insertBefore(tagElement, tagInput);
        tagInput.value = '';
      }
    }
  });

  addForm.querySelector('.tag-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('tag-remove')) {
      const tag = e.target.dataset.tag;
      tags.delete(tag);
      e.target.parentElement.remove();
    }
  });

  addSecretButton.addEventListener('click', () => {
    const name = addForm.querySelector('.secret-name').value.trim();
    const secret = addForm.querySelector('.secret-key').value.trim();
    const urlFilters = Array.from(tags);

    if (name && secret) {
      chrome.storage.sync.get(['secrets'], (result) => {
        const secrets = result.secrets || [];
        secrets.push({ name, secret, urlFilters });
        chrome.storage.sync.set({ secrets }, () => {
          modal.classList.remove('show');
          setTimeout(() => {
            modal.remove();
            renderTotpList(secrets);
          }, 300);
        });
      });
    }
  });
}