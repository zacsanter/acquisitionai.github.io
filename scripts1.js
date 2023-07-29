document.addEventListener('DOMContentLoaded', () => {

  // Generate a unique ID for the user
  const uniqueId = generateUniqueId()
  

  // Set the runtime, version and API key for the Voiceflow Dialog API
  const voiceflowRuntime = 'general-runtime.voiceflow.com'
  const voiceflowVersionID =
    document.getElementById('vfassistant').getAttribute('data-version') ||
    'production'
  const voiceflowAPIKey = 'VF.DM.64c14493b6edaf00071e8b60.1cbUWSymzUewJmIx'

  let audio = new Audio()
  const input = document.getElementById('user-input')
  const inputPlaceholder = document.getElementById('input-placeholder')
  const inputFieldContainer = document.getElementById('input-container')
  const chatWindow = document.getElementById('chat-window');

        interact('#launch#');




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
      }      
      // Add user message to the chat window
      const messageElement = document.createElement('div')
      messageElement.classList.add('message', 'user')
      messageElement.textContent = userInput
      chatWindow.appendChild(messageElement)

      // Scroll to the bottom of the chat window
      chatWindow.scrollTop = chatWindow.scrollHeight

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

    // If input is #launch# > Use a launch action to the request body
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
      })
      .catch((err) => {
        // console.error(err)
        displayResponse(null)
      })
  }



    // Fetch VF DM API response
    if (response) {
      response.forEach((item) => {
        if (item.type === 'speak' || item.type === 'text') {
          console.info('Speak/Text Step')

          const messageElement = document.createElement('div')
          messageElement.classList.add('message', 'assistant')
          messageElement.textContent = item.payload.message
          chatWindow.appendChild(messageElement)

          // Add audio to the queue
          if (item.payload.src) {
            audioQueue.push(item.payload.src)
          }
        } else if (item.type === 'visual') {
          console.info('Image Step')

          const imageElement = document.createElement('img')
          imageElement.src = item.payload.image
          imageElement.alt = 'Assistant Image'
          imageElement.style.width = '100%'
          chatWindow.appendChild(imageElement)
        }
      })
    } else {
      console.info('Error')

      const messageElement = document.createElement('div')
      messageElement.classList.add('message', 'assistant')
      messageElement.textContent = 'Sorry, GPT took too long to respond.\n\nPlease try again.'
      chatWindow.appendChild(messageElement)
    }

     

    // Scroll to the bottom of the chat window
    chatWindow.scrollTop = chatWindow.scrollHeight
  }, 200)
}

  // Modal to show Image
  function showModal(imageSrc) {
    const modal = document.createElement('div')
    modal.id = 'modal'
    modal.style.display = 'flex'
    modal.style.justifyContent = 'center'
    modal.style.alignItems = 'center'
    modal.style.position = 'fixed'
    modal.style.top = '0'
    modal.style.left = '0'
    modal.style.width = '100%'
    modal.style.height = '100%'
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    modal.style.opacity = '0'
    modal.style.transition = 'opacity 0.3s ease'

    const modalImage = document.createElement('img')
    modalImage.src = imageSrc
    modalImage.style.maxWidth = '90%'
    modalImage.style.maxHeight = '90%'
    modalImage.style.border = '2px solid white'
    modalImage.style.boxShadow =
      '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'

    modal.appendChild(modalImage)
    document.body.appendChild(modal)

    setTimeout(() => {
      modal.style.opacity = '1'
    }, 100)

    modal.addEventListener('click', () => {
      modal.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(modal)
      }, 300)
    })
  }
})

// Function to generate a unique ID for the user
function generateUniqueId() {
  // generate a random string of 6 characters
  const randomStr = Math.random().toString(36).substring(2, 8)
  // get the current date and time as a string
  const dateTimeStr = new Date().toISOString()
  // remove the separators and milliseconds from the date and time string
  const dateTimeStrWithoutSeparators = dateTimeStr
    .replace(/[-:]/g, '')
    .replace(/\.\d+/g, '')
  // concatenate the random string and date and time string
  const uniqueId = randomStr + dateTimeStrWithoutSeparators
  return uniqueId
}