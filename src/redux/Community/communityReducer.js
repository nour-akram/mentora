import { ADD_QUESTION, ADD_ANSWER } from "./actionsTypes.js";

const initialState = {
  questions: [],
};

const CommunityReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUESTION:
      return {
        ...state,
        questions: [...state.questions, { ...action.payload, answers: [] }],
      };

    case ADD_ANSWER:
      const { questionIndex, answer } = action.payload;
     return {
      ...state,
      questions: state.questions.map((question, index) => {
      if (index === questionIndex) {
        return {
          ...question,
          answers: [...question.answers, answer],
        };
      }
      return question;
    }),
  };
    default:
      return state;
  }
};

export default CommunityReducer;
