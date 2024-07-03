const filterReducer = (state = '', action) => {
    console.log('STATE: ', state)
    console.log('ACTION: ', action.type)
  
    switch (action.type) {
      case 'SET_FILTER': {
        const filter = action.payload
        console.log('FILTER: ', filter)
        return filter
      }
      default: return state
    }
  }

export const changeFilter = filter => {
    return {
        type: 'SET_FILTER',
        payload: filter
    }
}

export default filterReducer