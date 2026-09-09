document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  toggle?.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  document.querySelectorAll('#navigation a').forEach(link => link.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  const tabs = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const isCourses = document.body.classList.contains('page-formations');
  function filterCards(filter) {
    tabs.forEach(tab => {
      const active = tab.dataset.filter === filter;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => {
      card.hidden = filter === 'all' ? (isCourses && card.dataset.category === 'code') : card.dataset.category !== filter;
    });
  }
  tabs.forEach(tab => tab.addEventListener('click', () => filterCards(tab.dataset.filter)));
  const initialFilter = document.querySelector('[data-filter].active')?.dataset.filter;
  if (initialFilter) filterCards(initialFilter);
  function showHash() {
    const hash = location.hash.slice(1);
    const card = document.getElementById(hash);
    if (card?.dataset.category && isCourses) {
      filterCards(card.dataset.category);
      card.scrollIntoView({ block: 'center' });
    }
  }
  showHash();
  window.addEventListener('hashchange', showHash);
  const detail = document.querySelector('#detail-dialog');
  document.querySelectorAll('[data-details]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.details;
    const title = category === 'code' ? 'Code de la route' : `Permis ${category}`;
    const card = button.closest('article');
    detail.querySelector('#detail-title').textContent = [title, button.dataset.formula].filter(Boolean).join(' — ');
    const content = detail.querySelector('#detail-content');
    content.replaceChildren();
    const description = card.querySelector('.description') || card.querySelector('p');
    if (description) {
      const copy = description.cloneNode(true);
      copy.className = 'dialog-copy';
      content.append(copy);
    }
    const list = card.querySelector('.checks');
    if (list) content.append(list.cloneNode(true));
    const price = document.createElement('p');
    price.className = 'dialog-price';
    price.textContent = card.querySelector('.price-line b, .pricing-amount b')?.textContent || '1 500 DH';
    content.append(price);
    const contact = document.createElement('button');
    contact.className = 'btn full';
    contact.textContent = 'Choisir cette formation →';
    contact.addEventListener('click', () => window.requestQuote(title, button.dataset.formula || 'À définir'));
    content.append(contact);
    detail.showModal();
  }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  const galleryDialog = document.querySelector('#gallery-dialog');
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  let galleryIndex = 0;
  let visible = [];
  function showPhoto(index) {
    if (!visible.length) return;
    galleryIndex = (index + visible.length) % visible.length;
    const original = visible[galleryIndex].querySelector('.photo');
    galleryDialog.querySelector('.gallery-enlarged').replaceChildren(original.cloneNode(true));
    galleryDialog.setAttribute('aria-label', original.getAttribute('aria-label'));
  }
  galleryItems.forEach(item => item.addEventListener('click', () => {
    visible = galleryItems.filter(photo => !photo.hidden);
    showPhoto(visible.indexOf(item));
    galleryDialog.showModal();
  }));
  galleryDialog.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(galleryIndex - 1));
  galleryDialog.querySelector('.gallery-next').addEventListener('click', () => showPhoto(galleryIndex + 1));
  galleryDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(galleryIndex - 1);
    if (event.key === 'ArrowRight') showPhoto(galleryIndex + 1);
  });
  document.querySelector('#contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = form.elements.telephone;
    phone.setCustomValidity(/^[+\d\s().-]{8,20}$/.test(phone.value.trim()) ? '' : 'Veuillez saisir un numéro de téléphone valide.');
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    window.openWhatsApp(`Bonjour Najib Auto École,\n\nNom : ${data.get('name')}\nTéléphone : ${data.get('telephone')}\nEmail : ${data.get('email') || 'Non renseigné'}\nSujet : ${data.get('subject')}\n\n${data.get('message')}`);
  });
  document.querySelector('#telephone')?.addEventListener('input', event => event.target.setCustomValidity(''));
});
