document.addEventListener('DOMContentLoaded', () => {
  // Generate a unique ID for the user
  const uniqueId = generateUniqueId()

  // Set the runtime, version and API key for the Voiceflow Dialog API
  const voiceflowRuntime = 'general-runtime.voiceflow.com'
  const voiceflowVersionID =
    document.getElementById('vfassistant').getAttribute('data-version') ||
    'production'
  const voiceflowAPIKey = 'VF.DM.64c14493b6edaf00071e8b60.1cbUWSymzUewJmIx'

  const background = document.getElementById('background');
  const overlay = document.getElementById('overlay');
  const input = document.getElementById('user-input');
  const responseContainer = document.getElementById('response-container');
  const wave = document.getElementById('wave');

  const siriWave = new SiriWave({
    container: wave,
    width: window.innerWidth,
    height: 100,
    style: 'ios9',
    autostart: true,
    frequency: 2
  });

  siriWave.setAmplitude(0);

  const imageNames = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'];
  const imageIndex = Math.floor(Math.random() * imageNames.length);
  background.style.backgroundImage = `url(${imageNames[imageIndex]})`;

  const sessionId = localStorage.getItem('sessionId') || generateUniqueId();
  localStorage.setItem('sessionId', sessionId);

  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const userInput = input.value.trim();
      if (userInput) {
        addMessage(userInput, 'user');
        input.disabled = true;
        responseContainer.style.opacity = '0';
        if (audio && !audio.paused) {
          wave.style.opacity = '0';
          audio.pause();
        }
        interact(userInput);
      }
    }
  });

  function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message');
    message.classList.add(sender + '-message');
    message.textContent = text;

    const chatWindow = document.getElementById('chat-window');
    chatWindow.appendChild(message);

    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Continuation...

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

  function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

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

  setTimeout(() => {
    background.style.opacity = '1';
    overlay.style.opacity = '1';
    document.getElementById('input-placeholder').style.opacity = '1';
    document.getElementById('input-container').style.opacity = '1';
    document.getElementById('credits').style.opacity = '1';
  }, 1000);
});

