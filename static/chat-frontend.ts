//App.js
import React, { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");
socket.emit("init", { name: "Min" }); //소켓 초기화 후 실행
function Chat() {
  const [chatArr, setChatArr] = useState([]);
  const [sendChatArr, setSendChatArr] = useState([]);
  const [chat, setChat] = useState({ name: "", message: "" });

  //메세지 받는 부분(서버로부터)
  useEffect(() => {
    socket.on("receive message", (message) => {
      setChatArr((chatArr) => chatArr.concat(message));
      console.log(message);
    }); //receive message이벤트에 대한 콜백을 등록해줌
  }, []);

  const buttonHandler = () => {
    socket.emit("send message", { name: chat.name, message: chat.message });
    setSendChatArr([...sendChatArr, chat]);
    //버튼을 클릭했을 때 send message이벤트 발생
  };

  //이벤트 핸들러 함수
  const changeMessage = (e) => {
    setChat({ name: chat.name, message: e.target.value });
  };

  //이벤트 핸들러 함수
  const changeName = (e) => {
    setChat({ name: e.target.value, message: chat.message });
  };

  return (
    <div className="App">
      <div className="Box">
        <div className="ChatBox">
          {sendChatArr.map((ele, index) => (
            <div className="Chat" key={index}>
              <div>{이름:${ele.name}}</div>
              <div className="ChatLog">{채팅내용: ${ele.message}}</div>
            </div>
          ))}
        </div>
        <div className="InputBox">
          <input placeholder="내용" onChange={changeMessage}></input>
          <input placeholder="이름" onChange={changeName}></input>
          <button onClick={buttonHandler}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;