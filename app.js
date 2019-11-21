const { createStore, combineReducers } = Redux;
const { HashRouter, Link, Route } = ReactRouterDOM;
const { Component } = React;

const initialState = {
    events: []
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'newEvent':
            // console.log(state.events);
            // console.log("action data: ", action.data)
            // const newState = [...state.events, action.data];
            const events = state.events
            events.push(action.data)
            state.events = events
            return state
            // console.log(newState)
            // return newState
            // return [...state, action.data]
        default:
            return state
    }
}

const store = createStore(reducer);

const connect = (AdditionalComponent)=> {
    class Connected extends Component{
      constructor(){
        super();
        this.state = store.getState();
      }
      componentWillUnmount(){
        this.unsubscribe();
      }
      componentDidMount(){
        this.unsubscribe = store.subscribe(() => this.setState(store.getState()));
      }
      render(){
        //   console.log(this.state)
        return (
          <AdditionalComponent events = {this.state.events } {...this.props }/>
        );
      }
    }
    return Connected;
}

const addRandomEvent = async () => {
    store.dispatch( {
        data: (await axios.post('/api/events')).data,
        type: 'newEvent'
    } )
}

const Events = connect(({events}) => {
    console.log('events are: ', events)
    return (
        // eslint-disable-next-line react/react-in-jsx-scope
        <div>
            <button onClick={addRandomEvent} >Create</button> 
            <ul>
                {
                    events.map(event => <li key={Math.random()}>{event.name} - {event.date}</li>)
                }
            </ul>
        </div>
    )
})

const Home = connect(({ events }) => {
    return (
        <p>There are {events.length} events!</p>
    )
})

const Nav = connect(({ events }) => {
    return (
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/events'>Events ({events.length})</Link>
        </nav>
    )
})

const fetchEvents = async () => {
    const events = (await axios.get('/api/events')).data;
    // console.log(events)
    events.forEach(event => {
        // console.log(event.name)
        // console.log(event.date)
        store.dispatch({
            data: {
                name: event.name,
                date: event.date
            },
            type: 'newEvent'
        })
    })
    // console.log(store.getState().events)
    
    // return events;
}

// eslint-disable-next-line react/no-multi-comp
class App extends Component {
    componentDidMount() {
        fetchEvents();

    }
    render() {
        return (
            <HashRouter>
                <h1>Acme event Planner With Redux</h1>
                <Route component = { Nav } />
                <Route path='/' component = { Home } exact />
                <Route path='/events' component = { Events } />
            </HashRouter>
        )
    }
}



  ReactDOM.render(<App />, document.querySelector('#root'));


//   {
//     const newEvent = await axios.post('/api/events').data
//     const name = newEvent.name;
//     const date = newEvent.date;
//     store.dispatch({
//         type: 'newEvent',
//         data: `${name} - ${date}`
//     })
// }