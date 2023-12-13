let user = User.initUser()

// init chatVido
let chatVidoe = new Videoconference(myRoomID, userType, myName, audioMuted, videoMuted)
user.setChatVideo(chatVidoe)

// set chat vidoe to user
user.joinVidoeconference()


var handDetector= new HandDetector()
user.setHandDetector(handDetector)
user.performsExercise()




function getMyExercisesData(){
    user.getMyExercisesData()
}


getMyExercisesData()

user.getSocket().on("eventGetMyExercises", (data) => {user.eventGetMyExercises(data)});


user.getChatVideo().getSocket().on("eventUpdateVideoconferences", (data) => {user.getChatVideo().checkVideoRoomState(data);});

user.getChatVideo().getSocket().on("connect", ()=>{
    console.log("socket connected....");
    user.getChatVideo().getSocket().emit("join-room", {"room_id": user.getChatVideo().getMyRoomID()});
});


user.getChatVideo().getSocket().on("user-connect", (data)=>{
    console.log("user-connect ", data);
    let peer_id = data["sid"];
    let user_name = data["user_name"];
    user.getChatVideo().getPeerList()[peer_id] = undefined;

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
        }
        user.getChatVideo().startWebRTCConnection();
    }
    user.getHandDetector().getExercisesToPatients(user.getChatVideo().getMyID(), user.getVollName(),user.getExercises(), user.getChatVideo().getDataChannel());
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