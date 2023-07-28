document.addEventListener('DOMContentLoaded', () => {
  // Your Voiceflow API key and version ID
  const API_KEY = 'YOUR_VOICEFLOW_API_KEY';
  const VERSION_ID = 'YOUR_VOICEFLOW_VERSION_ID';

  // DOM elements
  const background = document.getElementById('background');
  const overlay = document.getElementById('overlay');
  const credits = document.getElementById('credits');
  const input = document.getElementById('user-input');
  const responseContainer = document.getElementById('response-container');
  const wave = document.getElementById('wave');
  const chatWindow = document.getElementById('chat-window');

  // Audio element
  let audio;

  // SiriWave instance
  const siriWave = new SiriWave({
    container: wave,
    width: window.innerWidth,
    height: 100,
    style: 'ios',
    autostart: true,
    frequency: 2
  });

  siriWave.setAmplitude(0);

  // Background images
  const imageNames = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
  const imageIndex = Math.floor(Math.random() * imageNames.length);
  background.style.backgroundImage = `url(${imageNames[imageIndex]})`;

  // Unique ID for the user
  const sessionId = localStorage.getItem('sessionId') || generateUniqueId();
  localStorage.setItem('sessionId', sessionId);
});
document.addEventListener('DOMContentLoaded', () => {
  // Continuation...

  // Event listener for user input
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const userInput = input.value.trim();
      if (userInput) {
        addMessage(userInput, 'user');
        input.disabled = true;
        input.classList.add('fade-out');
        responseContainer.style.opacity = '0';
        if (audio && !audio.paused) {
          wave.style.opacity = '0';
          audio.pause();
        }
        interact(userInput);
      }
    }
  });

  // Function to add a message to the chat window
  function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender + '-message');
    message.textContent = text;
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Continuation...

  // Function to display the response from the Voiceflow Dialog API
  function displayResponse(response) {
    if (response) {
      response.forEach((item) => {
        if (item.type === 'speak' || item.type === 'text') {
          addMessage(item.payload.message, 'assistant');
        } else if (item.type === 'audio') {
          const audioSrc = item.payload.src;
          if (audioSrc) {
            if (audio && !audio.paused) {
              audio.pause();
            }
            audio = new Audio(audioSrc);
            audio.play();
            wave.style.opacity = '1';
            siriWave.setAmplitude(1);
            audio.onended = () => {
              wave.style.opacity = '0';
              siriWave.setAmplitude(0);
            }
          }
        } else if (item.type === 'display') {
          const displaySrc = item.payload.src;
          if (displaySrc) {
            showModal(displaySrc);
          }
        }
      });
    } else {
      addMessage("Sorry, I took too long to respond. Please try again.", 'assistant');
    }

    input.disabled = false;
    input.value = '';
    input.focus();
    responseContainer.style.opacity = '0';
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Continuation...

  // Function to show a modal
  function showModal(imgSrc) {
    const modal = document.createElement('div');
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.cursor = 'pointer';
    modal.onclick = () => document.body.removeChild(modal);

    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';

    modal.appendChild(img);
    document.body.appendChild(modal);
  }

  // Function to generate a unique ID
  function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Function to interact with the Voiceflow Dialog API
  function interact(message) {
    const body = {
      versionID: VERSION_ID,
      message,
      session: {
        user: {
          id: sessionId
        }
      }
    };

    fetch('https://dialog.voiceflow.com/v1/interact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + API_KEY
      },
      body: JSON.stringify(body)
    })
      .then(response => response.json())
      .then(data => {
        const messages = data.messages;
        displayResponse(messages);
      });
  }

  // Fade in elements
  setTimeout(() => {
    background.style.opacity = '1';
    overlay.style.opacity = '1';
    credits.style.opacity = '1';
    document.getElementById('input-placeholder').style.opacity = '1';
    document.getElementById('input-container').style.opacity = '1';
  }, 1000);
});
