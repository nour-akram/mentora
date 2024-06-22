import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./CommunityPageBody.css";
import avatar from "../../../assets/Default_avatar.png";
import menu from "../../../assets/menuQuestion.png";
import answer from "../../../assets/answer.png";
import Cookies from "universal-cookie";
import axiosInstance from '../../../api/axiosConfig';
import defaultAvatar from "../../../assets/Default_avatar.png";
import loved from "../../../assets/likeComment.png"
const CommunityPageBody = ({ selectedCommunity }) => {
  const [inputValue, setInputValue] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [replyInput, setReplyInput] = useState("");
  const [replyError, setReplyError] = useState(""); // New state for reply error message
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isPopupMenuOpen, setIsPopupMenuOpen] = useState(false);
  const popupMenuRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [AllQuestions, setAllQuestions] = useState([]);
  const [showAnswerMap, setShowAnswerMap] = useState({});
  const [answers, setAnswers] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const cookies = new Cookies();
  const token = cookies.get("Bearer");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupMenuRef.current && !popupMenuRef.current.contains(event.target)) {
        handlePopupMenuClose();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setErrorMessage("");
  };

  const handleReplyInputChange = (e) => {
    setReplyInput(e.target.value);
    setReplyError(""); 
  };

  const handlePopupMenuClose = () => {
    setSelectedMessageId(null);
    setIsPopupMenuOpen(false);
  };

  const handleSendEdit = () => {
    if (!editingQuestionId) return;

    const updatedQuestions = AllQuestions.map((question) =>
      question._id === editingQuestionId
        ? {
            ...question,
            content: inputValue,
          }
        : question
    );

    setAllQuestions(updatedQuestions);
    setInputValue("");
    setFilePreview(null);
    setEditingQuestionId(null);
  };

  const handleSendClick = () => {
    if (inputValue.trim().length < 10) {
      setErrorMessage("Question must be at least 10 characters long");
      return;
    }

    if (inputValue.trim() !== "" || filePreview) {
      sendQuestionToServer(inputValue);
      setInputValue("");
      setFilePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const sendQuestionToServer = async (text) => {
    try {
      const communityId = selectedCommunity;
      const response = await axiosInstance.post(`/communities/${communityId}/addQuestion`,
        { content: text },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      console.log("Question sent successfully:", response.data);
      fetchQuestions();
    } catch (error) {
      console.error("Error sending question:", error);
    }
  };



  // console.log(AllQuestions)
  const fetchQuestions = async () => {
    try {
      const communityId = selectedCommunity;
      const response = await axiosInstance.get(`/communities/${communityId}/getCommunityQuestions`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      setAllQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [token, selectedCommunity]);

  const handleSendAnswerClick = async (questionId) => {
    if (replyInput.trim().length < 3) {
      setReplyError("Answer must be at least 3 characters long");
      return;
    }

    if (replyInput.trim() !== "") {
      try {
        const communityId = selectedCommunity;
        const response = await axiosInstance.post(`/communities/${communityId}/questions/${questionId}/answerQuestion`,
          { content: replyInput },
          {
            headers: {
              Authorization: 'Bearer ' + token
            }
          }
        );
        console.log("Answer sent successfully:", response.data);
        fetchQuestions();
        setReplyInput("");
        setShowAnswerMap((prevMap) => ({
          ...prevMap,
          [questionId]: true,
        }));
        fetchAnswers(questionId);
      } catch (error) {
        console.error("Error sending answer:", error);
      }
    }
  };

  // console.log(answers)
  const fetchAnswers = async (questionId) => {
    try {
      const communityId = selectedCommunity;
      const response = await axiosInstance.get(`/communities/${communityId}/questions/${questionId}/answers`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: response.data.answers,
      }));
    } catch (error) {
      console.error("Error fetching question details:", error);
    }
  };

  const handleToggleAnswer = (questionId) => {
    setShowAnswerMap((prevMap) => ({
      ...prevMap,
      [questionId]: !prevMap[questionId],
    }));

    if (!showAnswerMap[questionId]) {
      fetchAnswers(questionId);
    }
  };

  // const handleEditQuestion = (questionId) => {
  //   const question = AllQuestions.find((q) => q._id === questionId);
  //   if (question) {
  //     setInputValue(question.content);
  //     setEditingQuestionId(questionId);
  //   }
  // };

  return (
    <div className="community-page-body">
      <div className="community-body">
        {AllQuestions.map((question) => (
          <div key={question._id} className="question">
            <div className="question-header">
              <div className="info">
                <img src={avatar} alt="Avatar" />
                <p>{question.author.firstName} {question.author.lastName}</p>
              </div>
              {/* <img src={menu} alt="Menu" onClick={() => handleEditQuestion(question._id)} /> */}
            </div>
            <p className="ques">{question.content}</p>
            <div className="noOfReplys">
              <p>{question.answers.length} Reply</p>
            </div>
            <div className="answer" onClick={() => handleToggleAnswer(question._id)}>
              <img src={answer} alt="Answer" />
              {showAnswerMap[question._id] ? <p>hide all answers</p> : <p>leave an answer</p>}
            </div>

            {showAnswerMap[question._id] && (
              <div className="addAnswer"style={replyError ? { borderColor: "red" } : {}}>
                <input
                  type="text"
                  placeholder="Write your Answer..."
                  value={replyInput}
                  onChange={handleReplyInputChange}
                  
                />
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  className={`answer-send-icon ${replyInput.trim() !== "" || filePreview ? "active" : ""}`}
                  onClick={() => handleSendAnswerClick(question._id)}
                />
                {replyError && <p className="error-message">{replyError}</p>}
              </div>
            )}
            <div className="AllAnswers">
             {showAnswerMap[question._id] && answers[question._id] && answers[question._id].map((answer) => (
              <div className="answer-content-love">
              <div key={answer._id} className="answer-content">
                <img src={defaultAvatar} alt="not found" className="avatarAnswer"/>
                <div className="contentAnswer">
                    <div className="leftAnswer">
                        <p>{answer.author.firstName} {answer.author.lastName}</p>
                        <span>{answer.content}</span>
                    </div>
                    <div className="rightAnswer">
                       <small>{new Date(answer.createdAt).toLocaleString()}</small>
                    </div>
                </div>
                {/* <div className="loved">
                   <img src={loved} alt="not found" />
                    <p>2 likes</p>
                 </div> */}
              </div>
              
              </div>
             ))}
            </div>
          </div>
        ))}
      </div>
      <div className="community-fixed-input-field">
        <input
          type="text"
          placeholder="Write your Question..."
          value={inputValue}
          onChange={handleInputChange}
          style={errorMessage ? { borderColor: "red" } : {}}
        />
        <FontAwesomeIcon
          icon={faPaperPlane}
          className={`community-send-icon ${inputValue.trim() !== "" || filePreview ? "active" : ""}`}
          onClick={handleSendClick}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default CommunityPageBody;
