import { SLECTED_CHAT, defaultPaginatedObject } from '../types'

const initialState = {
    loading: true,
    chat: {},
    messages: defaultPaginatedObject
}

export default function(state = initialState, action){
    console.log("action device state", action)
    switch(action.type){
        case SLECTED_CHAT:
        return {
            ...state,
            ...action.payload,
            loading:false
        }
        default: return state
    }

}