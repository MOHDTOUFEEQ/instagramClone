import React from 'react'

function Followers({
    setShowFollowers,
    followersInfo,
}) {
     
    const closeFollowers = ()=>{
  
        setShowFollowers()
        
        document.querySelector("body").style.backgroundColor = "";
        document.querySelector(".hiddeeeen").style.filter = "blur(0px)";
      }
  return (
    <>
      <div className="y_user_profile1 bg-red-300" style={{ flexDirection: "column", gap: "10px" }}>
        <div style={{ width: "100%", minHeight: "200px", maxHeight:"auto", overflowY: "scroll",paddingLeft:"10px",padding:"10px" }}>
          {followersInfo.map((follower) => (
            <div key={follower.userId} className="followerContainer" style={{ display: "flex", alignItems: "center", gap: "20px", width: "100%", borderBottom: "1px solid #d3d3d3", padding: "10px" ,height:"70px"}}>
              <img
                onClick={Iamclicking}
                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-full border-2 border-pink-600 cursor-pointer"
                src={
                  follower.profilePic
                    ? service.getFilePreview(follower.profilePic)
                    : "https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                }
                style={{ height: "65px", width: "65px" }}
                alt="profile"
              />
              <p>{follower.username}</p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #d3d3d3", width: "100%", height: "10vh", display: 'flex', justifyContent: 'center', alignItems: "center" }}>
          <button style={{width:"100%"}} onClick={closeFollowers} className="closeButton">Close</button>
        </div>
      </div>
              
    </>
  )
}

export default Followers