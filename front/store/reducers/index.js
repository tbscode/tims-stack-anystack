import { combineReducers } from 'redux'
import userDataReducer from "./userDataReducer"
import connectionStateRecuder from "./connectionStateReducer"
import deviceStateReducer from "./deviceStateReducer"
import frontendSettingsRecuder from "./frontendSettingsReducer"
import userProfileReducer from "./userProfileReducer"

/**
 * We want to carefully devide our data into multiple reducers
 * device: info on the current device
 * connection: state of the current connection
 * userData: the current userData
 * chat: the users chats
 * messages: the users message per chat
 */
export default combineReducers({
  device: deviceStateReducer,
  frontendSettings: frontendSettingsRecuder,
  connection: connectionStateRecuder,
  userData: userDataReducer,
  profile: userProfileReducer
})