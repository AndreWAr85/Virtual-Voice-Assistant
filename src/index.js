import './style.css'; document.addEventListener('DOMContentLoaded', () => {
  if (!('webkitSpeechRecognition' in window) || !('speechSynthesis' in window)) {
    alert('Ваш браузер не поддерживает Web Speech API. Используйте Google Chrome.');
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.continuous = false;

  let recognitionStarted = false;

  startRecognition();

  function startRecognition() {
    if (recognitionStarted) return;
    recognitionStarted = true;
    recognition.start();
  }

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;

    const userInput = document.createElement('textarea');
    userInput.id = 'user-input';
    userInput.rows = 4;
    userInput.cols = 50;
    userInput.value = transcript;
    userInput.readOnly = true;
    document.body.appendChild(userInput);

    try {
      const response = await fetch('http://localhost:9000/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await response.json();
      if (data.answer) {
        const answerTextarea = document.createElement('textarea');
        answerTextarea.rows = 4;
        answerTextarea.cols = 50;
        answerTextarea.value = data.answer;
        answerTextarea.readOnly = true;
        document.body.appendChild(answerTextarea);

        speakText(data.answer);
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }

    setTimeout(() => {
      recognitionStarted = false;
      startRecognition();
    }, 1000);
  };

  recognition.onerror = (event) => {
    console.error('Ошибка распознавания речи:', event.error);
    recognitionStarted = false;
  };

  recognition.onend = () => {
    if (!recognitionStarted) {
      recognitionStarted = true;
      recognition.start();
    }
  };

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  }
});
