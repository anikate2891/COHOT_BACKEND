import React, { useState } from 'react'

const Post = ({user , post}) => {

  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  return (
    <div className="feed">

      <div className="username">
        <div className="profile-img">
          <img src={user.profileImage} alt="profile" />
        </div>
        <p>{user.name}</p>
      </div>

      <div className="content">
        <div className="content-img">
          <img src={post.imgUrl} alt="post" />
        </div>
      </div>

      <div className="actions">

        <div className="left">

          <i
            className={`heart ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <i className={liked ? "ri-heart-fill" : "ri-heart-line"}></i>
          </i>

          <i className="comment">
            <i className="ri-chat-1-line"></i>
          </i>

          <i className="share">
            <i className="ri-share-line"></i>
          </i>

        </div>

        <div
          className="right"
          onClick={() => setSaved(!saved)}
        >
          <i className={saved ? "ri-bookmark-fill" : "ri-bookmark-line"}></i>
        </div>

      </div>

      <div className="captions">
        <p>{post.caption}</p>
      </div>

    </div>
  )
}

export default Post