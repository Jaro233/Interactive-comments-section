import { useState, useEffect } from "react";
import { getComments as getCommentsApi, 
  createComment as createCommentApi, 
  deleteComment as deleteCommentApi,
  updateComment as updateCommentApi,
  upVoteScore as upVoteScoreApi,
  downVoteScore as downVoteScoreApi } 
  from "../api";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import CommentEditForm from "./CommentEditForm";

const Comments = ({currentUserId}) => {
    let commentsInStorage;

    const [backendComments, setBackendComments] = useState(() => {
      const storageComments = localStorage.getItem("backendComments");
      const parsedComments = JSON.parse(storageComments);
      commentsInStorage = JSON.parse(storageComments);
      return parsedComments || [] ;
    })

    
    
    console.log('backendComments', backendComments)
    const [activeComment, setActiveComment] = useState(null)
    const rootComments = backendComments.filter((backendComment) => 
    backendComment.parentId === null)
    
    

    const getReplies = (commentId) => {
      return backendComments.filter((backendComment) => backendComment.parentId === commentId)
    }

    const addComment = (text, parentId, replyingTo) => {
      console.log(text, parentId, replyingTo)
      createCommentApi(text, parentId, replyingTo).then(comment => {
        setBackendComments([...backendComments, comment])
        localStorage.setItem('backendComments', JSON.stringify([...backendComments, comment]));
        setActiveComment(null)
      })
    }

    const deleteComment = (commentId) => {
      const modal = document.querySelector(".modal-wrapper")
      const yesButton = document.querySelector(".yes")
      const noButton = document.querySelector(".no")
      modal.classList.remove("invisible") 
      yesButton.addEventListener("click", () => {
        modal.classList.add("invisible")
        deleteCommentApi(commentId).then(() => {
          const updatedBackendComments = backendComments.filter((backendComment) =>
          backendComment.id !== commentId
          )
          setBackendComments(updatedBackendComments)
          localStorage.setItem('backendComments', JSON.stringify(updatedBackendComments));
        })
      })
      noButton.addEventListener("click", () => {
        modal.classList.add("invisible")
      })
    }

    const updateComment = (text, commentId) => {
      updateCommentApi(text, commentId).then(() => {
        const updatedBackendComments = backendComments.map(backendComment => {
          if (backendComment.id === commentId) {
            return {...backendComment, content: text}
          }
          return backendComment
        })
        setBackendComments(updatedBackendComments)
        localStorage.setItem('backendComments', JSON.stringify(updatedBackendComments));
        setActiveComment(null)
      })
    }

    const upVoteScore = (score, commentId) => {
      upVoteScoreApi(score, commentId).then(() => {
        const updatedBackendComments = backendComments.map(backendComment => {
          if (backendComment.id === commentId) {
            const newScore = score += 1;
            console.log("new score",newScore)
            return {...backendComment, score: newScore}
          }
          return backendComment
        })
        setBackendComments(updatedBackendComments)
        localStorage.setItem('backendComments', JSON.stringify(updatedBackendComments));
      })
    }

    const downVoteScore = (score, commentId) => {

      downVoteScoreApi(score, commentId).then(() => {
        const updatedBackendComments = backendComments.map(backendComment => {
          if (backendComment.id === commentId) {
            if(score >= 1) {
              const newScore = score -= 1;
              console.log("new score",newScore)
              return {...backendComment, score: newScore}
            } 
          }
          return backendComment
        })
        setBackendComments(updatedBackendComments)
        localStorage.setItem('backendComments', JSON.stringify(updatedBackendComments));
        setActiveComment(null)
      })

    }

  
    useEffect(() => {
      if(!commentsInStorage) {
        getCommentsApi().then(data => {
          setBackendComments(data)
        })
      }
  }, [])
    

    return (
      <div className="comment-section">
        <div className="comments-wrapper">
            {rootComments.map((rootComment) => (
                <Comment key={rootComment.id} 
                comment={rootComment} 
                replies={getReplies(rootComment.id)} 
                currentUserId={currentUserId} 
                deleteComment={deleteComment} 
                updateComment={updateComment}
                activeComment={activeComment} 
                setActiveComment={setActiveComment} 
                upVoteScore={upVoteScore}
                downVoteScore={downVoteScore}
                addComment={addComment}/>
            ))}
        </div>
        <CommentForm submitLabel="SEND" handleSubmit={addComment}/>
      </div>
    );
  }
  
  export default Comments;