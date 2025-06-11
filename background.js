chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "notify") {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Ответ от AI 🤖",
        message: msg.text
      });
    }
  });