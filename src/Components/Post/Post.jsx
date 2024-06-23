import React, { useContext, useEffect, useState,useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLoveCount, addComment, updateCommentCount, deleteArticle, postArticleToAPI } from '../../redux/Articles/articlesActions';
import avatar from "../../assets/Default_avatar.png";
import menu from "../../assets/meuePost.png";
import like from "../../assets/like.png";
import likeIcon from "../../assets/likeFooter.png";
import comment from "../../assets/comment.png";
import save from "../../assets/save.png";
import send from "../../assets/send.png";
import "./Post.css";
import ReactPlayer from 'react-player';
import edit from "../../assets/edit.png";
import Delete from "../../assets/delete.png";
import loveSound from "../../assets/like.mp4"
import likeActiveIcon from "../../assets/likeActive.png";
import add from "../../assets/addComment.png"
import PopupEdit from '../PopupEditing/PopupEdit';
import exitWhite from "../../assets/exitWhite.png";
import noCommentsYet from "../../assets/noCommetsYet.png"
import likeComment from "../../assets/likeComment.png"
import reply from "../../assets/replyComment.png";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { User } from "../Context/userContext";
import PopupCommint from '../PopupEditing/PopupCommint';
import AddReply from '../PopupEditing/addReply';
import PopupReply from '../PopupEditing/PopupReply';
import axiosInstance from '../../api/axiosConfig';
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router';
  
const cookies = new Cookies();
const token = cookies.get("Bearer");
const role=cookies.get("role")
const Post = ({ handleOverlay,fetchArticles,getUser,currentuser ,currentuserimage}) => {
  const { auth } = useContext(User);
  const [showeMenuOption, setShowMeneOption] = useState(false);
  const handelShoweMenuOption = (postId) => {
    setShowMeneOption((prevShowMeneOption) => postId === prevShowMeneOption ? false : postId);
  };

  const userData = useSelector(state => state.register.userData);
  const { firstName, lastName } = userData;

  const articles = useSelector(state => state.articles.articles);
  const [datetimeStr, setDatetimeStr] = useState('');
  const [comments, setComments] = useState([]);
  const [postID, setPostID] = useState('');
  const [dateStr, setDateStr] = useState('2024-06-20');
  const [timeStr, setTimeStr] = useState('02:17');
  const dispatch = useDispatch();
  const reversedArticles = [...articles].reverse();

  const [playSound, setPlaySound] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeActive, setLikeActive] = useState(false);
  const handleLoveClick = (article) => {
    setPlaySound(true);
    setLikeActive(!likeActive);
    const updatedLikeCount = likeActive ? likeCount - 1 : likeCount + 1;
    setLikeCount(updatedLikeCount);
    dispatch(updateLoveCount(article.id, updatedLikeCount));
  }
  if (playSound) {
    const audio = new Audio(loveSound);
    audio.play();
    setPlaySound(false);
  }
  const [showCommentsMap, setShowCommentsMap] = useState({});
  const handleshowComments = async (postId, show = true) => {/////////////fetch commm
    setPostID(postId);
    setShowCommentsMap(prevState => ({
      ...prevState,
      [postId]: show
    }));
    handleOverlay(true);
    try {
      const response = await axiosInstance.get(`/post/${postId}/getPostComments`, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
      });
      const updatedComments = response.data.comments.map(comment => {
        const updatedReplies = comment.replies.map(reply => ({
          ...reply,
          commintID: comment._id
        }));
        return { ...comment, replies: updatedReplies };
      });
      fetchArticles();
      setComments(updatedComments);
      console.log("commmm",updatedComments);

    } catch (error) {
      console.log(error.message);

    }
  };


  const handleDeleteArticle = async (articleId) => {///////////////done
    try {
      // Make an Axios DELETE request to the server to delete the article
      //https://mentora-5s1z.onrender.com/api/post/deletePost
      const response = await axiosInstance.delete(`/post/${articleId}/deletePost`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        fetchArticles()
        dispatch(deleteArticle(articleId));
        console.log('Article deleted successfully');
      }
    } catch (error) {
      console.log('Error deleting the article:', error);
    }
  };

  


  const [description, setdescription] = useState('')
///////////////////////////////////////////////////////////post commmmmm
  const handelPostComment = async (article) => {//////////////ddone
    console.log(article._id);
    console.log(description);
    console.log(auth.Token);
    try {
      const response = await axiosInstance.post(`/post/${article._id}/addComment`, { content: description }, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
      handleshowComments(article._id, true); 
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const [PopupType, setPopupType] = useState(null)
  const handlePopupType = (type) => {
    setPopupType(type);
  };


  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showEditCommint, setShowEditCommint] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedcommint, setSelectedCommint] = useState(null);
  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    handleOverlay(true)
    setShowEditPopup(true);
    setShowMeneOption();
  };
  const handleEditCommint = (commint) => {
    setSelectedCommint(commint);
    setShowEditCommint(true);
    setShowMeneOption();
  };
  // const handleEditReply = (reply) => {
  //   setSelectedReply(reply);
  //   setShowEditReply(true);
  //   setShowMeneOption();
  // };
  // const handleEditPost = (post) => {
  //   setSelectedPost(post);
  //   setShowEditPost(true);
  //   setShowMeneOption();
  // };
  useEffect(() => {
    if (articles.date) {
      let dateValue = '2024-06-20T12:02:17.619Z';
      if (typeof dateValue !== 'string') {
        dateValue = dateValue.toString();
      }


      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate)) {
        setDatetimeStr(dateValue);
      } else {
        console.log('Invalid date format:', dateValue);
      }
    }
  }, []);


  // const fetchArticles = async () => {
  //   try {
  //     const response = await axiosInstance.get("/post/", {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         'Content-Type': 'application/json',
  //       },
        
  //     });
  //     // setArticles(response.data);
  //     // dispatch(setArticles(response.data));
  //     console.log("success : ",response.data);
  //   } catch (error) {
  //     console.log("Error fetching articles:", error);
  //   }
  // };

  useEffect(() => {
    if (datetimeStr) {
      const parsedDate = new Date(datetimeStr);
      if (!isNaN(parsedDate)) {
        setDateStr(parsedDate.toISOString().split('T')[0]);
        setTimeStr(parsedDate.toTimeString().split(' ')[0]);
      }
      else {
        console.log('Invalid date');
      }
    }
    console.log("date is ", dateStr);
    console.log("time is ", timeStr);
  }, [comments]);
  const handleDeleteComment = async (commentId) => { ///////404
    try {
      const response = await axiosInstance.delete(`/post/${postID}/${commentId}/deleteComment`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        console.log('Comment deleted successfully');
        // Optionally, update your state here
      }
    } catch (error) {
      console.error('Error deleting the comment:', error);
    }
  };
  const handleDeleteReply = async (reply, commintID) => {
    try {
      const response = await axiosInstance.delete(`/post/${postID}/${commintID}/${reply}/deleteReply`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        console.log('Reply deleted successfully');
        handleOverlay(false);
        setShowCommentsMap(true)
      }
    } catch (error) {
      console.error('Error deleting the Reply:', error);
    }
  }
  const handleReactReply = async (reply, commintID) => {
    try {
      console.log(auth.Token);
      const response = await axiosInstance.post(`/post/${postID}/${commintID}/${reply}/reactReply`,{}, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
      if (response.status === 200) {
        console.log(' React Reply successfully');
        handleOverlay(false);
        setShowCommentsMap(true)
      }
    } catch (error) {
      console.error('Error React the Reply:', error);
    }
  }
  const handleReactComment=async (commintID)=>{////////done
    try {
      // console.log(auth.Token);
      const response = await axiosInstance.post(`/post/${postID}/${commintID}/reactComment`,
        {}, {
          headers: {
            Authorization: "Bearer " + token,
          },
      });
      if (response.status === 200) {
        console.log(' react Comment successfully');
        handleOverlay(false);
        setShowCommentsMap(true)
      }
    } catch (error) {
      console.error('Error react the Comment:', error);
    }
  }
  const handleReactPost=async (idPost)=>{  ///////////done
    try {
      console.log(auth.Token);
      const response = await axiosInstance.post(`/post/${idPost}/reactPost`,{}, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
      });
        
        console.log('hiiiiiiii react Post successfully',response.data);
        fetchArticles();
        handleOverlay(false);
        setShowCommentsMap(true)
        setPlaySound(true);
      
    } catch (error) {
      console.error('Error react The Post :', error);
    }
  }
  const handleSharePost = async (idPost) => {/////////done
    try {
      console.log(auth.Token);
      const response = await axiosInstance.post(
        `post/${idPost}/sharePost`,
        {}, 
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 200) {
        console.log('Share Post successfully');
        handleOverlay(false);
        setShowCommentsMap(true);
      }
      console.log(response);
    } catch (error) {
      console.error('Error Share The Post :', error);
    }
  };
  
  const handleSavePost = async (idPost) => {/////////////done
    try {
      
      const response = await axiosInstance.post(
        `/post/${idPost}/savePosts`,
        {},  
        {
          headers: {
          Authorization: "Bearer " + token,
        },
        }
      );
      if (response.status === 200) {
        console.log('Save Post successfully');
        handleOverlay(false);
        setShowCommentsMap(true);
      }
    } catch (error) {
      console.log('Error saving the post:', error.response ? error.response.data : error.message);
    }
  };
  
  const [showReply, setShowReply] = useState(false);
  const handleShowReply = (commentId) => {
    setShowReply(true);
    setSelectedCommint(commentId)
  }


  // Function to convert date to ISO 8601 format
  const convertToISO = (dateStr) => {
    try {
      return new Date(dateStr).toISOString();
    } catch (error) {
      return 'Invalid Date';
    }
  };
  const formattedComments = comments.map((item) => {
    const newItem = { ...item, date: convertToISO(item.date) };
    newItem.replies = newItem.replies.map((reply) => ({
      ...reply,
      date: reply.date, // Assuming reply dates are already in ISO format
    }));
    return newItem;
  });
  // console.log(formattedComments);
  // console.log(comments);
  const [showViewReplies, setShowViewReplies] = useState(false)




 



// console.log("hhuuuu",currentuser,"fffff",articles[0].author.id)


const navigate = useNavigate();
const navigationtoProfile=(id)=>{
  if(role==="Admin"){
    navigate("/profileSystemAdmin",{state:{userId:id}})
  }
  else{
    navigate("/profile",{state:{userId:id}})
  }
}
  // Define handleNavigation function directly in the component scope
  

  // useEffect(() => {

  // }, []);



  return (
    <>
      {reversedArticles.map((article, index) => (
        <div className='post' key={index}>
          <div className="post-header">
            <div className="user-info">
              <img src={article.author.profilePicture?article.author.profilePicture:avatar} alt="not found" onClick={()=>navigationtoProfile(article.author.id)}/>
              <div className="user-details">
                <h3>{article.author.firstName} {article.author.lastName}</h3>
                <p>{dateStr} {timeStr}</p>
              </div>
            </div>
            {article.author.id===currentuser &&<img
              src={menu}
              alt="not found"
              className='menu'
              onClick={() => { handelShoweMenuOption(article._id) }}
            />}
            
            {showeMenuOption === article._id &&
              <div className="options">
                <div className="edit" onClick={() => handleEditArticle(article)}>
                  <img src={edit} alt="not found" />
                  <span>edit</span>
                </div>
                <div className="delete" onClick={() => handleDeleteArticle(article._id)}>
                  <img src={Delete} alt="not found" />
                  <span>delete</span>
                </div>
              </div>
            }
          </div>
          <p className="description">{article.content}</p>
          {article.isImage && <img src={URL.createObjectURL(article.image)} alt="not found" className='Shared' />}
          {article.isVideo && <ReactPlayer width="100%" height="200px" url={article.video} />}
          {article.isVideoUploaded &&
            <video controls style={{ width: '100%', height: '200px' }}>
              <source src={URL.createObjectURL(article.videoUploaded)} type={article.videoUploaded.type} />
            </video>}
          <div className="noOfReactsComments">
            <div className="noOfReacts">
              <img src={like} alt="not found" />
              <p>{article.reactsCount}</p>
            </div>
            <div className="noOfComments">
              <p>{article.commentsCount} comments</p>
            </div>
          </div>
          <div className="post-footer">
            <div className="item" onClick={() => handleReactPost(article._id)}>
              {article.loveCount > 0 ? <img src={likeActiveIcon} alt='not found' /> : <img src={likeIcon} alt="not found" />}
              <p>like</p>
            </div>
            <div className="item" onClick={() => handleshowComments(article._id)}>
              <img src={comment} alt="not found" />
              <p>comment</p>
            </div>
            <div className="item" onClick={() => handleSavePost(article._id)}>
              <img src={save} alt="not found" />
              <p>save</p>
            </div>
            <div className="item" onClick={() => handleSharePost(article._id)}>
              <img src={send} alt="not found" />
              <p>send</p>
            </div>
          </div>

          {showCommentsMap[article._id] && ////////////fjjfjfjfjfjfjfjfj
            <div className="container-comments">
              <div className="header-comment">
                <img src={exitWhite} alt="not found" onClick={() => { handleshowComments(article._id, false); handleOverlay(false); }} />
              </div>
              <div className="post-comment">
                <img src={currentuserimage?currentuserimage:avatar} alt="not found" className='avatar' />
                <div className="input-comment">
                  <input
                    type="text"
                    autoFocus
                    placeholder='leave a comment'
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                  />
                  <div className="button" onClick={() => handelPostComment(article)}>
                    <button>add</button>
                    <img src={add} alt='not found' />
                  </div>
                </div>
              </div>
              {formattedComments.length > 0 ?
                formattedComments.map((comment, index) => (
                  <>
                    <div key={index} className="comment">
                      <img src={comment.authorProfilePicture?comment.authorProfilePicture:avatar} alt="not found" className='avatar' />
                      <div className="comment-details">
                        <div className="all-above">
                          <div className="above">
                            <p className="comment-user">{comment.authorName}</p>
                            <span>{comment.date}</span>
                          </div>
                          <img src={menu} alt="not found" className='menu' onClick={() => { handelShoweMenuOption(comment._id) }} />
                          {showeMenuOption === comment._id &&
                            <div className="options options-2">
                              <div className="edit" onClick={() => handleEditCommint(comment)}>
                                <img src={edit} alt="not found" />
                                <span style={{ color: "#fff", padding: "0rem 1rem" }}>edit</span>
                              </div>
                              <div className="delete" style={{ color: "#fff" }} onClick={() => handleDeleteComment(comment._id)}>
                                <img src={Delete} alt="not found" />
                                <span style={{ color: "#fff", padding: "0rem 1rem" }}>delete</span>
                              </div>
                            </div>
                          }
                        </div>
                        <p className="comment-description">{comment.content}</p>
                        <div className="Actions" style={{ margin: "0rem 0rem -0.2rem" }}>
                          <div className="likeComment">
                            <img src={likeComment} alt="not found" onClick={() => handleReactComment(comment._id)}/>
                            <p>{comment.reactsCount} likes</p>
                          </div>
                          <div className="replyComment" onClick={() => handleShowReply(comment._id)}>
                            <img src={reply} alt="not found" />
                            <p>{comment.repliesCount} reply</p>
                          </div>
                          {comment.repliesCount > 0 ? (
                            showViewReplies ? (
                              <div className="replyComment" onClick={() => setShowViewReplies(false)}>
                                <p>Hide replies</p>
                              </div>
                            ) : (
                              <div className="replyComment" onClick={() => setShowViewReplies(true)}>
                                <p>View replies</p>
                              </div>
                            )
                          ) : (
                            ""
                          )}

                        </div>
                      </div>
                    </div>
                    {comment.repliesCount > 0 && showViewReplies &&
                      comment.replies.map((reply, index) => (
                        <div key={index} className="comment" style={{ marginLeft: "3rem", width: "90%" }}>
                          <img src={avatar} alt="not found" className='avatar' />
                          <div className="comment-details">
                            <div className="all-above">
                              <div className="above">
                                <p className="comment-user">{reply.authorName}</p>
                                <span>{reply.date}</span>
                              </div>
                              <img src={menu} alt="not found" className='menu' onClick={() => { handelShoweMenuOption(reply._id) }} />
                              {showeMenuOption === reply._id &&
                                <div className="options options-2">
                                  {/* <div className="edit" onClick={() => handleEditReply(reply)}>
                                    <img src={edit} alt="not found" />
                                    <span style={{ color: "#fff", padding: "0rem 1rem" }}>edit</span>
                                  </div> */}
                                  <div className="delete" style={{ color: "#fff" }} onClick={() => handleDeleteReply(reply._id, reply.commintID)}>
                                    <img src={Delete} alt="not found" />
                                    <span style={{ color: "#fff", padding: "0rem 1rem" }}>delete</span>
                                  </div>
                                </div>
                              }
                            </div>
                            <p className="comment-description">{reply.content}</p>
                            <div className="Actions" style={{ margin: "0rem 0rem -0.2rem" }}>
                              <div className="likeComment" onClick={() => handleReactReply(reply._id, reply.commintID)}>
                                <img src={likeComment} alt="not found" />
                                <p>{reply.reactsCount} likes</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </>
                ))
                :
                <div className="noComments">
                  <img src={noCommentsYet} alt="not found" />
                </div>
              }
            </div>
          }
        </div>
      ))}
      <PopupEdit
        type={PopupType}
        ShowPopup={showEditPopup}
        handleShowPopup={() => setShowEditPopup(false)}
        editArticleData={selectedArticle}
        handlePopupType={handlePopupType}
        handleOverlay={handleOverlay}
        fetchArticles={fetchArticles}
      />
      <PopupCommint
        ShowPopup={showEditCommint}
        showEditCommint={() => setShowEditCommint(false)}
        editCommintData={selectedcommint}
        handlePopupType={handlePopupType}
        idPost={postID}
      />
      <AddReply
        ShowPopup={showReply}
        showEditCommint={() => setShowReply(false)}
        editCommintData={selectedcommint}
        idPost={postID}
        handlePopupType={handlePopupType}
        handleshowComments={handleshowComments}
      />
      {/* <PopupReply
        ShowPopup={showEditReply}
        showEditReply={() => setShowEditCommint(false)}
        editCommintData={selectedreply}
        handlePopupType={handlePopupType}
        idPost={postID}
      /> */}
    </>

  );
}

export default Post;
