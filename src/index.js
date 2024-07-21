import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
    alert('Ваш браузер не поддерживает Web Speech API. Используйте Google Chrome.');
    return;
  }

  const startRecordingButton = document.createElement('button');
  startRecordingButton.id = 'start-recording';
  startRecordingButton.classList.add('record-button');
  startRecordingButton.textContent = '';
  document.body.appendChild(startRecordingButton);

  const messageContainer = document.createElement('div');
  messageContainer.id = 'message-container';
  document.body.appendChild(messageContainer);

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.continuous = false;

  startRecordingButton.addEventListener('click', startRecognition);

  function startRecognition() {
    startRecordingButton.classList.add('active');
    recognition.start();
  }

  recognition.onresult = async (event) => {
    startRecordingButton.classList.remove('active');
    console.log('Speech result event:', event); // Отладка
    try {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript); // Отладка

      const userMessage = document.createElement('div');
      userMessage.classList.add('message', 'question');
      userMessage.textContent = transcript;
      messageContainer.appendChild(userMessage);
      adjustMessageWidth(userMessage);

      const response = await fetch('http://localhost:9001/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.answer) {
        const answerMessage = document.createElement('div');
        answerMessage.classList.add('message', 'answer');
        answerMessage.textContent = data.answer;
        messageContainer.appendChild(answerMessage);
        adjustMessageWidth(answerMessage);
        speakText(data.answer);
      }
    } catch (error) {
      console.error('Ошибка обработки результата:', error);
    }
  };

  recognition.onerror = (event) => {
    console.error('Ошибка распознавания речи:', event.error);
    startRecordingButton.classList.remove('active');
  };

  function startRecognition() {
    recognition.start();
    startRecordingButton.classList.add('active');
  }

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  }

  function adjustMessageWidth(messageElement) {
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.whiteSpace = 'pre';
    tempSpan.style.fontFamily = window.getComputedStyle(messageElement).fontFamily;
    tempSpan.style.fontSize = window.getComputedStyle(messageElement).fontSize;
    tempSpan.textContent = messageElement.textContent;

    document.body.appendChild(tempSpan);

    messageElement.style.width = `${tempSpan.offsetWidth + 50}px`;

    document.body.removeChild(tempSpan);
  }
});
