// //App.js
// import React, { useCallback, useEffect, useState } from "react";
// import io from "socket.io-client";
// const socket = io.connect("http://localhost:3000");
// socket.emit("init", { name: "Min" }); //소켓 초기화 후 실행
// function Chat() {
//   const [chatArr, setChatArr] = useState([]);
//   const [sendChatArr, setSendChatArr] = useState([]);
//   const [chat, setChat] = useState({ name: "", message: "" });

//   //메세지 받는 부분(서버로부터)
//   useEffect(() => {
//     socket.on("receive message", (message) => {
//       setChatArr((chatArr) => chatArr.concat(message));
//       console.log(message);
//     }); //receive message이벤트에 대한 콜백을 등록해줌
//   }, []);

//   const buttonHandler = () => {
//     socket.emit("send message", { name: chat.name, message: chat.message });
//     setSendChatArr([...sendChatArr, chat]);
//     //버튼을 클릭했을 때 send message이벤트 발생
//   };

//   //이벤트 핸들러 함수
//   const changeMessage = (e) => {
//     setChat({ name: chat.name, message: e.target.value });
//   };

//   //이벤트 핸들러 함수
//   const changeName = (e) => {
//     setChat({ name: e.target.value, message: chat.message });
//   };

//   return (
//     <div className="App">
//       <div className="Box">
//         <div className="ChatBox">
//           {sendChatArr.map((ele, index) => (
//             <div className="Chat" key={index}>
//               <div>{이름:${ele.name}}</div>
//               <div className="ChatLog">{채팅내용: ${ele.message}}</div>
//             </div>
//           ))}
//         </div>
//         <div className="InputBox">
//           <input placeholder="내용" onChange={changeMessage}></input>
//           <input placeholder="이름" onChange={changeName}></input>
//           <button onClick={buttonHandler}>등록</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [message, setMessage] = useState();
  const [nickName, setNickName] = useState("");
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState("");
  const messageDiv = useRef(null);
  useEffect(() => {
    const socket = io("http://localhost:3000/chat");
    const nickname = prompt("닉네임을 알려주세요.");
    const room = prompt("입장할 방의 코드를 적어주세요.");
    if (!(nickname && room)) {
      alert("다시 입력해주세요.");
      window.location.reload();
    }
    socket.emit("message", nickname, room);
    socket.on("connect", () => {
      /* 누군가 채팅침 */
      socket.on(room, (data) => {
        console.log("data:", data);
        // setOtherSendMessage([...myOtherSendMessage, data]);
        messageDiv.current.append(`${data[0]} : ${data[1]}`);
      });
      /* 누군가 입장 */
      socket.on("receive" + room, (receive) => {
        console.log("receive", receive);
        // setReceive([...Receive, receive]);
        messageDiv.current.append(`${receive}`);
      });
    });
    setNickName(nickName);
    setRoom(room);
    setSocket(socket);
  }, []);

  const messageHandler = (e: any) => {
    setMessage(e.target.value);
  };

  function msg_send() {
    /* 메시지 전송 */
    console.log("전송?");
    // setMySendMessage([...mySendMessage, message]);
    socket.emit("send", room, nickName, message);
    messageDiv.current.append(`나:${message}`);
  }

  return (
    <div>
      <h1>
        재형이의 시크릿쥬쥬 <span id="room"></span>
      </h1>

      <div id="chatList">
        <li ref={messageDiv}></li>
      </div>

      <div id="sendMessage">
        <input type="text" id="msg" onChange={messageHandler} />
        <button onClick={msg_send}>제출</button>
      </div>
    </div>
  );
};

export default Chat;