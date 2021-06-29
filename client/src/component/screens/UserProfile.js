import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App.js';
import  {useParams} from 'react-router-dom'

const Profile = ()=>{
    const[userProfile,setProfile] = useState(null)
 
    const{state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const[showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log("doosray bhosriwalay ki profile",result)
            setProfile(result)
            
        })
    },[])

    const followUser = ()=>{
        //console.log(userid);

        // const datas = {
        //     followId:userid
        // }
        
        fetch(`/follow/${userid}`,{
            method:"put",
            headers:{
                "Content-Type":"application.json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
           // body:datas
            })
            .then((res)=>{
                console.log("gg",res) 
              dispatch({type:"UPDATE",payload:{following:res.following,followers:res.followers}})
              localStorage.setItem("user",JSON.stringify(res))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,res._id]
                    }
                }
            })
            setShowFollow(true)
        })

        //console.log(datas)
    }

    const unfollowUser = ()=>{
 
        fetch(`/unfollow/${userid}`,{
            method:"put",
            headers:{
                "Content-Type":"application.json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })

            })
            .then((res)=>{
                console.log(res) 
              dispatch({type:"UPDATE",payload:{following:res.following,followers:res.followers}})
              localStorage.setItem("user",JSON.stringify(res))
            setProfile((prevState)=>{
                const newfollower = prevState.user.followers.filter(item=>item != res._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newfollower
                        //followers:[...prevState.user.followers,res._id]
                    }
                }
            })
            
        })

        //console.log(datas)
    }

    return(
        <>
        {userProfile ? 
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                    display:"flex",
                    justifyContent: 'space-around',
                    margin: "18px 0",
                    borderBottom:"1px solid grey"

                }}>
                <div>
                    <img style={{width:"160px", height:"160px",borderRadius:"80px"}}
                        src={userProfile.user.pic}
                    />
                </div>
                <div>
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.email}</h5>

                <div style={{display:"flex", justifyContent:"space-between",width:"108%"}}>
                    <h6>{userProfile.posts.length} post</h6>
                    <h6>{userProfile.user.followers.length} followers</h6>
                    <h6>{userProfile.user.following.length} following</h6>
                </div>
                {showfollow?
                <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>followUser()}>
                Follow
            </button>
            :
            <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>unfollowUser()}>
                UnFollow
            </button>
            
            }
                
            
                </div>
            </div>
      
        <div className="gallery">
            {
                userProfile.posts.map(item=>{
                    return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
        
                    )
                })
            }
        
       </div>
        </div>
        
        : <h2>Loading...</h2>}
        </>
    )
}
export default Profile