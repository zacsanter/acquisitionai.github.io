document.addEventListener('DOMContentLoaded', () => {
  // Generate a unique ID for the user
  const uniqueId = generateUniqueId()

  // Set the runtime, version and API key for the Voiceflow Dialog API
  const voiceflowRuntime = 'general-runtime.voiceflow.com'
  const voiceflowVersionID =
    document.getElementById('vfassistant').getAttribute('data-version') ||
    'production'
  const voiceflowAPIKey = 'VF.DM.64cd71cde8300a00077e246c.5PFuJPx3R8kLZoKe'

  let audio = new Audio()
  const input = document.getElementById('user-input')
  const responseContainer = document.getElementById('response-container')
  const inputPlaceholder = document.getElementById('input-placeholder')
  const inputFieldContainer = document.getElementById('input-container')
  const chatWindow = document.getElementById('chat-window')

  // Load messages from local storage
  const savedMessages = localStorage.getItem('messages')
  if (savedMessages) {
    chatWindow.innerHTML = savedMessages
  }

  // Only call interact('#launch#') if there are no saved messages
  if (!savedMessages) {
    interact('#launch#')
  }

  // Select the restart button
  const restartButton = document.getElementById('restart-button')

  // Add click event listener to the restart button
  restartButton.addEventListener('click', () => {
    // Clear chat window and local storage
    chatWindow.innerHTML = ''
    localStorage.removeItem('messages')

    // Initiate new chat
    interact('#launch#')
  })

  inputFieldContainer.addEventListener('click', () => {
    input.focus()
  })

  // Show the 'start here' text with fadeIn animation after 3 seconds
  setTimeout(() => {
    inputPlaceholder.style.animation = 'fadeIn 0.5s forwards'
  }, 3000)

  // Hide 'start here' text with fadeOut animation on input field click
  input.addEventListener('click', () => {
    if (!inputPlaceholder.classList.contains('hidden')) {
      inputPlaceholder.style.animation = 'fadeOut 0.5s forwards'
      setTimeout(() => {
        inputPlaceholder.classList.add('hidden')
      }, 500)
    }
  })

  // Hide placeholder on input focus
  input.addEventListener('focus', () => {
    input.style.caretColor = 'transparent'
  })

  // Restore placeholder on input blur
  input.addEventListener('blur', () => {
    input.style.caretColor = 'white'
  })

  // Send user input to Voiceflow Dialog API
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const userInput = input.value.trim()

      if (userInput) {
        // Disable input field and apply fade-out animation
        input.disabled = true
        input.classList.add('fade-out')

        // Fade out previous content
        responseContainer.style.opacity = '0'

        // Check if any audio is currently playing
        if (audio && !audio.paused) {
          // If audio is playing, pause it
          audio.pause()
        }

        // Add user message to the chat window
        const messageElement = document.createElement('div')
        messageElement.classList.add('message', 'user')
        messageElement.textContent = userInput
        chatWindow.appendChild(messageElement)

        // Save messages to local storage
        localStorage.setItem('messages', chatWindow.innerHTML)

        // Scroll to the bottom of the chat window
        chatWindow.scrollTop = chatWindow.scrollHeight

        // Show typing indicator
        const typingIndicator = document.getElementById('typing-indicator')
        typingIndicator.classList.remove('hidden')
        chatWindow.appendChild(typingIndicator)

        interact(userInput)
      }
    }
  })

  // Send user input to Voiceflow Dialog API
  async function interact(input) {
    let body = {
      config: { tts: true, stripSSML: true },
      action: { type: 'text', payload: input },
    }

    // If input is '#launch#' > Use a launch action to the request body
    if (input == '#launch#') {
      body = {
        config: { tts: true, stripSSML: true },
        action: { type: 'launch' },
      }
    }

    fetch(`https://${voiceflowRuntime}/state/user/${uniqueId}/interact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: voiceflowAPIKey,
        versionID: voiceflowVersionID,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        displayResponse(data)
        // Hide typing indicator after processing all responses
        document.getElementById('typing-indicator').classList.add('hidden')
      })
      .catch((err) => {
        // console.error(err)
        displayResponse(null)
        // Hide typing indicator after processing all responses
        document.getElementById('typing-indicator').classList.add('hidden')
      })
  }

  // Render the response from the Voiceflow Dialog API
  function displayResponse(response) {
    setTimeout(() => {
      let audioQueue = []

      // Fetch VF DM API response
      if (response) {
        response.forEach((item) => {
          if (item.type === 'speak' || item.type === 'text') {
            console.info('Speak/Text Step')

            const messageElement = document.createElement('div')
            messageElement.classList.add('message', 'assistant')
            messageElement.textContent = item.payload.message
            chatWindow.appendChild(messageElement)

            // Save messages to local storage
            localStorage.setItem('messages', chatWindow.innerHTML)
          } else if (item.type === 'visual') {
            console.info('Visual Step')

            const visualElement = document.createElement('div')
            visualElement.classList.add('message', 'assistant')

            const imageElement = document.createElement('img')
            imageElement.src = item.payload.image
            imageElement.alt = item.payload.title
            imageElement.title = item.payload.title
            imageElement.onclick = function () {
              showModal(imageElement.src, imageElement.alt)
            }

            visualElement.appendChild(imageElement)
            chatWindow.appendChild(visualElement)

            // Save messages to local storage
            localStorage.setItem('messages', chatWindow.innerHTML)
          }
        })
      } else {
        console.warn('API request failed > Display default error message')

        const messageElement = document.createElement('div')
        messageElement.classList.add('message', 'assistant')
        messageElement.textContent =
          "I'm sorry, I'm having trouble understanding you."
        chatWindow.appendChild(messageElement)

        // Save messages to local storage
        localStorage.setItem('messages', chatWindow.innerHTML)
      }

      // Scroll to the bottom of the chat window
      chatWindow.scrollTop = chatWindow.scrollHeight

      // Enable input field and apply fade-in animation
      input.disabled = false
      input.classList.remove('fade-out')
      input.classList.add('fade-in')

      // Fade in new content
      responseContainer.style.opacity = '1'

      // Process audio queue
      if (audioQueue.length > 0) {
        audio.src = audioQueue[0]
        audio.play()
      }
    }, 250)
  }

  // Generate a unique ID for the user
  function generateUniqueId() {
    return (
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36)
    )
  }

  // Create a modal to display an image
  function showModal(src, alt) {
    const modal = document.createElement('div')
    modal.classList.add('modal')

    const modalContent = document.createElement('div')
    modalContent.classList.add('modal-content')

    const closeButton = document.createElement('span')
    closeButton.classList.add('close')
    closeButton.innerHTML = '&times;'
    closeButton.onclick = function () {
      modal.style.display = 'none'
    }

    const imageElement = document.createElement('img')
    imageElement.src = src
    imageElement.alt = alt
    imageElement.title = alt

    modalContent.appendChild(closeButton)
    modalContent.appendChild(imageElement)
    modal.appendChild(modalContent)
    document.body.appendChild(modal)

    modal.style.display = 'block'
    modal.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none'
      }
    }
  }
})

