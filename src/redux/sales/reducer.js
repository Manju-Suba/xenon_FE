import {
  FETCH_SH,
  FETCH_RS,
  FETCH_TARGET,
  FETCH_CLUSTERS,
  FETCH_STATE,
  FETCH_HISTORY,
} from '../actiontype'

const INIT_STATE = {
  saleHData: [],
  RSData: [],
  TargetData: [],
  ClustersData: [],
  StateData: [],
  HistoryData: [],
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case FETCH_SH:
      return { ...state, saleHData: action.payload }
    case FETCH_RS:
      return { ...state, RSData: action.payload }
    case FETCH_TARGET:
      return { ...state, TargetData: action.payload }
    case FETCH_CLUSTERS:
      return { ...state, ClustersData: action.payload }
    case FETCH_STATE:
      return { ...state, StateData: action.payload }
    case FETCH_HISTORY:
      return { ...state, HistoryData: action.payload }
    default:
      return state
  }
}
