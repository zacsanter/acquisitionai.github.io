
let chatHistory = [];

function captureUserMessage(message) {
    const timestamp = new Date().toISOString();
    chatHistory.push({ sender: 'user', message, timestamp });
}

function captureChatbotMessage(message) {
    const timestamp = new Date().toISOString();
    chatHistory.push({ sender: 'chatbot', message, timestamp });
}


async function interact(input) {
    // Capture the user's message
    const userMessageData = {
        uniqueId: uniqueId,
        username: localStorage.getItem('username'),
        companyName: localStorage.getItem('companyName'),
        sender: 'user',
        message: input,
        timestamp: new Date().toISOString()
    };
    sendToWebhook(userMessageData);
    
    // ... [rest of the existing interact function code]
}


function displayResponse(response) {
    if (response) {
        response.forEach((item) => {
            if (item.type === 'speak' || item.type === 'text') {
                const chatbotMessageData = {
                    uniqueId: uniqueId,
                    username: localStorage.getItem('username'),
                    companyName: localStorage.getItem('companyName'),
                    sender: 'chatbot',
                    message: item.payload.message,
                    timestamp: new Date().toISOString()
                };
                sendToWebhook(chatbotMessageData);
                
                // ... [rest of the existing displayResponse function code]
            }
        });
    }
}

async function sendToWebhook(data) {
    const webhookUrl = "YOUR_WEBHOOK_ENDPOINT";  // Replace with your webhook URL

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to send data to webhook');
        }

        console.log("Data sent to webhook successfully!");
    } catch (error) {
        console.error("Error:", error);
    }
}

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
})


  // Send user input to Voiceflow Dialog API
  
  
}