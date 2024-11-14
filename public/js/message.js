// Select all follower items and add a click event listener
document.querySelectorAll(".follower-item").forEach((item) => {
    item.addEventListener("click", async () => {
      const userId = item.getAttribute("data-user-id");
  
      // Fetch chat data for the selected user
      const response = await fetch(`/messages/tiger247/${userId}`);
      const { messages, detail } = await response.json();
  
      // Update the message section with chat view structure
      const messageSection = document.querySelector(".message-section");
      messageSection.classList.add("chat-view");
      messageSection.innerHTML = `
        <div class="msg-header">
          <div class="img-name">
            <img class="profile-img" src="${detail[0].profile}" alt="${detail[0].name}'s profile picture">
            <span class="userId">${capitalize(userId)}</span>
          </div>
          <i class="fa-solid fa-phone"></i>
          <i class="fa-solid fa-video"></i>
          <i class="fa-solid fa-circle-info info-btn"></i>
        </div>
        <div class="middle-container right-side">
          <div class="default-detail">
            <img src="${detail[0].profile}" alt="${detail[0].name}'s profile picture" class="big-profile-picture">
            <h1>${detail[0].name}</h1>
            <p>${capitalize(userId)} &#183; Anigram</p>
            <a href="/ig/${userId}" class="view-btn">View profile</a>
          </div>
          <div class="message-area"></div>
        </div>
      `;
  
      // Append existing messages
      const messageArea = document.querySelector(".message-area");
      messages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", message.sender === userId ? "left" : "right");
        messageDiv.innerHTML = `<p>${message.message}</p>`;
        messageArea.appendChild(messageDiv);
      });
  
      // Add new message input and send button
      addMessageInput(messageSection, messageArea, userId);
    });
  });
  
  // Helper function to capitalize the user ID
  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  
  // Helper function to add message input and handle message submission
  function addMessageInput(messageSection, messageArea, userId) {
    const messageSend = document.createElement("div");
    messageSend.classList.add("send-message-container");
  
    const messageInput = document.createElement("input");
    messageInput.type = "text";
    messageInput.placeholder = "Type a message...";
  
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.classList.add("send-btn");
    submitBtn.innerHTML = "Send";
  
    messageSend.appendChild(messageInput);
    messageSend.appendChild(submitBtn);
    messageSection.appendChild(messageSend);
  
    const handleMessageSubmit = async (event) => {
      event.preventDefault();
      const message = messageInput.value;
      if (message) {
        // Send message to the server
        const response = await fetch(`/messages/tiger247/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
  
        const data = await response.json();
        appendMessage(messageArea, message, "right");
  
        // Clear input field
        messageInput.value = "";
  
        // Display auto-reply message after a delay
        setTimeout(() => {
          appendMessage(messageArea, data.autoReply, "left");
          scrollToBottom(messageArea);
        }, 2000);
  
        scrollToBottom(messageArea);
      }
    };
  
    // Attach event listeners to the send button and Enter key for message submission
    submitBtn.addEventListener("click", handleMessageSubmit);
    messageInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") handleMessageSubmit(event);
    });
  }
  
  // Helper function to append a message to the message area
  function appendMessage(messageArea, message, alignment) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", alignment);
    messageDiv.innerHTML = `<p>${message}</p>`;
    messageArea.appendChild(messageDiv);
  }
  
  // Helper function to scroll to the bottom of the message area
  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }
  