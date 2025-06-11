document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");
  const button = document.getElementById("screenshotBtn");
  const SERVER_URL = "https://cameroon-december-dumb-beat.trycloudflare.com";

  // Показываем последний ответ, если есть
  const savedAnswer = localStorage.getItem("last_answer");
  if (savedAnswer) {
    resultDiv.textContent = "📋 Последний ответ: " + savedAnswer;
  }

  // Проверка статуса по task_id
  const checkTask = (taskId) => {
    fetch(`${SERVER_URL}/result/${taskId}`)
      .then(res => res.json())
      .then(data => {
        if (data.answer) {
          resultDiv.textContent = "✅ Ответ: " + data.answer;
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
    resultDiv.textContent = "⏳ Ожидание ответа...";
    checkTask(lastTask);
  }

  // При нажатии кнопки
  button.addEventListener("click", () => {
    resultDiv.textContent = "📸 Делаем снимок...";
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
            resultDiv.textContent = "⏳ Отправлено. Ждём ответ...";
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



// document.addEventListener("DOMContentLoaded", () => {
//   const resultDiv = document.getElementById("result");
//   const button = document.getElementById("screenshotBtn");

//   // Показываем сохранённый ответ при загрузке
//   const last = localStorage.getItem("last_answer");
//   if (last) {
//     resultDiv.textContent = "📋 Последний ответ: " + last;
//   }

//   button.addEventListener("click", () => {
//     resultDiv.textContent = "⏳ ........ ";

//     // Делаем скриншот
//     chrome.tabs.captureVisibleTab(null, {format: "png"}, async (dataUrl) => {
//       const res = await fetch(dataUrl);
//       const blob = await res.blob();

//       const formData = new FormData();
//       formData.append("image", blob, "screenshot.png");

//       // Отправляем на сервер
//       fetch("https://cameroon-december-dumb-beat.trycloudflare.com/upload", {
//         method: "POST",
//         body: formData
//       })
//       .then(res => res.json())
//       .then(data => {
//         if (data.answer) {
//           resultDiv.textContent = "✅ Ответ: " + data.answer;
//           localStorage.setItem("last_answer", data.answer);
//         } else {
//           resultDiv.textContent = "❌ Ошибка: пустой ответ";
//         }
//       })
//       .catch(err => {
//         resultDiv.textContent = "❌ Ошибка при отправке";
//         console.error("Ошибка:", err);
//       });
//     });
//   });
// });
