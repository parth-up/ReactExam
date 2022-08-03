import { useEffect, useState } from "react";
import "./styles.css";
import { users } from "./userProfiles";
import Avatar from "./components/Avatar.js";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { v4 as uuidv4 } from "uuid";

TimeAgo.addDefaultLocale(en);

export default function App() {
  const [user, setUser] = useState({});
  const [postText, setPostText] = useState("");
  const [comments, setComments] = useState([]);
  const [showUpvotes, setShowUpvotes] = useState(false);

  useEffect(() => {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    setUser(randomUser);
  }, []);

  useEffect(() => {
    const commentsStorage = localStorage.getItem("Comments");
    if (commentsStorage) {
      setComments(JSON.parse(commentsStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Comments", JSON.stringify(comments));
  }, [comments]);

  const postComment = (e) => {
    e.preventDefault();
    let commentObj = {
      id: uuidv4(),
      user,
      text: postText,
      time: Date(),
      upvotes: [],
      replies: []
    };
    setComments((prev) => [...prev, commentObj]);
    setPostText("");
  };

  const upvotePost = (id) => {
    const i = comments.findIndex((el) => el.id === id);
    let data = [...comments];
    if (data[i].user.id === user.id) {
      return;
    } else if (data[i].upvotes.includes(user.id)) {
      function arrayRemove(arr, value) {
        return arr.filter(function (ele) {
          return ele !== value;
        });
      }
      data[i].upvotes = arrayRemove(data[i].upvotes, user.id);
      setComments(data);
    } else {
      data[i].upvotes.push(user.id);
      setComments(data);
    }
  };
  // you are not audible
  return (
    <div className="App">
      <div className="main-container">
        <h2 className="header">Discussion</h2>

        <form className="comment-create-container" onSubmit={postComment}>
          <Avatar width={40} height={40} imgUrl={user.profileImg} />
          <input
            className="comment-input"
            type="text"
            placeholder="What are your thoughts?"
            value={postText}
            maxLength={150}
            onChange={(e) => setPostText(e.target.value)}
          />
          <input
            className={postText ? "comment-submit" : "comment-submit-disabled"}
            type="submit"
            value="Comment"
            disabled={!postText}
          />
        </form>
        <hr />
        <div className="comments-container">
          {comments.map((comment, i) => {
            return (
              <div
                key={comment.id}
                className="single-comment-container"
                onClick={() => setShowUpvotes(true)}
              >
                <Avatar
                  width={40}
                  height={40}
                  imgUrl={comment.user.profileImg}
                />
                <div className="main-comment-container">
                  <div className="comment-title-container">
                    <span className="comment-author">
                      {comment.user.name + " "}
                    </span>
                    <span className="comment-time">
                      · <ReactTimeAgo date={comment.time} locale="en-US" />
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="vote-container">
                    <span
                      className="upvote"
                      onClick={() => {
                        upvotePost(comment.id);
                      }}
                    >
                      &#9650; Upvote
                    </span>
                    <span className="reply">Reply</span>
                  </div>
                </div>
                {showUpvotes && (
                  <div className="upvote-modal">
                    <h3 className="upvote-title">
                      Upvotes on this post{" "}
                      <span
                        className="close-button"
                        onClick={() => setShowUpvotes(false)}
                      >
                        X
                      </span>
                    </h3>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/***
 * comments
 * id
 * author
 * text
 * time
 * upvotes/downvote
 * author cannot upvote/downvote
 * upvote - user info
 */
