const WHATSAPP_PHONE = '212699945055';

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message.trim())}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function requestQuote(formation, formule = 'À définir') {
  openWhatsApp(`
Bonjour Najib Auto École 👋

Je souhaite demander un devis.

Formation : ${formation}
Formule : ${formule}

Pouvez-vous me communiquer :
- Le tarif
- Les documents nécessaires
- Les modalités d'inscription
- Les disponibilités

Merci.`);
}

function requestAppointment() {
  openWhatsApp(`
Bonjour Najib Auto École 👋

Je souhaite prendre rendez-vous pour échanger au sujet de vos formations.
Pouvez-vous me proposer vos prochaines disponibilités ?

Merci.`);
}

function requestRegistration() {
  openWhatsApp(`
Bonjour Najib Auto École 👋

Je souhaite m'inscrire à une formation.
Pouvez-vous m'indiquer les documents nécessaires et les prochaines disponibilités ?

Merci.`);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-whatsapp="appointment"]').forEach((button) => {
    button.addEventListener('click', requestAppointment);
  });
  document.querySelectorAll('[data-whatsapp="registration"]').forEach((button) => {
    button.addEventListener('click', requestRegistration);
  });
  document.querySelectorAll('[data-quote]').forEach((button) => {
    button.addEventListener('click', () => requestQuote(button.dataset.quote, button.dataset.formula || 'À définir'));
  });
  document.querySelectorAll('[data-whatsapp="general"]').forEach((button) => {
    button.addEventListener('click', () => openWhatsApp(`
Bonjour Najib Auto École 👋
Je souhaite obtenir des informations concernant vos formations.`));
  });

  const form = document.querySelector('#whatsapp-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const required = ['name', 'telephone', 'formation', 'subject', 'message'];
    let valid = true;

    required.forEach((name) => {
      const field = form.elements[name];
      const error = form.querySelector(`[data-error="${name}"]`);
      const empty = !String(data.get(name) || '').trim();
      field?.setAttribute('aria-invalid', String(empty));
      if (error) error.textContent = empty ? 'Ce champ est obligatoire.' : '';
      valid = valid && !empty;
    });

    const telephone = String(data.get('telephone') || '').trim();
    if (telephone && !/^[+\d\s().-]{8,20}$/.test(telephone)) {
      const error = form.querySelector('[data-error="telephone"]');
      if (error) error.textContent = 'Veuillez saisir un numéro valide.';
      form.elements.telephone.setAttribute('aria-invalid', 'true');
      valid = false;
    }

    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const offerImages = {
      'Permis B': 'assets/images/hero-taza.webp',
      'Permis C': 'assets/images/driving-lesson.webp',
      'Permis D': 'assets/images/hero-taza.webp',
      'Code de la route': 'assets/images/classroom.webp'
    };
    const imagePath = offerImages[data.get('formation')];
    const imageLine = imagePath ? `\nImage de l'offre : ${new URL(imagePath, window.location.href).href}` : '';

    openWhatsApp(`
Bonjour Najib Auto École 👋

Je souhaite vous contacter depuis votre site web.

Nom : ${data.get('name')}
Téléphone : ${telephone}
Formation : ${data.get('formation')}
Sujet : ${data.get('subject')}
${imageLine}

Message :
${data.get('message')}

Merci.`);
  });
});

window.requestQuote = requestQuote;
