import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './component/navbar.js';
import "./App.css"
import { BrowserRouter,Route,Switch,useHistory } from 'react-router-dom';
import Home from './component/screens/Home.js';
import Signin from './component/screens/Signin.js';
import Signup from './component/screens/Signup.js';
import Profile from './component/screens/Profile.js';
import CreatePost from './component/screens/CreatePost.js';
import{reducer,initialState} from './reducer/userReducer';
import UserProfile from './component/screens/UserProfile.js';
import SubscribedUserPosts from './component/screens/SubscribeUserPost';

export const UserContext = createContext()

const Routing = () =>{
  const history = useHistory()
  const { dispatch } = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
   if(user){
     dispatch({type:"USER",payload:user})
     
   }
   else{
     history.push('/signin')
   }
  },[])
  return(
<Switch>
    <Route exact path = "/">
     <Home/>
    </Route>
    <Route path = "/signin">
     <Signin/>
    </Route>  
    <Route path = "/signup">
     <Signup/>
    </Route>
    <Route exact path = "/profile">
     <Profile/>
    </Route>
    <Route path = "/create">
     <CreatePost/>
    </Route>
    <Route path = "/profile/:userid">
     <UserProfile/>
    </Route>
    <Route path = "/myfollowingpost">
     <SubscribedUserPosts/>
    </Route>
</Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
    <Navbar />
    <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
