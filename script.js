// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Add scroll effect to navbar
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.backdropFilter = "blur(10px)"
    } else {
      navbar.style.background = "#fff"
      navbar.style.backdropFilter = "none"
    }
  })

  // Animate elements on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document
    .querySelectorAll(".feature-card, .service-card, .pricing-card, .benefit-card, .team-member")
    .forEach((el) => {
      observer.observe(el)
    })

  // Counter animation for stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-item h3")
    counters.forEach((counter) => {
      const target = Number.parseInt(counter.textContent.replace(/[^\d]/g, ""))
      const increment = target / 100
      let current = 0

      const updateCounter = () => {
        if (current < target) {
          current += increment
          counter.textContent = Math.ceil(current).toLocaleString() + counter.textContent.replace(/[\d,]/g, "")
          requestAnimationFrame(updateCounter)
        }
      }

      updateCounter()
    })
  }

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector(".stats")
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    statsObserver.observe(statsSection)
  }

  // Form validation and submission
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const requiredFields = form.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false
          field.style.borderColor = "#e74c3c"
        } else {
          field.style.borderColor = "#ddd"
        }
      })

      if (isValid) {
        // Show success message
        showNotification("Thank you! Your message has been sent successfully.", "success")
        form.reset()
      } else {
        showNotification("Please fill in all required fields.", "error")
      }
    })
  })

  // Notification system
  function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    // Add styles
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `

    if (type === "success") {
      notification.style.background = "#4CAF50"
    } else if (type === "error") {
      notification.style.background = "#e74c3c"
    } else {
      notification.style.background = "#3498db"
    }

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 5000)
  }

  // Chat functionality placeholder
  window.openChat = () => {
    showNotification("Chat feature will be available soon!", "info")
  }

  // Newsletter subscription
  const newsletterForms = document.querySelectorAll('form[id*="newsletter"]')
  newsletterForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = form.querySelector('input[type="email"]').value
      if (email) {
        showNotification("Thank you for subscribing to our newsletter!", "success")
        form.reset()
      }
    })
  })

  // Lazy loading for images
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))

  // Search functionality for station locator
  const searchInput = document.getElementById("locationSearch")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      // This would typically connect to a real search API
      console.log("Searching for:", query)
    })
  }

  // Filter functionality
  const filters = document.querySelectorAll("#chargerType, #availability, #pricing")
  filters.forEach((filter) => {
    filter.addEventListener("change", function () {
      // This would typically filter the station results
      console.log("Filter changed:", this.id, this.value)
    })
  })
})

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Export functions for use in other scripts
window.EcoChargeUtils = {
  formatCurrency,
  formatNumber,
  debounce,
}
