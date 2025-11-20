const galleryContainer = document.getElementById("gallery-container");
const pageNumbers = document.getElementById("page-numbers");
const firstBtn = document.getElementById("first-page");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const lastBtn = document.getElementById("last-page");

const itemsPerPage = 2;
let currentPage = 1;
let galleryData = [];
let filteredGalleryData = [];


function renderGalleryPage(page) {
  galleryContainer.innerHTML = `
    <div class="gallery-loader">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
  `;

  setTimeout(() => {
    filteredGalleryData = galleryData;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const items = filteredGalleryData.slice(start, end);

    galleryContainer.innerHTML = ""; // limpiamos el loader

    items.forEach((item, index) => {
      const globalIndex = start + index; // Índice global en el array completo
      const div = document.createElement("div");
      div.className = "gallery-item";
      div.setAttribute("data-index", globalIndex); // Guardar índice global
      div.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" />
        <div class="gallery-overlay">
          <div class="gallery-info">
            <h3>${item.titulo}</h3>
          </div>
        </div>
      `;
      galleryContainer.appendChild(div);

      // Animate gallery items with stagger
      setTimeout(() => {
        div.classList.add("visible");
      }, index * 100);
    });

    renderPagination(filteredGalleryData.length);

    initGalleryModal();
  }, 300); // delay opcional


}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  pageNumbers.innerHTML = "";

  // Mostrar página actual
  const currentSpan = document.createElement("span");
  currentSpan.classList.add("active");
  currentSpan.textContent = currentPage;
  currentSpan.style.cursor = "pointer";
  currentSpan.style.margin = "0 5px";
  currentSpan.addEventListener("click", () => {
    currentPage = currentPage;
    renderGalleryPage(currentPage);
  });
  pageNumbers.appendChild(currentSpan);

  // Mostrar separador "..."
  if (currentPage < totalPages) {
    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.style.cursor = "default";
    ellipsis.style.margin = "0 5px";
    ellipsis.style.pointerEvents = "none";
    pageNumbers.appendChild(ellipsis);

    // Mostrar última página
    const lastSpan = document.createElement("span");
    lastSpan.textContent = totalPages;
    lastSpan.style.cursor = "pointer";
    lastSpan.style.margin = "0 5px";
    lastSpan.addEventListener("click", () => {
      currentPage = totalPages;
      renderGalleryPage(currentPage);
    });
    pageNumbers.appendChild(lastSpan);
  }

  // Actualizar estado de botones
  firstBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastBtn.disabled = currentPage === totalPages;
}

firstBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage = 1;
    renderGalleryPage(currentPage);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderGalleryPage(currentPage);
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    renderGalleryPage(currentPage);
  }
});

lastBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(galleryData.length / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage = totalPages;
    renderGalleryPage(currentPage);
  }
});

// Load JSON
fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    galleryData = data;
    renderGalleryPage(currentPage);
  })
  .catch((err) => {
    console.error("Error al cargar la galería:", err);
    galleryContainer.innerHTML = "<p>Error al cargar las imágenes.</p>";
  });

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinksItems = document.querySelectorAll(".nav-links a");
  let scrollPosition = 0;

  // Function to prevent scroll
  function disableScroll() {
    scrollPosition = window.pageYOffset;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = "100%";
  }

  // Function to enable scroll
  function enableScroll() {
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("position");
    document.body.style.removeProperty("top");
    document.body.style.removeProperty("width");
    window.scrollTo(0, scrollPosition);
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("active");

      // Prevent scroll when menu is open
      if (navLinks.classList.contains("active")) {
        disableScroll();
        hamburger.style.display = "block";
      } else {
        enableScroll();
        // Reset display for responsive behavior
        if (window.innerWidth > 768) {
          hamburger.style.display = "none";
        }
      }
    });
  }

  // Close menu when clicking on a link
  navLinksItems.forEach(link => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        enableScroll();
        // Reset hamburger display
        if (window.innerWidth > 768) {
          hamburger.style.display = "none";
        }
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      enableScroll();
      // Reset hamburger display
      if (window.innerWidth > 768) {
        hamburger.style.display = "none";
      }
    }
  });

  let lastScroll = 0;
  let autoScrolling = false;
  const SCROLL_TIMEOUT = 800; // Tiempo (ms) durante el cual consideramos que es scroll automático

  const hideHeader = () => {
    const header = document.querySelector("header");
    header.classList.add("header-hidden");
  };

  const showHeader = () => {
    const header = document.querySelector("header");
    header.classList.remove("header-hidden");
  };

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;
    const SCROLL_THRESHOLD = 100; // Cantidad de scroll antes de ocultar el header

    if (autoScrolling) {
      // Mientras el scroll sea automático, el header permanece oculto.
      hideHeader();
    } else {
      // Comportamiento normal: si baja, ocultar; si sube, mostrar
      if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
        // Solo ocultar si scrolleamos hacia abajo Y hemos pasado el threshold
        hideHeader();
      } else if (currentScroll < lastScroll || currentScroll <= SCROLL_THRESHOLD) {
        // Mostrar si scrolleamos hacia arriba O estamos arriba del todo
        showHeader();
      }
    }

    lastScroll = currentScroll;
  });

  const navItems = document.querySelectorAll(".nav-links a");
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Ocultar menú hamburguesa
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");

      // Forzamos que el header se oculte y activamos la bandera de scroll automático.
      hideHeader();
      autoScrolling = true;

      // Desactivamos la bandera después de un tiempo (ajustable según la duración del scroll automático)
      setTimeout(() => {
        autoScrolling = false;
      }, SCROLL_TIMEOUT);
    });
  });

  // Header scroll effect
  const header = document.querySelector("header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Back to top button
  const backToTopBtn = document.querySelector(".back-to-top");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Hero Carousel
  initCarousel();

  // Testimonials Slider
  initTestimonialSlider();

  // Gallery Filter
  // initGalleryFilter();

  // Gallery Modal
  // initGalleryModal();

  // Contact Form
  initContactForm();

  // Animation on scroll
  initScrollAnimation();

  // NEW ANIMATIONS AND FEATURES

  // Scroll Progress Indicator
  initScrollProgress();



  // Reveal Animations
  initRevealAnimations();

  // Parallax Effect
  initParallax();

  // 3D Card Effect
  init3DCards();

  // Building Animation
  initBuildingAnimation();

  // Construction Site Background
  initConstructionBackground();

  // Blueprint Animation
  initBlueprintAnimation();

  // Before/After Slider
  initBeforeAfterSlider();
});

// Hero Carousel
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel .prev");
  const nextBtn = document.querySelector(".carousel .next");

  let currentSlide = 0;

  if (slides.length === 0) return;

  // Show slide
  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));

    slides[index].classList.add("active");
  }

  // Go to specific slide
  function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Auto slide
  let slideInterval = setInterval(nextSlide, 5000);

  // Pause on hover
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    carouselContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  }
}

// Testimonials Slider
function initTestimonialSlider() {
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.querySelector(".testimonial-btn.prev");
  const nextBtn = document.querySelector(".testimonial-btn.next");

  let currentSlide = 0;
  let userInteracted = false;
  let autoSlideTimeout;

  if (slides.length === 0) return;

  // Show slide with smooth transition
  function showSlide(index) {
    slides.forEach((slide) => {
      slide.style.transition = "opacity 3s ease-in-out"; // Increased transition duration
      slide.classList.remove("active");
    });
    slides[index].classList.add("active");
  }

  // Go to specific slide  
  function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Auto slide if no user interaction
  function startAutoSlide() {
    clearTimeout(autoSlideTimeout);
    if (!userInteracted) {
      autoSlideTimeout = setTimeout(() => {
        nextSlide();
        startAutoSlide();
      }, 12000); // Increased delay to 5 seconds
    }
  }

  // Event listeners
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      userInteracted = true;
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      userInteracted = true;
      nextSlide();
    });
  }

  // Auto slide with longer interval
  let slideInterval = setInterval(nextSlide, 12000); // Increased interval to 8 seconds

  // Pause on hover
  const testimonialContainer = document.querySelector(".testimonials-slider");
  if (testimonialContainer) {
    testimonialContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
      clearTimeout(autoSlideTimeout);
    });

    testimonialContainer.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 8000); // Increased interval to 8 seconds
      startAutoSlide();
    });
  }

  // Start auto slide initially
  startAutoSlide();
}

// Gallery Filter
// function initGalleryFilter() {
//   const filterBtns = document.querySelectorAll(".filter-btn");

//   if (filterBtns.length === 0) return;

//   filterBtns.forEach((btn) => {
//     btn.addEventListener("click", function () {
//       filterBtns.forEach((b) => b.classList.remove("active"));
//       this.classList.add("active");

//       currentFilter = this.getAttribute("data-filter");
//       currentPage = 1; // resetear a la primera página al filtrar

//       showFilteredGallery();
//     });
//   });
// }

// function showFilteredGallery() {
//   const galleryGrid = document.querySelector(".gallery-grid");
//   const pageNumbers = document.getElementById("page-numbers");
//   const prevBtn = document.getElementById("prev-page");
//   const nextBtn = document.getElementById("next-page");

//   // Mostrar spinner
//   galleryGrid.innerHTML =
//     '<div class="gallery-loader"><i class="fas fa-spinner fa-spin"></i></div>';

//   // Simula un pequeño retraso como si cargara
//   setTimeout(() => {
//     // Filtrar por categoría
//     const filteredItems =
//       currentFilter === "all"
//         ? galleryData
//         : galleryData.filter((item) => item.category === currentFilter);

//     // Calcular paginación
//     const start = (currentPage - 1) * itemsPerPage;
//     const end = start + itemsPerPage;
//     const paginatedItems = filteredItems.slice(start, end);

//     // Renderizar
//     galleryGrid.innerHTML = paginatedItems
//       .map(
//         (item) => `
//       <div class="gallery-item ${item.category}">
//         <img src="${item.image}" alt="${item.alt}" />
//         <div class="gallery-overlay">
//           <div class="gallery-info">
//             <h3>${item.title}</h3>
//             <p>${item.subtitle}</p>
//           </div>
//         </div>
//       </div>
//     `
//       )
//       .join("");

//     // Renderizar paginación
//     const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
//     pageNumbers.innerHTML = "";

//     for (let i = 1; i <= totalPages; i++) {
//       const span = document.createElement("span");
//       span.textContent = i;
//       if (i === currentPage) span.classList.add("active");
//       span.addEventListener("click", () => {
//         currentPage = i;
//         showFilteredGallery();
//       });
//       pageNumbers.appendChild(span);
//     }

//     prevBtn.disabled = currentPage === 1;
//     nextBtn.disabled = currentPage === totalPages;
//   }, 300); // opcional: añadir un poco de carga
// }

// Gallery Modal with Zoom
function initGalleryModal() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const modal = document.querySelector(".gallery-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.querySelector(".modal-caption");
  const closeModal = document.querySelector(".close-modal");
  const prevBtn = document.querySelector(".modal-nav.prev");
  const nextBtn = document.querySelector(".modal-nav.next");
  const imageContainer = document.querySelector(".image-container");
  const currentImageSpan = document.getElementById("current-image");
  const totalImagesSpan = document.getElementById("total-images");
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const zoomResetBtn = document.getElementById("zoom-reset");
  const modalOverlay = document.querySelector(".modal-overlay");

  let currentIndex = 0;
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  if (galleryItems.length === 0 || !modal) return;

  // Update total images counter
  if (totalImagesSpan) {
    totalImagesSpan.textContent = filteredGalleryData.length;
  }

  // Open modal on gallery item click
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Obtener el índice global desde el atributo data-index
      currentIndex = parseInt(this.getAttribute("data-index"));
      showImage(currentIndex);
      openModal();
    });
  });

  function openModal() {
    modal.style.display = "block";
    setTimeout(() => modal.classList.add("active"), 10);
    document.body.style.overflow = "hidden";

    // Ocultar el header cuando se abre el modal
    const header = document.querySelector("header");
    if (header) {
      header.style.transform = "translateY(-100%)";
      header.style.transition = "transform 0.3s ease";
    }

    resetZoom();
  }

  function closeModalFunc() {
    modal.classList.remove("active");

    // Mostrar el header cuando se cierra el modal
    const header = document.querySelector("header");
    if (header) {
      header.style.transform = "translateY(0)";
    }

    setTimeout(() => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }, 300);
  }

  function showImage(index) {
    const item = filteredGalleryData[index];
    const img = item.src;
    const caption = item.titulo;

    modalImg.src = img;
    modalCaption.textContent = caption;

    // Update counter
    if (currentImageSpan) {
      currentImageSpan.textContent = index + 1;
    }

    resetZoom();
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % filteredGalleryData.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + filteredGalleryData.length) % filteredGalleryData.length;
    showImage(currentIndex);
  }

  // Zoom functionality
  function updateTransform() {
    modalImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function resetZoom() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  function zoomIn() {
    scale = Math.min(scale + 0.5, 5);
    updateTransform();
  }

  function zoomOut() {
    scale = Math.max(scale - 0.5, 1);
    if (scale === 1) {
      translateX = 0;
      translateY = 0;
    }
    updateTransform();
  }

  // Pan functionality
  function startDrag(e) {
    if (scale <= 1) return;

    isDragging = true;
    imageContainer.classList.add("dragging");

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    startX = clientX - translateX;
    startY = clientY - translateY;
  }

  function drag(e) {
    if (!isDragging || scale <= 1) return;

    e.preventDefault();

    const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

    translateX = clientX - startX;
    translateY = clientY - startY;

    updateTransform();
  }

  function endDrag() {
    isDragging = false;
    imageContainer.classList.remove("dragging");
  }

  // Mouse wheel zoom
  function handleWheel(e) {
    if (!modal.classList.contains("active")) return;

    e.preventDefault();

    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }

  // Touch pinch zoom
  let initialDistance = 0;
  let initialScale = 1;

  function getTouchDistance(e) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialDistance = getTouchDistance(e);
      initialScale = scale;
    } else if (e.touches.length === 1) {
      startDrag(e);
    }
  }

  function handleTouchMove(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e);
      scale = Math.max(1, Math.min(5, initialScale * (currentDistance / initialDistance)));
      updateTransform();
    } else if (e.touches.length === 1) {
      drag(e);
    }
  }

  // Event listeners
  if (closeModal) {
    closeModal.addEventListener("click", closeModalFunc);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeModalFunc);
  }

  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);

  if (zoomInBtn) zoomInBtn.addEventListener("click", zoomIn);
  if (zoomOutBtn) zoomOutBtn.addEventListener("click", zoomOut);
  if (zoomResetBtn) zoomResetBtn.addEventListener("click", resetZoom);

  // Pan events
  if (imageContainer) {
    imageContainer.addEventListener("mousedown", startDrag);
    imageContainer.addEventListener("mousemove", drag);
    imageContainer.addEventListener("mouseup", endDrag);
    imageContainer.addEventListener("mouseleave", endDrag);

    // Touch events
    imageContainer.addEventListener("touchstart", handleTouchStart, { passive: false });
    imageContainer.addEventListener("touchmove", handleTouchMove, { passive: false });
    imageContainer.addEventListener("touchend", endDrag);
  }

  // Wheel zoom
  if (modal) {
    modal.addEventListener("wheel", handleWheel, { passive: false });
  }

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (modal.style.display === "block" && modal.classList.contains("active")) {
      switch(e.key) {
        case "Escape":
          closeModalFunc();
          break;
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "0":
          resetZoom();
          break;
      }
    }
  });
}

// Contact Form
function initContactForm() {
  document
    .getElementById("contact-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("nombre");
      const emailInput = document.getElementById("email");
      const phoneInput = document.getElementById("telefono");
      const serviceInput = document.getElementById("servicio");
      const messageInput = document.getElementById("mensaje");

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const service = serviceInput.value;
      const message = messageInput.value.trim();

      const submitButton = document.querySelector(
        "#contact-form button[type='submit']"
      );
      submitButton.disabled = true;
      submitButton.innerText = "Enviando...";

      // Limpiar estilos de errores anteriores
      [nameInput, emailInput, phoneInput, messageInput].forEach((input) => {
        input.classList.remove("input-error");
      });

      // Validación de campos obligatorios
      const camposInvalidos = [];

      if (!name) camposInvalidos.push(nameInput);
      if (!email) camposInvalidos.push(emailInput);
      if (!phone) camposInvalidos.push(phoneInput);
      if (!message) camposInvalidos.push(messageInput);

      if (camposInvalidos.length > 0) {
        camposInvalidos.forEach((input) => input.classList.add("input-error"));
        Swal.fire({
          icon: "warning",
          title: "Campos obligatorios",
          text: "Por favor, completa todos los campos marcados.",
        });
        submitButton.disabled = false;
        submitButton.innerText = "Enviar";
        return;
      }

      // Validación de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        emailInput.classList.add("input-error");
        Swal.fire({
          icon: "error",
          title: "Email inválido",
          text: "Por favor, introduce un email con formato válido.",
        });
        submitButton.disabled = false;
        submitButton.innerText = "Enviar";
        return;
      }

      // Validación de dominio del email
      const validTLDs = [
        "com",
        "org",
        "net",
        "edu",
        "gov",
        "es",
        "info",
        "co",
        "io",
        "dev",
        "me",
        "biz",
        "store",
        "online",
        "tech",
        "ai",
        "app",
        "us",
        "uk",
      ];
      const emailParts = email.split(".");
      const tld = emailParts[emailParts.length - 1].toLowerCase();

      if (!validTLDs.includes(tld)) {
        emailInput.classList.add("input-error");
        Swal.fire({
          icon: "error",
          title: "Dominio no válido",
          text: `El dominio .${tld} no parece válido. Revisa tu email.`,
        });
        submitButton.disabled = false;
        submitButton.innerText = "Enviar";
        return;
      }

      // Envío con EmailJS
      const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        service: service,
        message: message,
      };

      emailjs
        .send("service_jo60j3d", "template_5kd66ci", templateParams)
        .then(function () {
          Swal.fire({
            icon: "success",
            title: "¡Mensaje enviado!",
            text: "Gracias por contactar con nosotros. Te responderemos pronto.",
          });
          document.getElementById("contact-form").reset();
          submitButton.disabled = false;
          submitButton.innerText = "Enviar";
        })
        .catch(function (error) {
          console.error("Error al enviar el mensaje:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar el mensaje. Inténtalo más tarde.",
          });
          submitButton.disabled = false;
          submitButton.innerText = "Enviar";
        });
    });
}

// Animation on scroll
function initScrollAnimation() {
  const elements = document.querySelectorAll("[data-aos]");

  if (elements.length === 0) return;

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.getAttribute("data-aos-delay") || 0;

        setTimeout(() => {
          element.classList.add("animated");
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }, delay);

        observer.unobserve(element);
      }
    });
  }, options);

  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });

  // Animate sections on scroll
  const sections = document.querySelectorAll(".section");

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;
          section.classList.add("animated");
          observer.unobserve(section);
        }
      });
    },
    {
      root: null,
      rootMargin: "-100px",
      threshold: 0.1,
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// NEW FUNCTIONS

// Scroll Progress Indicator
function initScrollProgress() {
  const scrollProgress = document.createElement("div");
  scrollProgress.className = "scroll-progress";
  document.body.appendChild(scrollProgress);

  window.addEventListener("scroll", function () {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    scrollProgress.style.width = scrollPercentage + "%";
  });
}

// Reveal Animations
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "-50px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // Add reveal classes to elements that don't have them yet
  const sections = document.querySelectorAll(".section:not(.reveal)");
  sections.forEach((section, index) => {
    section.classList.add("reveal");
    section.classList.add(index % 2 === 0 ? "reveal-left" : "reveal-right");
    revealObserver.observe(section);
  });

  const sectionHeaders = document.querySelectorAll(
    ".section-header:not(.reveal)"
  );
  sectionHeaders.forEach((header) => {
    header.classList.add("reveal");
    header.classList.add("reveal-up");
    revealObserver.observe(header);
  });
}

// Parallax Effect
function initParallax() {
  // Create a new parallax section after the introduction
  const introSection = document.getElementById("introduccion");
  if (!introSection) return;

  const parallaxSection = document.createElement("section");
  parallaxSection.className = "parallax-section";
  parallaxSection.innerHTML = `
        <div class="parallax-bg" style="background-image: url('images/IMG-20251120-WA0025.jpg'); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: 1;"></div>
        <div class="parallax-content reveal reveal-up" style="position: relative; z-index: 2; color: #fff; text-align: center; padding: 100px 20px;">
            <h2 style="font-size: 2.5em; margin-bottom: 20px;">Transformo espacios con profesionalidad</h2>
            <p style="font-size: 1.2em; margin-bottom: 30px;">Como experto en pladur con más de 10 años de experiencia, convierto tus ideas en realidad, creando espacios funcionales y estéticos que superan tus expectativas.</p>
            <a href="#contacto" class="btn" style="display: inline-block; padding: 15px 30px; background-color: #e74c3c; color: #fff; text-decoration: none; border-radius: 5px;">Solicita información</a>
        </div>
    `;

  // Add base styles to parallax section
  parallaxSection.style.position = "relative";
  parallaxSection.style.height = "500px";
  parallaxSection.style.overflow = "hidden";
  parallaxSection.style.display = "flex";
  parallaxSection.style.alignItems = "center";
  parallaxSection.style.justifyContent = "center";

  introSection.parentNode.insertBefore(
    parallaxSection,
    introSection.nextSibling
  );

  // Animate parallax content on scroll
  const parallaxContent = document.querySelector(".parallax-content");
  const parallaxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          parallaxObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 100px 0px"
    }
  );

  if (parallaxContent) {
    parallaxObserver.observe(parallaxContent);
  }

  // Parallax effect on scroll
  let ticking = false;

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const parallaxBgs = document.querySelectorAll(".parallax-bg");
        parallaxBgs.forEach((bg) => {
          const scrollPosition = window.pageYOffset;
          const sectionTop = bg.parentElement.offsetTop;
          const sectionHeight = bg.parentElement.offsetHeight;
          const windowHeight = window.innerHeight;

          if (
            scrollPosition > sectionTop - windowHeight &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            const yPos = (scrollPosition - sectionTop) * 0.15;
            bg.style.transform = `translate3d(0, ${yPos}px, 0)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  });
}

// 3D Card Effect
function init3DCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.classList.add("card-3d-container");

    const cardInner = document.createElement("div");
    cardInner.className = "card-3d";

    // Move the card's content to the inner div
    while (card.firstChild) {
      cardInner.appendChild(card.firstChild);
    }

    card.appendChild(cardInner);

    // 3D effect on mouse move
    card.addEventListener("mousemove", function (e) {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      const angleY = (e.clientX - cardCenterX) / 10;
      const angleX = (cardCenterY - e.clientY) / 10;

      cardInner.style.transform = `rotateY(${angleY}deg) rotateX(${angleX}deg)`;
    });

    // Reset on mouse leave
    card.addEventListener("mouseleave", function () {
      cardInner.style.transform = "rotateY(0) rotateX(0)";
    });
  });
}
// Service Cards Animation
function initServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  if (serviceCards.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = Array.from(serviceCards).indexOf(card);

          // Add staggered delay
          setTimeout(() => {
            card.classList.add("animated");
            card.style.animationDelay = `${index * 0.1}s`;
          }, index * 100);

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  serviceCards.forEach((card) => {
    observer.observe(card);
  });
}

// Call this function in the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  initServiceCards();
});
// Building Animation
function initBuildingAnimation() {
  // Create a building animation section before the introduction section
  const introSection = document.getElementById("introduccion");
  if (!introSection) return;

  const buildingAnimation = document.createElement("div");
  buildingAnimation.style.margin = "0";
  buildingAnimation.className = "building-animation";
  buildingAnimation.innerHTML = `
        <div class="building-layer" style="height: 20%; background-color: #e74c3c;"></div>
        <div class="building-layer" style="height: 20%; background-color: #3498db;"></div>
        <div class="building-layer" style="height: 20%; background-color: #2ecc71;"></div>
        <div class="building-layer" style="height: 20%; background-color: #f39c12;"></div>
        <div class="building-layer" style="height: 20%; background-color: #9b59b6;"></div>
    `;

  introSection.parentNode.insertBefore(buildingAnimation, introSection);

  // Animate building layers on scroll
  const buildingLayers = document.querySelectorAll(".building-layer");

  const buildingObserver = new IntersectionObserver(
    (entries, observer) => {
      if (entries[0].isIntersecting) {
        buildingLayers.forEach((layer, index) => {
          setTimeout(() => {
            layer.style.animation = `buildFromLeft 0.8s ease forwards`;
          }, index * 200);
        });
        observer.unobserve(entries[0].target);
      }
    },
    {
      threshold: 0.5,
    }
  );

  buildingObserver.observe(buildingAnimation);
}

// Construction Site Background
function initConstructionBackground() {
  const constructionBg = document.createElement("div");
  constructionBg.className = "construction-bg";

  // Create a blueprint-style grid background
  constructionBg.innerHTML = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2c3e50" stroke-width="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    `;

  document.body.appendChild(constructionBg);
}

// Blueprint Animation
function initBlueprintAnimation() {
  // Create a blueprint section after the gallery
  const gallerySection = document.getElementById("galeria");
  if (!gallerySection) return;

  const blueprintSection = document.createElement("section");
  blueprintSection.className = "section blueprint-section";
  blueprintSection.innerHTML = `
        <div class="container">
            <div class="section-header">
                <h2 style='color: beige'>Diseño y planificación</h2>
                <div class="separator"></div>
            </div>
            <div class="blueprint-grid"></div>
            <div class="blueprint-content">
                <div class="row">
                    <div class="col-md-6">
                        <svg width="100%" height="300" viewBox="0 0 300 300" class="blueprint-element" xmlns="http://www.w3.org/2000/svg">

  <!-- Contorno exterior -->
  <rect x="10" y="10" width="280" height="280" fill="none" stroke="#2c3e50" stroke-width="3" />

  <!-- Paredes internas horizontales -->
  <line x1="10" y1="110" x2="290" y2="110" stroke="#2c3e50" stroke-width="2" />
  <line x1="10" y1="190" x2="290" y2="190" stroke="#2c3e50" stroke-width="2" />

  <!-- Paredes internas verticales -->
  <line x1="100" y1="10" x2="100" y2="290" stroke="#2c3e50" stroke-width="2" />
  <line x1="200" y1="10" x2="200" y2="290" stroke="#2c3e50" stroke-width="2" />

  <!-- División central tipo pasillo -->
  <line x1="150" y1="110" x2="150" y2="190" stroke="#2c3e50" stroke-width="1" stroke-dasharray="4" />

  <!-- Puerta abatible superior izquierda -->
  <path d="M100 90 A20 20 0 0 1 120 110" stroke="#e74c3c" fill="none" stroke-width="1.5" />
  <line x1="100" y1="110" x2="100" y2="90" stroke="#e74c3c" stroke-width="1.5" />

  <!-- Puerta abatible superior derecha -->
  <path d="M200 90 A20 20 0 0 0 180 110" stroke="#e74c3c" fill="none" stroke-width="1.5" />
  <line x1="200" y1="110" x2="200" y2="90" stroke="#e74c3c" stroke-width="1.5" />

  <!-- Puerta lateral derecha -->
  <path d="M290 190 A20 20 0 0 0 270 210" stroke="#e74c3c" fill="none" stroke-width="1.5" />
  <line x1="290" y1="190" x2="270" y2="190" stroke="#e74c3c" stroke-width="1.5" />

  <!-- Puerta inferior izquierda -->
  <path d="M10 190 A20 20 0 0 1 30 210" stroke="#e74c3c" fill="none" stroke-width="1.5" />
  <line x1="10" y1="190" x2="30" y2="190" stroke="#e74c3c" stroke-width="1.5" />

  <!-- Simulación de ventanas (finas líneas azules) -->
  <line x1="140" y1="10" x2="160" y2="10" stroke="#3498db" stroke-width="1.2" />
  <line x1="10" y1="140" x2="10" y2="160" stroke="#3498db" stroke-width="1.2" />
  <line x1="290" y1="140" x2="290" y2="160" stroke="#3498db" stroke-width="1.2" />
  <line x1="140" y1="290" x2="160" y2="290" stroke="#3498db" stroke-width="1.2" />

</svg>


                    </div>
                    <div class="col-md-6">
                        <h3 style='color: beige'>Planificación detallada</h3>
                        <p style='color: beige'>Cada proyecto comienza con un diseño meticuloso y una planificación detallada. Nuestro equipo técnico analiza tus necesidades y crea soluciones personalizadas que optimizan el espacio y cumplen con tus objetivos.</p>
                        <div class="progress-container">
                            <div class="progress-bar" data-width="90"></div>
                        </div>
                        <p style='color: beige'>90% de nuestros clientes destacan nuestra precisión en la planificación</p>
                    </div>
                </div>
            </div>
        </div>
    `;

  gallerySection.parentNode.insertBefore(
    blueprintSection,
    gallerySection.nextSibling
  );

  // Animate blueprint elements
  const blueprintElements = document.querySelectorAll(".blueprint-element");

  const blueprintObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  blueprintElements.forEach((element) => {
    blueprintObserver.observe(element);
  });

  // Animate progress bars
  const progressBars = document.querySelectorAll(".progress-bar");

  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute("data-width") + "%";
          entry.target.style.width = width;
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  progressBars.forEach((bar) => {
    progressObserver.observe(bar);
  });
}

// Before/After Slider
function initBeforeAfterSlider() {
  // Create a before/after section after the testimonials
  const testimonialsSection = document.getElementById("testimonios");
  if (!testimonialsSection) return;

  const beforeAfterSection = document.createElement("section");
  beforeAfterSection.className = "section";
  beforeAfterSection.innerHTML = `
        <div class="container">
            <div class="section-header">
                <h2>Antes y después</h2>
                <div class="separator"></div>
            </div>
            <p class="text-center mb-5">Desliza para ver la transformación de nuestros proyectos</p>
            <br>
            <div class="before-after-container">
                <img src="images/IMG-20251120-WA0034.jpg" alt="Después" class="after-image">
                <img src="images/IMG-20251120-WA0032.jpg" alt="Antes" class="before-image">

                <div class="slider-handle">
                    <div class="slider-button">
                        <i class="fas fa-arrows-alt-h"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

  testimonialsSection.parentNode.insertBefore(
    beforeAfterSection,
    testimonialsSection.nextSibling
  );

  // Slider functionality
  const beforeAfterContainer = document.querySelector(
    ".before-after-container"
  );
  const sliderHandle = document.querySelector(".slider-handle");
  const beforeImage = document.querySelector(".before-image");

  if (!beforeAfterContainer || !sliderHandle || !beforeImage) return;

  let isDragging = false;

  // Update slider position
  function updateSliderPosition(x) {
    const containerRect = beforeAfterContainer.getBoundingClientRect();
    let position = ((x - containerRect.left) / containerRect.width) * 100;

    // Constrain position between 0 and 100
    position = Math.max(0, Math.min(100, position));

    sliderHandle.style.left = position + "%";
    beforeImage.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
  }

  // Prevent text selection
  function preventSelection(e) {
    e.preventDefault();
  }

  // Mouse events
  sliderHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    preventSelection(e);
    beforeAfterContainer.classList.add("dragging");
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      preventSelection(e);
      updateSliderPosition(e.clientX);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    beforeAfterContainer.classList.remove("dragging");
  });

  // Touch events
  sliderHandle.addEventListener("touchstart", (e) => {
    isDragging = true;
    preventSelection(e);
    beforeAfterContainer.classList.add("dragging");
  });

  document.addEventListener("touchmove", (e) => {
    if (isDragging) {
      preventSelection(e);
      updateSliderPosition(e.touches[0].clientX);
    }
  });

  document.addEventListener("touchend", () => {
    isDragging = false;
    beforeAfterContainer.classList.remove("dragging");
  });
}

// function initConstructionAnimation() {
//   // Create a container for construction elements
//   const constructionContainer = document.createElement("div");
//   constructionContainer.className = "construction-container";
//   document.body.appendChild(constructionContainer);

//   // Track scroll position
//   let lastScrollTop = 0;
//   let scrollDirection = "down";

//   window.addEventListener("scroll", function () {
//     const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//     // Determine scroll direction
//     scrollDirection = scrollTop > lastScrollTop ? "down" : "up";
//     lastScrollTop = scrollTop;

//     // Create construction elements based on scroll
//     if (Math.random() < 0.1) {
//       // Adjust frequency of elements
//       createConstructionElement();
//     }
//   });

//   function createConstructionElement() {
//     // Choose random construction element type
//     const elementTypes = ["brick", "tool", "dust"];
//     const type = elementTypes[Math.floor(Math.random() * elementTypes.length)];

//     // Create element
//     const element = document.createElement("div");
//     element.className = `construction-element ${type}`;

//     // Random position on screen
//     const posX = Math.random() * window.innerWidth;
//     const posY = scrollDirection === "down" ? window.innerHeight : 0;

//     element.style.left = posX + "px";
//     element.style.top = posY + "px";

//     // Set content based on type
//     if (type === "brick") {
//       element.style.width = Math.random() * 30 + 20 + "px";
//       element.style.height = Math.random() * 10 + 10 + "px";
//       element.style.backgroundColor =
//         "#" + Math.floor(Math.random() * 16777215).toString(16);
//       element.style.border = "1px solid #333";
//     } else if (type === "tool") {
//       const tools = [
//         "fa-hammer",
//         "fa-screwdriver",
//         "fa-paint-roller",
//         "fa-tape",
//         "fa-ruler",
//         "fa-hard-hat",
//       ];
//       const randomTool = tools[Math.floor(Math.random() * tools.length)];
//       element.innerHTML = `<i class="fas ${randomTool}"></i>`;
//       element.style.color =
//         "#" + Math.floor(Math.random() * 16777215).toString(16);
//       element.style.fontSize = Math.random() * 20 + 15 + "px";
//     } else if (type === "dust") {
//       element.style.width = Math.random() * 5 + 2 + "px";
//       element.style.height = Math.random() * 5 + 2 + "px";
//       element.style.backgroundColor = "rgba(210, 180, 140, 0.7)";
//       element.style.borderRadius = "50%";
//     }

//     // Add to container
//     constructionContainer.appendChild(element);

//     // Animate based on scroll direction
//     const targetY =
//       scrollDirection === "down" ? -100 : window.innerHeight + 100;
//     const duration = Math.random() * 2000 + 1000;

//     element.animate(
//       [
//         { transform: `translate(0, 0) rotate(0deg)` },
//         {
//           transform: `translate(${
//             Math.random() * 200 - 100
//           }px, ${targetY}px) rotate(${Math.random() * 360}deg)`,
//         },
//       ],
//       {
//         duration: duration,
//         easing: "ease-out",
//       }
//     );

//     // Remove after animation
//     setTimeout(() => {
//       constructionContainer.removeChild(element);
//     }, duration);
//   }

//   // Create initial elements
//   for (let i = 0; i < 10; i++) {
//     createConstructionElement();
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   // Back to top button
//   const backToTopButton = document.getElementById("back-to-top");

//   window.addEventListener("scroll", () => {
//     if (window.pageYOffset > 300) {
//       backToTopButton.style.display = "block";
//     } else {
//       backToTopButton.style.display = "none";
//     }
//   });

//   backToTopButton.addEventListener("click", (e) => {
//     e.preventDefault();
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   });

//   // Scroll Animation
//   initScrollAnimation();

//   // Cursor Follower removed

//   // Brick building animation while scrolling

//   // Particle Effect removed

//   // Tool Animation removed
// });

// Scroll Animation
function initScrollAnimation() {
  const elements = document.querySelectorAll(".scroll-animation");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
}

// Brick building animation while scrolling
function initBrickBuildingAnimation() {
  const sections = document.querySelectorAll(".section");

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target;

          // Create brick elements for the section
          createBricks(section);

          // Add a class to start the animation
          setTimeout(() => {
            section.classList.add("built");
          }, 100);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sections.forEach((section) => {
    // Add the building class to prepare for animation
    section.classList.add("building");
    sectionObserver.observe(section);
  });

  function createBricks(section) {
    // Only create bricks if they don't exist yet
    if (section.querySelector(".brick-container")) return;

    const brickContainer = document.createElement("div");
    brickContainer.className = "brick-container";

    // Number of bricks based on section size
    const sectionHeight = section.offsetHeight;
    const sectionWidth = section.offsetWidth;

    const brickSize = 40; // Size of each brick
    const rows = Math.ceil(sectionHeight / brickSize);
    const cols = Math.ceil(sectionWidth / brickSize);

    // Limit the number of bricks to avoid performance issues
    const maxBricks = 100;
    const totalBricks = Math.min(rows * cols, maxBricks);

    for (let i = 0; i < totalBricks; i++) {
      const brick = document.createElement("div");
      brick.className = "brick";

      // Random position within the section
      const row = Math.floor(i / cols);
      const col = i % cols;

      brick.style.top = row * brickSize + "px";
      brick.style.left = col * brickSize + "px";

      // Random delay for animation
      const delay = Math.random() * 1.5;
      brick.style.animationDelay = delay + "s";

      brickContainer.appendChild(brick);
    }

    // Insert at the beginning of the section
    section.insertBefore(brickContainer, section.firstChild);
  }
}

// Scroll Animation
function initScrollAnimation() {
  const elements = document.querySelectorAll(".scroll-animation");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  });

  elements.forEach((element) => {
    observer.observe(element);
  });
}
