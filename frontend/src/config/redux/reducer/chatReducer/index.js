import { FETCH_MESSAGES, ADD_MESSAGE } from "../../action/chatAction/index";


const initialState = {
  messages: [],
  chatUsers: [],
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MESSAGES:
      return { ...state, messages: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

export default chatReducer;
