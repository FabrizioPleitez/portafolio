import './styles/style.less'

// Inicialización del Portafolio
document.addEventListener('DOMContentLoaded', () => {
  initTheme()
  initMobileMenu()
  initNavigation()
  initSkillsAnimation()
  initContactForm()
})

/**
 * Gestión del Tema (Claro / Oscuro)
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle')
  const body = document.body

  // Comprobar preferencia guardada o preferencia del sistema
  const savedTheme = localStorage.getItem('portfolio-theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    body.classList.add('dark-mode')
  } else {
    body.classList.remove('dark-mode')
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode')
      const isDark = body.classList.contains('dark-mode')
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light')
    })
  }
}

/**
 * Menú Móvil
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn')
  const navMenu = document.getElementById('nav-menu')

  if (!menuBtn || !navMenu) return

  menuBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open')
    menuBtn.classList.toggle('active', isOpen)
    menuBtn.setAttribute('aria-expanded', String(isOpen))
  })

  // Cerrar menú al hacer clic en un enlace
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open')
      menuBtn.classList.remove('active')
      menuBtn.setAttribute('aria-expanded', 'false')
    })
  })
}

/**
 * Navegación y Enlaces Activos
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link')
  const sections = document.querySelectorAll('section[id]')

  // Scroll suave al hacer clic en enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href')
      if (targetId === '#') return

      const targetEl = document.querySelector(targetId)
      if (targetEl) {
        e.preventDefault()
        const headerOffset = 80
        const elementPosition = targetEl.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    })
  })

  // Observador para resaltar la sección activa en el menú
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id')
            navLinks.forEach(link => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active')
              } else {
                link.classList.remove('active')
              }
            })
          }
        })
      },
      {
        threshold: 0.35,
        rootMargin: '-70px 0px -40% 0px'
      }
    )

    sections.forEach(section => observer.observe(section))
  }
}

/**
 * Animación de Barras de Habilidades al Scroll
 */
function initSkillsAnimation() {
  const skillsSection = document.querySelector('#habilidades')
  if (!skillsSection) return

  const progressBars = skillsSection.querySelectorAll('.skill-progress')

  // Inicializar en 0 para disparar la animación al entrar en pantalla
  progressBars.forEach(bar => {
    const finalWidth = bar.getAttribute('data-progress') || bar.style.width
    bar.dataset.targetWidth = finalWidth
    bar.style.width = '0%'
  })

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            bar.style.width = bar.dataset.targetWidth
          })
          obs.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.25 }
  )

  observer.observe(skillsSection)
}

/**
 * Gestión del Formulario de Contacto y Toast
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form')
  const toast = document.getElementById('toast')

  if (!contactForm) return

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nameInput = document.getElementById('name')
    const emailInput = document.getElementById('email')
    const messageInput = document.getElementById('message')

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Campos requeridos', 'Por favor completa todos los campos obligatorios.')
      return
    }

    // Feedback de éxito
    showToast('Mensaje enviado', `Gracias ${nameInput.value.trim()}, responderé a tu consulta en breve.`)
    contactForm.reset()
  })

  function showToast(title, message) {
    if (!toast) return

    const titleEl = document.getElementById('toast-title')
    const msgEl = document.getElementById('toast-message')

    if (titleEl) titleEl.textContent = title
    if (msgEl) msgEl.textContent = message

    toast.classList.add('show')

    setTimeout(() => {
      toast.classList.remove('show')
    }, 4500)
  }
}
