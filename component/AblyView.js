import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Streaming.module.css'
import { useChannel } from "./AblyReactEffect";
const AblyView = (props) => {
    let messageEnd = useRef();
    let inputBox = useRef();
    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState([]);

    useEffect(() => {
        messageEnd.current.scrollIntoView({ behaviour: "smooth" });
    });
    const [channel, ably] = useChannel("chat-demo", (message) => {
        // Here we're computing the state that'll be drawn into the message history
        // We do that by slicing the last 199 messages from the receivedMessages buffer

        const history = receivedMessages.slice(-199);
        setMessages([...history, message]);

        // Then finally, we take the message history, and combine it with the new message
        // This means we'll always have up to 199 message + 1 new message, stored using the
        // setMessages react useState hook
    });
    const messages = receivedMessages.map((data, index) => {
        return (data.connectionId === ably.connection.id ?
            <p className={styles.messageDiv}>
                <span key={index} className={styles.messageRecAlter} data-author="me">{data?.data?.message}</span>
                <span className={styles.usrNameMe}>me</span>
            </p>
            :
            <p className='d-flex align-items-center'>
                <span className={styles.otherName}>{data?.data?.user.split('')[0]}</span>
                <span><span key={index} className={styles.messageRec} data-author={data?.data?.user}><p className={styles.nameOther}>{data?.data?.user}</p>{data?.data?.message}</span></span>
            </p>
        );
    });
    const handleFormSubmission = (e) => {
        e.preventDefault();
        sendChatMessage(messageText);
    }
    const handleKeyPress = (e) => {
        if (e.charCode !== 13 || messageText.length === 0) {
            return;
        }
        sendChatMessage(messageText);
        e.preventDefault();
    }
    const sendChatMessage = (messageText) => {
        channel.publish({ name: "chat-message", data: { user: props.name, message: messageText } });
        setMessageText("");
        inputBox.current.focus();
    }
    return (
        <div className={styles.maincontainer}>
            <h3 className={styles.chatHeading}>CHAT</h3>
            <div className={styles.chatarea}>
                {messages}
                <div ref={messageEnd}></div>
            </div>
            <form onSubmit={handleFormSubmission} className={styles.messagearea}>
                <textarea
                    ref={inputBox}
                    value={messageText}
                    placeholder="Type a message..."
                    onChange={e => setMessageText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={styles.messagebox}
                ></textarea>
                <button type="submit" className={styles.messagebutton} disabled={messageText.length === 0}>Send</button>
            </form>
        </div>
    );
}

export default AblyView;
