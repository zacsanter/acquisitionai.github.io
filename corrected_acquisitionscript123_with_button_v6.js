
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
document.addEventListener('DOMContentLoaded', () => {

   // Set chat-container height to viewport height
  const chatContainer = document.getElementById('chat-container')
  chatContainer.style.height = `${window.innerHeight}px`

  // Generate a unique ID for the user
  
let uniqueId = localStorage.getItem('uniqueId');
if (!uniqueId) {
    uniqueId = generateUniqueId();  // This is your existing logic to generate a uniqueId
    localStorage.setItem('uniqueId', uniqueId);

}

  

  // Set the runtime, version and API key for the Voiceflow Dialog API
  const voiceflowRuntime = 'general-runtime.voiceflow.com'
  const voiceflowVersionID =
    document.getElementById('vfassistant').getAttribute('data-version') ||
    'production'
  const voiceflowAPIKey = 'VF.DM.64d0df22cc248300068a858c.KXeO554glAybHVsR'

  let audio = new Audio()
  const input = document.getElementById('user-input')
  const responseContainer = document.getElementById('response-container')
  const inputPlaceholder = document.getElementById('input-placeholder')
  const inputFieldContainer = document.getElementById('input-container')
  const chatWindow = document.getElementById('chat-window');

  // Load messages from local storage
  const savedMessages = localStorage.getItem('messages')
  if (savedMessages) {
    chatWindow.innerHTML = savedMessages
  }

   if (localStorage.getItem('messages')) {
    chatWindow.innerHTML = localStorage.getItem('messages');
    // Hide the typing indicator after loading chat history
    const typingIndicator = document.getElementById('typing-indicator');
    typingIndicator.style.display = 'none';  // or typingIndicator.classList.add('hidden');

        // Hide the typing indicator after processing the response
        
        typingIndicator.style.display = 'none';  // or typingIndicator.classList.add('hidden');

    // Hide the typing indicator after loading chat history
    
    typingIndicator.style.display = 'none'; // or typingIndicator.classList.add('hidden');
}
   // Retrieve username and company name from localStorage
const username = localStorage.getItem('username');
const companyName = localStorage.getItem('companyName');

if (username && companyName) {
    const options = {
  method: 'PATCH',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: 'VF.DM.64d0df22cc248300068a858c.KXeO554glAybHVsR'
  },
body: JSON.stringify({username: username, companyName: companyName})
    };

    // Use uniqueId for the userID in the Voiceflow API URL
    fetch('https://general-runtime.voiceflow.com/state/user/' + uniqueId + '/variables', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
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



  // Hide placeholder on input focus
  input.addEventListener('focus', () => {
    input.style.caretColor = 'transparent'
  })

  // Restore placeholder on input blur
  input.addEventListener('blur', () => {
    input.style.caretColor = 'white'
  })

 // Send user input to Voiceflow Dialog API

function handleUserInput(inputElement) {
function handleUserInput(inputElement) {
  console.log("handleUserInput function invoked.");
  const userInput = inputElement.value.trim();
  console.log("User input captured:", userInput);
  
  if (userInput) {
    console.log("Processing user input...");
    inputElement.disabled = true;
    inputElement.classList.add('fade-out');
    
  const userInput = inputElement.value.trim();
  if (userInput) {
    inputElement.disabled = true;
    inputElement.classList.add('fade-out');
    


const sendButton = document.querySelector("[data-input-id='user-input']"); // Retrieve button by data attribute
sendButton.addEventListener('click', function() {
  const inputId = this.getAttribute('data-input-id'); // Get associated input ID
  const inputElement = document.getElementById(inputId); // Get the input element
  handleUserInput(inputElement); // Process the input
});

  }
}


input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleUserInput(input);
  }
});


const sendButton = document.querySelector("[data-input-id='user-input']"); // Retrieve button by data attribute
sendButton.addEventListener('click', function() {
  const inputId = this.getAttribute('data-input-id'); // Get associated input ID
  const inputElement = document.getElementById(inputId); // Get the input element
  handleUserInput(inputElement); // Process the input
});
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
      window.requestAnimationFrame(() => {
    setTimeout(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100); // A 100ms delay, which you can adjust as needed.
});


       // Show typing indicator
    const typingIndicator = document.getElementById('typing-indicator')
    typingIndicator.classList.remove('hidden')
    chatWindow.appendChild(typingIndicator)

      interact(userInput)
    }
  }
}


  // Send user input to Voiceflow Dialog API
  
  async function interact(input) {
    // Declare the typing indicator at the beginning
    const typingIndicator = document.getElementById('typing-indicator');

    // Show the typing indicator before sending the message
    
    typingIndicator.style.display = 'block';  // or typingIndicator.classList.remove('hidden');

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
    // Hide typing indicator after processing all responses
document.getElementById('typing-indicator').classList.add('hidden');

// Ensure the chat window scrolls to the latest message
window.requestAnimationFrame(() => {
    setTimeout(() => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }, 100); 
});

      // Fade in new content
      responseContainer.style.opacity = '1'

      // Function to play audio sequentially
      function playNextAudio() {
        if (audioQueue.length === 0) {
          // Set focus back to the input field after all audios are played
          instance.stop()
          input.blur()
          setTimeout(() => {
            input.focus()
          }, 100)
          return
        }

        const audioSrc = audioQueue.shift()
        audio = new Audio(audioSrc)

        // Find and show the corresponding text
        const textElement = responseContainer.querySelector(
          `[data-src="${audioSrc}"]`
        )
        if (textElement) {
          // Change the opacity of previous text
          const previousTextElement = textElement.previousElementSibling
          if (previousTextElement && previousTextElement.tagName === 'P') {
            previousTextElement.style.opacity = '0.5'
          }
          // Show the current text
          textElement.style.transition = 'opacity 0.5s'
          textElement.style.opacity = '1'
        }

        audio.addEventListener('canplaythrough', () => {
          audio.play()
        })

        audio.addEventListener('ended', () => {
          playNextAudio()
        })

        // Handle errors
        audio.addEventListener('error', () => {
          console.error('Error playing audio:', audio.error)
          playNextAudio() // Skip the current audio and continue with the next one
        })
      }

      // Start playing audios sequentially
    playNextAudio()
  }, 250)

  setTimeout(() => {
    // Re-enable input field and remove focus
    input.disabled = false
    input.value = ''
    input.classList.remove('fade-out')
    input.blur()
    input.focus()

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
}

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

  } else {
    console.log("No user input to process.");
  }
}
