document.querySelectorAll('.follower-item').forEach(item => {
    item.addEventListener('click', async () => {
        const userId = item.getAttribute('data-user-id');

        // Fetch chat for the selected user
        const response = await fetch(`/messages/tiger247/${userId}`);
        const {messages, detail} = await response.json();


        // Update the message section
        const messageSection = document.querySelector('.message-section');
        messageSection.classList.add('chat-view');
        messageSection.innerHTML =
            `<div class="msg-header">
             <div class="img-name"><img class="profile-img" src="${detail[0].profile}" alt="${detail[0].name}'s profile picture">
            <span class="userId">${userId.charAt(0).toUpperCase() + userId.slice(1)}</span></div>
            <i class="fa-solid fa-phone "></i>
            <i class="fa-solid fa-video"></i>
            <i class="fa-solid fa-circle-info info-btn"></i>
            </div>
            <div class="middle-container">  <div class="default-detail">
<img src="${detail[0].profile}" alt="${detail[0].name}'s profile picture " class="big-profile-picture ">
<h1>${detail[0].name}</h1> 
<p>${userId.charAt(0).toUpperCase() + userId.slice(1)} &#183; Anigram</p>
<a href="/ig/${userId}" class="view-btn">View profile</a></div>
<div class="message-area"></div> </div>
`
        let messageArea = document.querySelector('.message-area');
        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            messageDiv.classList.add(message.sender === userId ? 'left' : 'right');
            messageDiv.innerHTML = `<p>${message.message}</p>`;
            messageArea.appendChild(messageDiv);
        });

        // Add new message input
        const messageSend = document.createElement('div');
        messageSend.classList.add('send-message-container');
        messageSection.appendChild(messageSend);
        const messageInput = document.createElement('input');
        messageInput.type = 'text';
        messageInput.placeholder = 'Type a message...';
        messageSend.appendChild(messageInput);

        // Add submit button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.classList.add('send-btn');
        submitBtn.innerHTML = 'Send';
        messageSend.appendChild(submitBtn);

        // Add event listener to submit button;
        // submitBtn.addEventListener('click', async (event) => {
        //     event.preventDefault();
        //     const message = messageInput.value;
        //     if (message) {
        //         // Send message to the server
        //         await fetch('/messages/tiger247/' + userId, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 message,
        //             }),
        //         }).then(response => response.json())
        //             .then(data=>{
        //                 // Clear input field
        //                 messageInput.value = '';
        //
        //                 // Append new message to the message area
        //                 const newMessageDiv = document.createElement('div');
        //                 newMessageDiv.classList.add('message');
        //                 newMessageDiv.classList.add('right');
        //                 newMessageDiv.innerHTML = `<p>${message}</p>`;
        //                 messageArea.appendChild(newMessageDiv);
        //
        //                 function display(data){
        //                     const replyMessage = document.createElement('div');
        //                     replyMessage.classList.add('message');
        //                     replyMessage.classList.add('left');
        //                     replyMessage.innerHTML = `<p>${data.autoReply}</p>`;
        //                     messageArea.appendChild(replyMessage);
        //                     let middleContainer = document.querySelector('.middle-container');
        //                     middleContainer.scrollTop = messageArea.scrollHeight; // Scroll to the bottom
        //                 } setTimeout(display, 2000, data);
        //
        //                 let middleContainer = document.querySelector('.middle-container');
        //                 middleContainer.scrollTop = messageArea.scrollHeight; // Scroll to the bottom
        //             })
        //
        //
        //     }
        // });
        const messageSubmit = async (event) => {
            event.preventDefault();
            const message = messageInput.value;
            if (message) {
                // Send message to the server
                await fetch('/messages/tiger247/' + userId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({message}),
                }).then(response => response.json())
                    .then(data => {
                        // Clear input field
                        messageInput.value = '';

                        // Append new message to the message area
                        const newMessageDiv = document.createElement('div');
                        newMessageDiv.classList.add('message', 'right');
                        newMessageDiv.innerHTML = `<p>${message}</p>`;
                        messageArea.appendChild(newMessageDiv);

                        // Display auto-reply message after a delay
                        setTimeout(() => {
                            const replyMessage = document.createElement('div');
                            replyMessage.classList.add('message', 'left');
                            replyMessage.innerHTML = `<p>${data.autoReply}</p>`;
                            messageArea.appendChild(replyMessage);

                            // Scroll to the bottom
                            let middleContainer = document.querySelector('.middle-container');
                            middleContainer.scrollTop = messageArea.scrollHeight;
                        }, 2000);

                        // Scroll to the bottom
                        let middleContainer = document.querySelector('.middle-container');
                        middleContainer.scrollTop = messageArea.scrollHeight;
                    });
            }
        };

// Trigger the handleSubmit function on button click or Enter key press
        submitBtn.addEventListener('click', messageSubmit);
        messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                messageSubmit(event);
            }
        });


    });
});



