import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
const API_KEY="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";
function App() {
  const [typing,setTyping]=useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT"
    }
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message:message,
      direction:"outgoing",
      sender: "user"
    }; 

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);
    setTyping(true);
await processMessageToChatGPT(newMessages)
  };

async function processMessageToChatGPT(chatMessages) {
  let apiMessages=chatMessages.map((messageObject)=>{
    let role="";
    if(messageObject.sender==="ChatGPT"){role="assistant";}
    else {role="user";}
 return {role:role,content:messageObject.message}
  })
  const systemMessage={
role:"system",
content:"Ewplain all concepts like I am 10 years old."

  }
  const apiRequestBody={
    "model":"gpt-4o-mini",
    "messages":[systemMessage,
      ...apiMessages]
  }
  await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data)=>{return data.json()})
    .then((data)=>
    {console.log(data)
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setTyping(false);}
    )
}
  return (
    <>
    <div style={{position:"relative",height:"800px",width:"700px", textAlign:"left"}}>

<MainContainer>
          <ChatContainer>     
          <MessageList
          scrollBehavior='smooth'
           typingIndicator={typing? 
            <TypingIndicator content="chat gpt is typing"/>:null} >  
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
        </MainContainer>
    </div>
      
    </>
  )
}

export default App
