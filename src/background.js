// Import the API key from config.js
importScripts('config.js');

// Create a context menu item for text selection
browser.contextMenus.create({
  id: "send-to-deepseek",
  title: "Ask DeepSeek: %s",
  contexts: ["selection"]
});

// Listen for clicks on the context menu item
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-to-deepseek" && info.selectionText) {
    // Send selected text to DeepSeek API
    sendToDeepSeek(info.selectionText)
      .then(responseData => {
        console.log("DeepSeek API response:", responseData);
      })
      .catch(error => {
        console.error("Error calling DeepSeek API:", error);
      });
  }
});

// Function to send selected text to DeepSeek
async function sendToDeepSeek(selectedText) {
  const apiUrl = "https://api.deepseek.com/v1/openai/chat/completions"; // Use DeepSeek API endpoint
  const apiKey = CONFIG.API_KEY; // Use the API key from config.js

  // Construct the payload
  const payload = {
    model: "deepseek-reasoner",  // Or "deepseek-chat" for chat mode
    messages: [
      { role: "system", content: "You are a helpful AI assistant that answers queries discreetly." },
      { role: "user", content: selectedText }
    ],
    stream: false
  };

  // Log the request for debugging
  console.log("Sending request to DeepSeek API:", payload);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API request failed: ${response.statusText}`);
  }
  return response.json();
}