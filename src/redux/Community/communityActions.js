import { ADD_QUESTION, ADD_ANSWER} from  "./actionsTypes";

export const addQuestion = (questionData) => ({
  type: ADD_QUESTION,
  payload: questionData,
});

export const addAnswer = (questionIndex, answer) => ({
    type: ADD_ANSWER,
    payload: { questionIndex, answer },
  });