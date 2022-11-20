import { updateComment } from "../api";
import CommentForm from "./CommentForm";
import CommentEditForm from "./CommentEditForm";
import { useState } from "react";


const Comment = ({comment, replies, currentUserId, deleteComment, updateComment, activeComment, addComment, setActiveComment, parentId = null, upVoteScore, downVoteScore}) => {
    // console.log('curre', currentUserId)

    const renderEditForm = () => {
      document.querySelector(".container").classList.remove("comment")
    }

    const fiveMinutes = 300000;
    // const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes
    const canReply = Boolean(currentUserId) && currentUserId != comment.user.userId;
    // console.log('first', canReply)
    const canEdit = currentUserId == comment.user.userId;
    // with proper time
    // const canEdit = currentUserId === comment.user.userId && !timePassed
    const canDelete = currentUserId == comment.user.userId;
    const isReplying = activeComment && activeComment.type === "replying" && activeComment.id === comment.id
    const isEditing = activeComment && activeComment.type === "editing" && activeComment.id === comment.id
    const replyId = parentId ? parentId : comment.id
    const createdAt = new Date(comment.createdAt).toLocaleDateString()

    // removing user tag from comment text
    const commentContent = comment.content.replace("@" + comment.replyingTo + ",", "")
    
    console.log('commentContent', commentContent)
    console.log('replyId', replyId)

    return (
    <div className="comment-wrapper" key={comment.id}>
      {!isEditing && (
      <div className="comment container" >
        <div className="comment-score">
          <img src={`${process.env.PUBLIC_URL}/images/icon-plus.svg`} alt="plus" className="score-control score-plus" onClick={() => upVoteScore(comment.score, comment.id)}/>
          <p className="score-number">{comment.score}</p>
          <img src={`${process.env.PUBLIC_URL}/images/icon-minus.svg`} alt="minus" className="score-control score-minus" onClick={() => downVoteScore(comment.score, comment.id)}/>
        </div>
        <div className="comment-controls">
          {canDelete && 
          <div className="delete" onClick={() => deleteComment(comment.id)}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-delete.svg`} alt="delete" className="control-icon" />
            Delete
          </div>
          }
          {canEdit &&
          <div className="edit" onClick={() => setActiveComment({id: comment.id, type: "editing"})}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-edit.svg`} alt="edit" className="control-icon" onClick={() => renderEditForm()}/>
            Edit
          </div>
          }
          {canReply &&
          <div className="reply" onClick={() => setActiveComment({id: comment.id, type: "replying"})}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-reply.svg`} alt="reply" className="control-icon"/>
            Reply
          </div>
          }
        </div>
        <div className="comment-user">
          <img src={`${process.env.PUBLIC_URL}/images/avatars/${comment.user.image.png}`} alt="user" className="user-img"/>
          {comment.user.userId == 1 && (
            <p className="user-name current-user">{comment.user.username}</p>
          )}
          {comment.user.userId != 1 && (
            <p className="user-name">{comment.user.username}</p>
          )}
          <p className="comment-at">{createdAt}</p>
        </div>
        {/* <p className="comment-text"> */}
          
          {!isEditing && 
          <p className="comment-text">
          <span className="comment-body"><span className="reply-to">{comment.replyingTo ? "@" + comment.replyingTo : comment.replyingTo} </span>{commentContent}</span>
          </p>
          }
          {isEditing && (
            <CommentEditForm submitLabel="UPDATE" 
            hasCancelButton
            initialText={comment.content} 
            handleSubmit={(text) => updateComment(text, comment.id)} 
            handleCancel={() => setActiveComment(null)}/>
          )}
        {/* </p> */}
      </div>
      )}


      {isEditing && (
      <div className="comment-editing container" >
        <div className="comment-score">
        <img src={`${process.env.PUBLIC_URL}/images/icon-plus.svg`} alt="plus" className="score-control score-plus" onClick={() => upVoteScore(comment.score, comment.id)}/>
          <p className="score-number">{comment.score}</p>
          <img src={`${process.env.PUBLIC_URL}/images/icon-minus.svg`} alt="minus" className="score-control score-minus" onClick={() => downVoteScore(comment.score, comment.id)}/>
        </div>
        <div className="comment-controls">
        {canDelete && 
          <div className="delete" onClick={() => deleteComment(comment.id)}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-delete.svg`} alt="delete" className="control-icon" />
            Delete
          </div>
          }
          {canEdit &&
          <div className="edit" onClick={() => setActiveComment({id: comment.id, type: "editing"})}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-edit.svg`} alt="edit" className="control-icon" onClick={() => renderEditForm()}/>
            Edit
          </div>
          }
          {canReply &&
          <div className="reply" onClick={() => setActiveComment({id: comment.id, type: "replying"})}>
            <img src={`${process.env.PUBLIC_URL}/images/icon-reply.svg`} alt="reply" className="control-icon"/>
            Reply
          </div>
          }
        </div>
        <div className="comment-user">
          <img src={`${process.env.PUBLIC_URL}/images/avatars/${comment.user.image.png}`} alt="user" className="user-img"/>
          {comment.user.userId == 1 && (
            <p className="user-name current-user">{comment.user.username}</p>
          )}
          {comment.user.userId != 1 && (
            <p className="user-name">{comment.user.username}</p>
          )}
          <p className="comment-at">{comment.createdAt}</p>
        </div>
        {/* <p className="comment-text"> */}
          {/* <span className="reply-to">{comment.replyingTo ? "@" + comment.replyingTo : comment.replyingTo} </span> */}
          {!isEditing && 
          <p className="comment-text">
          <span className="comment-body"><span className="reply-to">{comment.replyingTo ? "@" + comment.replyingTo : comment.replyingTo} </span>{comment.content}</span>
          </p>
          }
          {isEditing && (
            <CommentEditForm submitLabel="UPDATE" 
            hasCancelButton
            initialText={comment.content} 
            handleSubmit={(text) => updateComment(text, comment.id)} 
            handleCancel={() => setActiveComment(null)}/>
          )}
        {/* </p> */}
      </div>
      )}
      {isReplying && (
        <div className="replies comments-wrapper">
          <CommentForm username={comment.user.username} submitLabel="REPLY" handleSubmit={(text) => addComment(text, replyId, comment.user.username)}/>
        </div>
      )}
      {replies.length > 0 && (
          <div className="replies comments-wrapper">
            {replies.map(reply => (
              <Comment 
              comment={reply} 
              key={reply.id} 
              replies={[]} 
              currentUserId={currentUserId} 
              deleteComment={deleteComment} 
              updateComment={updateComment}
              parentId={comment.id} 
              addComment={addComment} 
              activeComment={activeComment} 
              upVoteScore={upVoteScore}
              downVoteScore={downVoteScore}
              setActiveComment={setActiveComment}/>
            ))}
          </div>
        )}
      <div className="modal-wrapper invisible">
        <div className="modal container">
          <h3>Delete comment</h3>
          <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
          <button className="yes">YES, DELETE</button>
          <button className="no">NO, CANCEL</button>
        </div>
      </div>
    </div>
    );
  }
  
  export default Comment;