import { useState } from "react";


const CommentForm = ({username, handleSubmit, submitLabel, hasCancelButton = false,  initialText="", handleCancel}) => {
    initialText = username ? `@${username}, ` : ""
    const [text, setText] = useState(initialText)
    const isTextareaDisabled = text.length === 0;
    const onSubmit = event => {
      event.preventDefault();
      handleSubmit(text)
      setText("")
    }

    // let newText = document.querySelector(".comment-input").textContent
    // newText.split(' ', 1)

    // text.split(" ", 1)
  
    return (
      <form onSubmit={onSubmit} className="reply-input container">
        <img src="./images/avatars/image-juliusomo.png" alt="user" className="user-img"/>
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="comment-input" placeholder="Add a comment..."></textarea>
        <button className="btn-primary" disabled={isTextareaDisabled}>{submitLabel}</button>
        {hasCancelButton && (
          <button className="btn-primary" onClick={handleCancel}>Cancel</button>
        )}
      </form>
    );
  }
  
  export default CommentForm;