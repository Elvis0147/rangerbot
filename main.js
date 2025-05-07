
async function sendMessage() {
  const input = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');
  const message = input.value;
  chatBox.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
  input.value = '';

  const response = await fetch('/.netlify/functions/handle', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  chatBox.innerHTML += `<div><strong>RangerBot:</strong> ${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}
