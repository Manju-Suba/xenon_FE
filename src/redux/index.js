import { combineReducers } from 'redux'
import saleshierarchy from '../redux/sales/reducer'

const reducers = combineReducers({
  saleshierarchyData: saleshierarchy,
})

export default reducers
