// document.addEventListener('DOMContentLoaded', () => {
//   const button = document.getElementById("screenshotBtn");
//   const answerBox = document.getElementById("answer");

//   // Загружаем последний ответ из хранилища
//   chrome.storage.local.get(["lastAnswer"], (result) => {
//     if (result.lastAnswer) {
//       answerBox.textContent = "Ответ: " + result.lastAnswer;
//     }
//   });

//   button.addEventListener("click", async () => {
//     answerBox.textContent = "⏳ Обработка...";
    
//     chrome.tabs.captureVisibleTab(null, { format: "png" }, async (dataUrl) => {
//       const res = await fetch(dataUrl);
//       const blob = await res.blob();
//       const formData = new FormData();
//       formData.append("image", blob, "screenshot.png");

//       try {
//         const response = await fetch("https://luther-johnston-complaints-bags.trycloudflare.com/upload", {
//           method: "POST",
//           body: formData,
//         });

//         const data = await response.json();

//         if (data.answer) {
//           answerBox.textContent = "✅ Ответ: " + data.answer;

//           // Сохраняем ответ локально
//           chrome.storage.local.set({ lastAnswer: data.answer });
//         } else {
//           answerBox.textContent = "⚠️ Нет ответа от AI.";
//         }
//       } catch (err) {
//         answerBox.textContent = "❌ Ошибка!";
//         console.error(err);
//       }
//     });
//   });
// });



document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.getElementById("result");
  const button = document.getElementById("screenshotBtn");

  // Показываем сохранённый ответ при загрузке
  const last = localStorage.getItem("last_answer");
  if (last) {
    resultDiv.textContent = "📋 Последний ответ: " + last;
  }

  button.addEventListener("click", () => {
    resultDiv.textContent = "⏳ ........ ";

    // Делаем скриншот
    chrome.tabs.captureVisibleTab(null, {format: "png"}, async (dataUrl) => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("image", blob, "screenshot.png");

      // Отправляем на сервер
      fetch("https://casting-belle-church-nasty.trycloudflare.com/upload", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.answer) {
          resultDiv.textContent = "✅ Ответ: " + data.answer;
          localStorage.setItem("last_answer", data.answer);
        } else {
          resultDiv.textContent = "❌ Ошибка: пустой ответ";
        }
      })
      .catch(err => {
        resultDiv.textContent = "❌ Ошибка при отправке";
        console.error("Ошибка:", err);
      });
    });
  });
});