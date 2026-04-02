/* =========================================================
   ОСНОВНОЙ JS-ФАЙЛ СТРАНИЦЫ
   Здесь два рабочих сценария:
   1) мобильное меню;
   2) модальное окно фотогалереи.
   ========================================================= */

// -------------------------
// Мобильное меню
// -------------------------
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');

if (header && menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// -------------------------
// Web3Forms
// -------------------------
const web3RequestForm = document.querySelector('[data-request-form]');

if (web3RequestForm) {
  const submitButton = web3RequestForm.querySelector('[data-request-submit]');
  const statusField = web3RequestForm.querySelector('[data-request-status]');

  web3RequestForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!web3RequestForm.reportValidity()) return;

    const formData = new FormData(web3RequestForm);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправляем...';
    }

    if (statusField) {
      statusField.textContent = '';
      statusField.classList.remove('is-success', 'is-error');
    }

    try {
      const response = await fetch(web3RequestForm.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Не удалось отправить заявку.');
      }

      web3RequestForm.reset();

      if (statusField) {
        statusField.textContent = 'Заявка отправлена. Мы скоро свяжемся с вами.';
        statusField.classList.add('is-success');
        statusField.textContent = 'Спасибо за обращение, мы свяжемся с вами в ближайшее время.';
      }
    } catch (error) {
      if (statusField) {
        statusField.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз чуть позже.';
        statusField.classList.add('is-error');
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить заявку';
      }
    }
  });
}

// -------------------------
// Лайтбокс фотогалереи
// -------------------------
const galleryButtons = document.querySelectorAll('.gallery-item, .works-gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.setAttribute('src', '');
  lightboxImage.setAttribute('alt', '');
  lightboxCaption.textContent = '';
}

function openLightbox(src, caption) {
  if (!lightbox) return;
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  lightboxImage.setAttribute('src', src);
  lightboxImage.setAttribute('alt', caption);
  lightboxCaption.textContent = caption;
}

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const src = button.dataset.full;
    const caption = button.dataset.caption || 'Изображение';
    openLightbox(src, caption);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
});

// -------------------------
// Слайдер отзывов
// -------------------------
const reviewsSlider = document.querySelector('[data-reviews-slider]');

if (reviewsSlider) {
  const reviewsViewport = reviewsSlider.querySelector('[data-reviews-viewport]');
  const reviewCards = reviewsSlider.querySelectorAll('.review-card');
  const prevButton = reviewsSlider.querySelector('[data-direction="prev"]');
  const nextButton = reviewsSlider.querySelector('[data-direction="next"]');

  const scrollReviews = (direction) => {
    if (!reviewsViewport || reviewCards.length === 0) return;

    const cardWidth = reviewCards[0].getBoundingClientRect().width;
    const gap = 20;
    reviewsViewport.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  if (prevButton) {
    prevButton.addEventListener('click', () => scrollReviews(-1));
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => scrollReviews(1));
  }
}

// -------------------------
// Форма запроса: WhatsApp / email
// -------------------------
const requestForm = document.querySelector('[data-request-form]');

if (requestForm) {
  const whatsappNumber = requestForm.dataset.whatsapp || '';
  const emailAddress = requestForm.dataset.email || '';
  const nameField = requestForm.querySelector('[name="name"]');
  const phoneField = requestForm.querySelector('[name="phone"]');
  const emailField = requestForm.querySelector('[name="email"]');
  const messageField = requestForm.querySelector('[name="message"]');
  const submitButtons = requestForm.querySelectorAll('[data-submit-channel]');

  const buildMessage = () => {
    const name = nameField?.value.trim() || 'Не указано';
    const phone = phoneField?.value.trim() || 'Не указано';
    const email = emailField?.value.trim() || 'Не указано';
    const message = messageField?.value.trim() || 'Без описания запроса';

    return [
      'Здравствуйте! Хочу оставить запрос.',
      '',
      `Имя: ${name}`,
      `Телефон / WhatsApp: ${phone}`,
      `Email: ${email}`,
      '',
      'Запрос:',
      message
    ].join('\n');
  };

  submitButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const channel = button.dataset.submitChannel;
      const message = buildMessage();

      if (channel === 'whatsapp' && whatsappNumber) {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }

      if (channel === 'email' && emailAddress) {
        const subject = encodeURIComponent('Запрос с сайта');
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
      }
    });
  });
}
