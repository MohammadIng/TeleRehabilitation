let user = User.initUser()

// init chatVido
let chatVidoe = new Videoconference(myRoomID, userType, myName, audioMuted, videoMuted)

// set chat vidoe in user object
user.setChatVideo(chatVidoe)

 // start chat video
user.startVidoeconference()


user.getChatVideo().getSocket().on("connect", ()=>{
    console.log("socket connected....");
    user.getChatVideo().getSocket().emit("join-room", {"room_id": user.getChatVideo().getMyRoomID()});
});


user.getChatVideo().getSocket().on("user-connect", (data)=>{
    console.log("user-connect ", data);
    let peer_id = data["sid"];
    let user_name = data["user_name"];
    user.getChatVideo().getPeerList()[peer_id] = undefined;
    user.getChatVideo().addVideoElement(peer_id, user_name);
});


user.getChatVideo().getSocket().on("user-disconnect", (data)=>{
    console.log("user-disconnect ", data);
    let peer_id = data["sid"];
    user.getChatVideo().closeConnection(peer_id);
    user.getChatVideo().removeVideoElement(peer_id);
});


user.getChatVideo().getSocket().on("user-list", (data)=>{
    console.log("user list recvd ", data);
    user.getChatVideo().setMyID(data["my_id"])
    if( "list" in data)
    {
        let recvd_list = data["list"];
        for(let peer_id in recvd_list)
        {
            let user_name = recvd_list[peer_id];
            user.getChatVideo().getPeerList()[peer_id] = undefined;
            user.getChatVideo().addVideoElement(peer_id, user_name);
        }
        user.getChatVideo().startWebRTCConnection();
    }
});


user.getChatVideo().getSocket().on("data", (msg)=>{
    switch(msg["type"])
    {
        case "offer":
            user.getChatVideo().handleOfferMsg(msg);
            break;
        case "answer":
            user.getChatVideo().handleAnswerMsg(msg);
            break;
        case "new-ice-candidate":
            user.getChatVideo().handleNewICECandidateMsg(msg);
            break;
    }
});

document.addEventListener('fullscreenchange', () => {
  const fullscreenElement = document.fullscreenElement;
  if (fullscreenElement && fullscreenElement.tagName === 'VIDEO') {
    const videoId = fullscreenElement.id;
    let video = document.getElementById(videoId)
    user.getChatVideo().displayPatientData(videoId.substring(4, videoId.length))
    video.style.border = '10px solid white';
  }
});

