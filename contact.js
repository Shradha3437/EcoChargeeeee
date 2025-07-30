// Contact Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const formData = new FormData(this)
      const data = Object.fromEntries(formData)

      // Validate required fields
      const requiredFields = ["firstName", "lastName", "email", "inquiryType", "subject", "message"]
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

      // Email validation
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
        // Simulate form submission
        const inquiryType = data.inquiryType
        let responseMessage = "Thank you for contacting us! "

        switch (inquiryType) {
          case "technical":
            responseMessage += "Our technical support team will respond within 4 hours."
            break
          case "billing":
            responseMessage += "Our billing department will review your inquiry and respond within 24 hours."
            break
          case "partnership":
            responseMessage += "Our partnership team will contact you within 24 hours."
            break
          case "installation":
            responseMessage += "Our installation team will contact you to schedule a site assessment."
            break
          default:
            responseMessage += "We will respond to your inquiry within 24 hours."
        }

        showNotification(responseMessage, "success")
        this.reset()

        // In a real application, you would send this data to your server
        console.log("Contact form data:", data)
      } else {
        // showNotification("Please fill in all required fields correctly.", "error")
      }
    })
  }

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item")
  faqItems.forEach((item) => {
    const question = item.querySelector("h3")
    if (question) {
      question.style.cursor = "pointer"
      question.addEventListener("click", () => {
        const answer = item.querySelector("p")
        const isVisible = answer.style.display !== "none"

        // Close all other FAQ items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector("p")
            otherAnswer.style.display = "none"
            otherItem.querySelector("h3").style.color = "#2d5a27"
          }
        })

        // Toggle current item
        if (isVisible) {
          answer.style.display = "none"
          question.style.color = "#2d5a27"
        } else {
          answer.style.display = "block"
          question.style.color = "#4CAF50"
        }
      })
    }
  })

  // Live chat functionality
  window.openChat = () => {
    // Create chat widget
    const chatWidget = document.createElement("div")
    chatWidget.id = "chatWidget"
    chatWidget.innerHTML = `
            <div class="chat-header">
                <h4>Live Chat Support</h4>
                <button onclick="closeChat()" class="chat-close">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="chat-message bot-message">
                    <strong>EcoCharge Support:</strong> Hello! How can I help you today?
                </div>
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Type your message..." onkeypress="window.handleChatKeyPress(event)">
                <button onclick="window.sendChatMessage()" class="chat-send">Send</button>
            </div>
        `

    // Add styles
    chatWidget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            font-family: inherit;
        `

    // Add chat styles
    const chatStyles = document.createElement("style")
    chatStyles.textContent = `
            .chat-header {
                background: #4CAF50;
                color: white;
                padding: 15px;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .chat-header h4 {
                margin: 0;
                font-size: 1rem;
            }
            .chat-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                max-height: 280px;
            }
            .chat-message {
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 8px;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            .bot-message {
                background: #f0f8f0;
                color: #2d5a27;
            }
            .user-message {
                background: #4CAF50;
                color: white;
                margin-left: 20px;
            }
            .chat-input {
                padding: 15px;
                border-top: 1px solid #eee;
                display: flex;
                gap: 10px;
            }
            .chat-input input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 0.9rem;
            }
            .chat-send {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
            }
        `
    document.head.appendChild(chatStyles)

    document.body.appendChild(chatWidget)

    // Focus on input
    setTimeout(() => {
      document.getElementById("chatInput").focus()
    }, 100)
  }

  // Chat functions
  window.closeChat = () => {
    const chatWidget = document.getElementById("chatWidget")
    if (chatWidget) {
      chatWidget.remove()
    }
  }

  window.handleChatKeyPress = (event) => {
    if (event.key === "Enter") {
      window.sendChatMessage()
    }
  }

  window.sendChatMessage = () => {
    const input = document.getElementById("chatInput")
    const messagesContainer = document.getElementById("chatMessages")

    if (!input || !messagesContainer || !input.value.trim()) return

    const message = input.value.trim()

    // Add user message
    const userMessage = document.createElement("div")
    userMessage.className = "chat-message user-message"
    userMessage.innerHTML = `<strong>You:</strong> ${message}`
    messagesContainer.appendChild(userMessage)

    // Clear input
    input.value = ""

    // Simulate bot response
    setTimeout(() => {
      const botMessage = document.createElement("div")
      botMessage.className = "chat-message bot-message"

      // Simple response logic
      let response = "Thank you for your message. "
      if (message.toLowerCase().includes("charging")) {
        response +=
          "For charging-related questions, you can find stations using our locator or call 1-800-ECO-CHARGE for immediate assistance."
      } else if (message.toLowerCase().includes("price") || message.toLowerCase().includes("cost")) {
        response +=
          "Our pricing varies by location and charger type. You can view current rates in our mobile app or on our services page."
      } else if (message.toLowerCase().includes("partner")) {
        response +=
          "I'd be happy to help with partnership inquiries! Please visit our Partner page or call our business line at 1-800-ECO-BIZZ."
      } else {
        response +=
          "A support representative will be with you shortly. In the meantime, you can check our FAQ section or call 1-800-ECO-CHARGE."
      }

      botMessage.innerHTML = `<strong>EcoCharge Support:</strong> ${response}`
      messagesContainer.appendChild(botMessage)

      // Scroll to bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }, 1000)

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  // Phone number formatting
  const phoneInput = document.getElementById("phone")
  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "")
      if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{3})/, "($1) $2")
      }
      this.value = value
    })
  }

  // Notification function
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
