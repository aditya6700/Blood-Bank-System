import React from 'react'

export const ChatContainer = () => {
  return (
    <>
      <div class="livechat-chat-single-message-container">
        <div class="livechat-chat-avatar">
          <div class="livechat-chat-avatar-container">
            <p class="livechat-chat-avatar-letter">E</p>
          </div>
        </div>
        <div class="livechat-chat-single-message" style={{"background-color": "rgb(55, 107, 126)"}}>
          <span>Hi I'm Genie. How can I help you?.</span>
          <div class="livechat-chat-message-arrow" style={{"border-right-color": "rgb(55, 107, 126)"}}></div>
        </div>
      </div>
    </>
  )
}
