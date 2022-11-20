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

import {db} from '../firebase'
import {collection, addDoc, deleteDoc, documentId, doc, getDoc, updateDoc, Timestamp, query, onSnapshot} from 'firebase/firestore'


const Comments = ({currentUserId}) => {
    const [backendComments, setBackendComments] = useState([]) 
    
    console.log('backendComments', backendComments)
    const [activeComment, setActiveComment] = useState(null)
    const rootComments = backendComments.filter((backendComment) => 
    backendComment.parentId === null)

    let commentsInDatabase;
    const getDocuments = async () => {
       
      const docRef = doc(db,'backendComments', 'backendComments')
      const docSnap = await getDoc(docRef);
      console.log('docSnap', docSnap.data().backendComments)
      setBackendComments(docSnap.data().backendComments)
      commentsInDatabase = 1;
      console.log('commentsInDatabase', commentsInDatabase)
    }

    const getReplies = (commentId) => {
      return backendComments.filter((backendComment) => backendComment.parentId === commentId)
    }

    const addComment = (text, parentId, replyingTo) => {
      console.log(text, parentId, replyingTo)
      createCommentApi(text, parentId, replyingTo).then(comment => {
        setBackendComments([...backendComments, comment])
        const docRef = doc(db,'backendComments', 'backendComments')
        updateDoc(docRef,{
          backendComments: [...backendComments, comment]
        })
        // localStorage.setItem('backendComments', JSON.stringify([...backendComments, comment]));
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
          const docRef = doc(db,'backendComments', 'backendComments')
          updateDoc(docRef,{
            backendComments: updatedBackendComments
          })
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
        const docRef = doc(db,'backendComments', 'backendComments')
        updateDoc(docRef,{
          backendComments: updatedBackendComments
        })
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
        const docRef = doc(db,'backendComments', 'backendComments')
        updateDoc(docRef,{
          backendComments: updatedBackendComments
        })
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
        const docRef = doc(db,'backendComments', 'backendComments')
        updateDoc(docRef,{
          backendComments: updatedBackendComments
        })
        setActiveComment(null)
      })

    }

  
    useEffect(() => {
      // commentsInDatabase = 0
      getDocuments();
      console.log('commentsInDatabase', commentsInDatabase)
      console.log('backendComments', backendComments.length)
      if(commentsInDatabase == 0 && backendComments.length == 0) {
        getCommentsApi().then(data => {
          setBackendComments(data)
          const docRef = doc(db,'backendComments', 'backendComments')
          updateDoc(docRef,{
            backendComments: data
          })
        })
        commentsInDatabase += 1
      }

      
      
  })
      
    

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