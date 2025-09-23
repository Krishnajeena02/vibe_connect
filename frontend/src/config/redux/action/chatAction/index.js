import axios from "axios";

export const FETCH_MESSAGES = "FETCH_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";

export const fetchMessages = (user1, user2) => async (dispatch) => {
  try {
    const res = await axios.get(`http://localhost:9090/messages/${user1}/${user2}`);
    dispatch({ type: FETCH_MESSAGES, payload: res.data });
  } catch (error) {
    console.error("Error fetching messages", error);
  }
};

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});
