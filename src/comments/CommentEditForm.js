import { useState } from "react";
const CommentEditForm = ({handleSubmit, submitLabel, hasCancelButton = false,  initialText="", handleCancel}) => {
  const [text, setText] = useState(initialText)
  const isTextareaDisabled = text.length === 0;
  const onSubmit = event => {
    event.preventDefault();
    handleSubmit(text)
    setText("")
  }

    
  
    // const autoResize = () => {
    //     const textarea = document.querySelector(".comment-input");
    //     textarea.addEventListener('input', autoResize, false);
    //     this.style.height = 'auto';
    //     this.style.height = this.scrollHeight + 'px';
    // }

    return (
      <form onSubmit={onSubmit} className="reply-input-edit">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="comment-input" placeholder="Add a comment..."></textarea>
        <button className="btn-primary" disabled={isTextareaDisabled}>{submitLabel}</button>
      </form>
    );
  }
  
  export default CommentEditForm;