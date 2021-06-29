import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App.js';



const Profile = ()=>{
    
    const[mypics,setPics] = useState([])
    const[userInfo,setuserInfo] = useState({})
    const{state,dispatch} = useContext(UserContext)

    const[image,setImage] = useState("")
    
    console.log(state)
    useEffect(()=>{
        debugger;
        let user = JSON.parse(localStorage.getItem("user"));
        console.log('userX', user);
        console.log('userXid', user._id);

        fetch(`/user/${user._id}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log('Result For Profile',result.user)
             setPics(result.posts)
            console.log('Result For Profile 00000000000000000000000000000000000000000000000000000000result.user',result.user)
            setuserInfo(result.user)

        })
    },[])


    // useEffect(()=>{
    //     fetch('/user/:id',{
    //         headers:{
    //             "Authorization":"Bearer "+localStorage.getItem("jwt")
    //         }
    //     }).then(res=>res.json())
    //     .then(result=>{
    //         console.log(result)
    //         setProfile(result)
            
    //     })
    // },[])

    useEffect(()=>{
        if(image){
            const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "mern-03")
        fetch("	https://api.cloudinary.com/v1_1/mern-03/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                
                // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                // dispatch({type:"UPDATEPIC",payload:data.url})
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                }).then(res=>res.json())
                .then(result=>{
                    console.log(result)
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
                    dispatch({type:"UPDATEPIC",payload:result.pic})
                   // window.location.reload()
                })
                 
            })
            .catch(err => {
                console.log(err)
            })
        }
    },[image])

    const updatePhoto = (file)=>{
        setImage(file)
        
    }

    return(
        // <>
        // {userProfile ? 
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                    margin: "18px 0",
                    borderBottom:"1px solid grey"

                }}>
            <div style={{
                    display:"flex",
                    justifyContent: 'space-around',
                    

                }}>
                <div>
                    <img style={{width:"160px", height:"160px",borderRadius:"80px"}}
                        src={state?state.pic:"loading"}
                    />
                    
                </div>
                <div>
                <h4>{state?state.name:"loading"}</h4>
                <div style={{display:"flex", justifyContent:"space-between",width:"108%"}}>
                    <h6>{mypics.length} post</h6>
                     <h6>{userInfo.followers?userInfo.followers.length:"0"} followers</h6>
                    <h6>{userInfo.following?userInfo.following.length:"0"} following</h6> 
                </div>
                </div>
            </div>

            <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update Picture</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Update Picture" />
                    </div>
                </div>
            </div>
        <div className="gallery">
            {
                mypics.map(item=>{
                    return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
        
                    )
                })
            }
        
       </div>
        </div>
        // : <h2>Loading...</h2>}
        // </>
    )
}
export default Profile