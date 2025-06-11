document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");
  const button = document.getElementById("screenshotBtn");
  const SERVER_URL = "https://cameroon-december-dumb-beat.trycloudflare.com";

  // Показываем последний ответ, если есть
  const savedAnswer = localStorage.getItem("last_answer");
  if (savedAnswer) {
    resultDiv.textContent = "📋 Last: " + savedAnswer;
  }

  // Проверка статуса по task_id
  const checkTask = (taskId) => {
    fetch(`${SERVER_URL}/result/${taskId}`)
      .then(res => res.json())
      .then(data => {
        if (data.answer) {
          resultDiv.textContent = "✅:" + data.answer;
          localStorage.setItem("last_answer", data.answer);
          localStorage.removeItem("last_task_id");
        } else if (data.status === "processing") {
          setTimeout(() => checkTask(taskId), 1000);
        } else {
          resultDiv.textContent = "❌ Не удалось получить ответ.";
        }
      })
      .catch(err => {
        resultDiv.textContent = "❌ Ошибка запроса";
        console.error("Ошибка:", err);
      });
  };

  // Проверка при старте
  const lastTask = localStorage.getItem("last_task_id");
  if (lastTask) {
    resultDiv.textContent = "⏳";
    checkTask(lastTask);
  }

  // При нажатии кнопки
  button.addEventListener("click", () => {
    resultDiv.textContent = "📸";
    chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("image", blob, "screenshot.png");

      fetch(`${SERVER_URL}/upload`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if (data.task_id) {
            localStorage.setItem("last_task_id", data.task_id);
            resultDiv.textContent = "⏳";
            checkTask(data.task_id);
          } else {
            resultDiv.textContent = "❌ Сервер не выдал task_id";
          }
        })
        .catch(err => {
          resultDiv.textContent = "❌ Ошибка отправки";
          console.error(err);
        });
    });
  });
});
