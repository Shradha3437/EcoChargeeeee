
// Partner Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  // ROI Calculator
  const utilizationSlider = document.getElementById("utilization")
  const utilizationValue = document.getElementById("utilizationValue")

  if (utilizationSlider && utilizationValue) {
    utilizationSlider.addEventListener("input", function () {
      utilizationValue.textContent = this.value + "%"
    })
  }

  // ROI Calculation Function
  window.calculateROI = () => {
    const location = document.getElementById("location").value
    const stations = Number.parseInt(document.getElementById("stations").value)
    const utilization = Number.parseInt(document.getElementById("utilization").value)

    if (!location || !stations || !utilization) {
      showNotification("Please fill in all fields to calculate ROI.", "error")
      return
    }

    const baseRevenue = {
      retail: 150,
      highway: 200,
      workplace: 100,
      residential: 80,
    }

    const dailyRevenue = (baseRevenue[location] || 100) * stations * (utilization / 100)
    const monthlyRevenue = dailyRevenue * 30
    const annualRevenue = monthlyRevenue * 12

    const initialInvestment = {
      retail: 200000,
      highway: 300000,
      workplace: 150000,
      residential: 100000,
    }

    const investment = (initialInvestment[location] || 150000) * stations
    const operatingCosts = monthlyRevenue * 0.3
    const netMonthlyProfit = monthlyRevenue - operatingCosts
    const annualProfit = netMonthlyProfit * 12
    const roi = ((annualProfit / investment) * 100).toFixed(1)
    const paybackMonths = Math.ceil(investment / netMonthlyProfit)

    const resultsDiv = document.getElementById("roiResults")
    resultsDiv.innerHTML = `
      <div class="result-item">
        <div class="result-label">Monthly Revenue</div>
        <div class="result-value">${monthlyRevenue.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Monthly Profit</div>
        <div class="result-value">${netMonthlyProfit.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Annual ROI</div>
        <div class="result-value">${roi}%</div>
      </div>
      <div class="result-item">
        <div class="result-label">Payback Period</div>
        <div class="result-value">${paybackMonths} months</div>
      </div>
      <div class="result-item">
        <div class="result-label">Initial Investment</div>
        <div class="result-value">${investment.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div>
      </div>
    `
    resultsDiv.classList.add("fade-in")
  }

  // Partner form submission
  const partnerForm = document.getElementById("partnerForm")
  if (partnerForm) {
    partnerForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const data = Object.fromEntries(formData)

      const requiredFields = ["firstName", "lastName", "email", "phone", "partnershipType", "locationCity"]
      let isValid = true

      requiredFields.forEach((field) => {
        const input = document.getElementById(field)
        if (!input.value.trim()) {
          isValid = false
          // input.style.borderColor = "#e74c3c"
        } else {
          input.style.borderColor = "#ddd"
        }
      })

      const emailInput = document.getElementById("email")
      const emailValue = emailInput.value.trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        isValid = false
        emailInput.style.borderColor = "#e74c3c"
        showNotification("Please enter a valid email address.", "error")
        return
      }

      if (isValid) {
        showNotification(
          "Thank you for your interest! Our partnership team will contact you within 24 hours.",
          "success"
        )

        this.reset()

        requiredFields.forEach((field) => {
          const input = document.getElementById(field)
          input.style.borderColor = "#ddd"
        })

        modelCards.forEach((card) => card.classList.remove("selected"))

        window.scrollTo({ top: 0, behavior: "smooth" })

        console.log("Partner form data:", data)
      } else {
        // showNotification("Please fill in all required fields correctly.", "error")
      }
    })
  }

  // Partnership model selection highlighting
  const modelCards = document.querySelectorAll(".model-card")
  modelCards.forEach((card) => {
    card.addEventListener("click", function () {
      modelCards.forEach((c) => c.classList.remove("selected"))
      this.classList.add("selected")

      const partnershipSelect = document.getElementById("partnershipType")
      if (partnershipSelect) {
        const cardTitle = this.querySelector("h3").textContent.toLowerCase()
        if (cardTitle.includes("site host")) {
          partnershipSelect.value = "site-host"
        } else if (cardTitle.includes("franchise") && !cardTitle.includes("master")) {
          partnershipSelect.value = "franchise"
        } else if (cardTitle.includes("master")) {
          partnershipSelect.value = "master-franchise"
        }
      }
    })
  })

  const style = document.createElement("style")
  style.textContent = `
    .model-card.selected {
      border-color: #4CAF50 !important;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2) !important;
    }
  `
  document.head.appendChild(style)

  function showNotification(message, type = "info") {
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type)
      return
    }

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

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

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(400px)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 5000)
  }
})
