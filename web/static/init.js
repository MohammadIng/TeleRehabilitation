class LocalVideo{
    constructor(){
        this.audioMuted = false
        this.videoMuted = false
        this.camera_allowed = false
        this.mediaConstraints = {
                                    audio: true,
                                    video: {
                                        height: 360
                                    }
                                };
        this.myVideo = null

    }

     isAudioMuted() {
        return this.audioMuted;
    }

    setAudioMuted(audioMuted) {
        this.audioMuted = audioMuted;
    }

    isVideoMuted() {
        return this.videoMuted;
    }

    setVideoMuted(videoMuted) {
        this.videoMuted = videoMuted;
    }

    isCameraAllowed() {
        return this.cameraAllowed;
    }

    setCameraAllowed(cameraAllowed) {
        this.cameraAllowed = cameraAllowed;
    }

    getMediaConstraints() {
        return this.mediaConstraints;
    }

    setMediaConstraints(mediaConstraints) {
        this.mediaConstraints = mediaConstraints;
    }

    getMyVideo() {
        return this.myVideo;
    }

    setMyVideo(myVideo) {
        this.myVideo = myVideo;
    }

     startCamera()
    {
        navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
        .then((stream)=>{
            document.getElementById("local_vid_check_point").srcObject = stream;
            this.setCameraAllowed(true)
        })
        .catch((e)=>{
            this.setCameraAllowed(false)
            console.log("Error! Unable to start video! ", e);
            document.getElementById("permission_alert").style.display = "block";
        });
    }

    isCameraAccessible(){
        if(!this.isCameraAllowed())
        {
            alert("Please allow camera and mic permissions!");
        }
        return this.isCameraAllowed();
    }

    init(name){

        document.addEventListener("DOMContentLoaded", (event)=>{

        // init html element
        var muteAudioField = document.getElementById("mute_audio_inp");
        var muteVideoField = document.getElementById("mute_video_inp");
        var muteBttn = document.getElementById("bttn_mute");
        var muteVidBttn = document.getElementById("bttn_vid_mute");
        var myVideo = document.getElementById("local_vid_check_point");


        // handling audioStaet in Chatroom
        muteBttn.addEventListener("click", (event)=>{
            this.setAudioMuted(!this.isAudioMuted())
            let local_stream = myVideo.srcObject;
            local_stream.getAudioTracks().forEach((track)=>{track.enabled = !this.isAudioMuted();});
            muteAudioField.value = (this.isAudioMuted())? "1":"0";
            document.getElementById("mute_icon").innerText = (this.isAudioMuted())? "mic_off": "mic";
        });


        // handling vidoeSatet in Chatroom
        muteVidBttn.addEventListener("click", (event)=>{
            this.setVideoMuted(!this.isVideoMuted())
            let local_stream = myVideo.srcObject;
            local_stream.getVideoTracks().forEach((track)=>{track.enabled = !this.isVideoMuted();});
            muteVideoField.value = (this.isVideoMuted())? "1":"0";
            document.getElementById("vid_mute_icon").innerText = (this.isVideoMuted())? "videocam_off": "videocam";
        });


        document.getElementById("user_name").value = name;
        this.startCamera();
    });

    }

}


class Videoconference{
    constructor(myRoomID, userType, myName, audioMuted, videoMuted) {
        this.myVideo = null;
        this.myRoomID = myRoomID
        this.userType = userType
        this.myName = myName
        this.audioMuted = audioMuted
        this.videoMuted =videoMuted
        this.cameraAllowed=false;
        this.myID = 0
        this.mediaConstraints = {
                                audio: true,
                                video: {
                                    height: 360
                                }
        };
        this.peerList = {}
        this.protocol = window.location.protocol
        this.socket = io(this.protocol + '//' + document.domain + ':' + location.port, {autoConnect: false});
        this.PC_CONFIG = {
            iceServers: [
                {
                    urls: ['stun:stun.l.google.com:19302',
                        'stun:stun1.l.google.com:19302',
                        'stun:stun2.l.google.com:19302',
                        'stun:stun3.l.google.com:19302',
                        'stun:stun4.l.google.com:19302'
                    ]
                },
            ]
        }
        this.dataChannel = null
        this.patientsData = null
    }

    getMyVideo() {
        return this.myVideo;
    }

    setMyVideo(myVideo) {
        this.myVideo = myVideo;
    }

    getMyRoomID(){
        return this.myRoomID
    }

    setMyRoomID(myRoomID){
        this.myRoomID = myRoomID
    }

    getUserType() {
        return this.userType;
    }

    setUserType(userType) {
        this.userType = userType;
    }

    getMyName() {
        return this.myName;
    }

    setMyName(myName) {
        this.myName = myName;
    }

    isAudioMuted() {
        return this.audioMuted;
    }

    setAudioMuted(audioMuted) {
        this.audioMuted = audioMuted;
    }

    isVideoMuted() {
        return this.videoMuted;
    }

    setVideoMuted(videoMuted) {
        this.videoMuted = videoMuted;
    }

    getMyID() {
        return this.myID;
    }

    setMyID(myID) {
        this.myID = myID;
    }

    getCameraAllowed() {
        return this.cameraAllowed;
    }

    setCameraAllowed(cameraAllowed) {
        this.cameraAllowed = cameraAllowed;
    }

    getMediaConstraints() {
        return this.mediaConstraints;
    }

    setMediaConstraints(mediaConstraints) {
        this.mediaConstraints = mediaConstraints;
    }

    getPeerList() {
        return this.peerList;
    }

    setPeerList(peerList) {
        this.peerList = peerList;
    }

    getProtocol() {
        return this.protocol;
    }

    setProtocol(protocol) {
        this.protocol = protocol;
    }

    getSocket() {
        return this.socket;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getPC_CONFIG(){
        return this.PC_CONFIG;
    }

    setPC_CONFIG(PC_CONFIG){
        this.PC_CONFIG = PC_CONFIG
    }

    getDataChannel(){
        return this.dataChannel
    }

    setDataChannel(dataChannel){
        this.dataChannel = dataChannel
    }

    setPatientsData(patientsData){
        this.patientsData = patientsData
    }

    getPatientsData(){
        return this.patientsData
    }

    init(state){
        document.addEventListener("DOMContentLoaded", (event)=>{
            this.setMyVideo(document.getElementById("local_vid_"+this.getUserType()))
            this.getMyVideo().onloadeddata = ()=>{console.log("W,H: ", this.getMyVideo().videoWidth, ", ", this.getMyVideo().videoHeight);};
            var muteBttn = document.getElementById("bttn_mute");
            var muteVidBttn = document.getElementById("bttn_vid_mute");
            var callEndBttn = document.getElementById("call_end");

            muteBttn.addEventListener("click", (event)=>{
                this.setAudioMuted(!this.isAudioMuted())
                this.setAudioMuteState(this.isAudioMuted());
            });

            muteVidBttn.addEventListener("click", (event)=>{
                this.setVideoMuted(!this.isVideoMuted())
                this.setVideoMuteState(this.isVideoMuted());
            });

            callEndBttn.addEventListener("click", (event)=>{
                if (this.getUserType()=="therapist") {
                    window.location.replace("/home_therapist");
                }
                else {
                     this.getSocket().emit("leaveRoom");
                     window.location.replace("/home_patient");
                }
            });

            if(!state) {
                var helpBttn = document.getElementById("bttn_help");

                helpBttn.addEventListener("click", (event) => {
                    this.requestHelp()
                });
            }

        });

        document.addEventListener("DOMContentLoaded", (event)=>{
            if(state)
                this.recordTherapistVideo();
            else
                this.recordPatientVideo()
        });
    }

    setAudioMuteState(flag) {
        let local_stream = this.getMyVideo().srcObject;
        local_stream.getAudioTracks().forEach((track)=>{track.enabled = !flag;});
        document.getElementById("mute_icon").innerText = (flag)? "mic_off": "mic";
    }


    setVideoMuteState(flag) {
        let local_stream = this.getMyVideo().srcObject;
        local_stream.getVideoTracks().forEach((track)=>{track.enabled = !flag;});
        document.getElementById("vid_mute_icon").innerText = (flag)? "videocam_off": "videocam";
    }

     requestHelp(){
         const data = {'type': "help",
                          'id': this.getMyID()
                          }
         this.dataChannel.send(JSON.stringify(data))
    }

    recordTherapistVideo(){
        navigator.mediaDevices.getUserMedia(this.getMediaConstraints())
        .then((stream)=>{
            this.getMyVideo().srcObject = stream;
            this.setCameraAllowed(true);

            this.setAudioMuteState(this.isAudioMuted());
            this.setVideoMuteState(this.isVideoMuted());


            //start the socketio connection
            this.getSocket().connect();

        })
        .catch((e)=>{
            console.log("getUserMedia Error! ", e);
            alert("Error! Unable to access camera or mic! ");
        });
    }

     recordPatientVideo() {

        this.getMyVideo().onloadeddata = () => {
            console.log("W,H: ", this.getMyVideo().videoWidth, ", ", this.getMyVideo().videoHeight);
        };

        var canvas = document.querySelector('canvas');
        var videoStream = canvas.captureStream(25);
        this.setMyVideo(document.querySelector('video'))
        const self = this
         navigator.mediaDevices.getUserMedia({ audio: true })
              .then(function(audioStream) {
                const combinedStream = new MediaStream();

                const videoTrack = videoStream.getVideoTracks()[0];
                combinedStream.addTrack(videoTrack);

                const audioTrack = audioStream.getAudioTracks()[0];
                combinedStream.addTrack(audioTrack);

                self.getMyVideo().srcObject = combinedStream;

                self.setCameraAllowed(true);
                self.setAudioMuteState(self.isAudioMuted());
                self.setVideoMuteState(self.isVideoMuted());

                self.getSocket().connect();
         })

    }

    checkVideoRoomState(data) {
        data = JSON.parse(data)
        for(let room of data){
            if(room.name==this.getMyRoomID())
                return;
        }
        alert("Therapist has closed this Room");
        window.location.href = "/home_patient";
    }
    /**********************************************************/

    // handling video element for new user
    makeVideoElement(element_id, user_name) {
        let wrapper_div = document.createElement("div");
        let vid_wrapper = document.createElement("div");
        let vid = document.createElement("video");
        let name_text = document.createElement("div");

        wrapper_div.id = "div_"+element_id;
        vid.id = "vid_"+element_id;
        vid.style.border="10px solid white"


        wrapper_div.className = "shadow video-item";
        vid_wrapper.className = "vid-wrapper";
        name_text.className = "user-name";

        vid.autoplay = true;
        vid.controls = true;
        name_text.innerText = user_name;

        vid_wrapper.appendChild(vid);
        wrapper_div.appendChild(vid_wrapper);
        wrapper_div.appendChild(name_text);

        return wrapper_div;
    }

    addVideoElement(element_id, user_name) {
        document.getElementById("video_grid").appendChild(this.makeVideoElement(element_id, user_name));
    }


    removeVideoElement(element_id) {
        let v = this.getVideoObj(element_id);
        if (v != null && v.srcObject) {
            v.srcObject.getTracks().forEach(track => track.stop());
            v.removeAttribute("srcObject");
            v.removeAttribute("src");
        }
        if(document.getElementById("div_"+element_id)!=null)
            document.getElementById("div_"+element_id).remove();
    }


    getVideoObj(element_id){
        return document.getElementById("vid_"+element_id);
    }
    /**********************************************************/

    // handling web RTC connection
    closeConnection(peer_id) {
        if (peer_id in this.getPeerList()) {
            this.getPeerList()[peer_id].onicecandidate = null;
            this.getPeerList()[peer_id].ontrack = null;
            this.getPeerList()[peer_id].onnegotiationneeded = null;

            delete this.getPeerList()[peer_id];
        }
    }


    log_user_list() {
        for(let key in this.getPeerList())
        {
            console.log(`${key}: ${this.getPeerList()[key]}`);
        }
    }


    log_error(e){console.log("[ERROR] ", e);}


    sendViaServer(data){this.getSocket().emit("data", data);}


     startWebRTCConnection(){
            for(let peer_id in this.getPeerList())
            {
                this.invite(peer_id);
            }
    }


    invite(peer_id) {
        if(this.getPeerList()[peer_id]){console.log("[Not supposed to happen!] Attempting to start a connection that already exists!")}
        else if(peer_id === this.getMyID()){console.log("[Not supposed to happen!] Trying to connect to self!");}
        else
        {
            // console.log(`Creating peer connection for <${peer_id}> ...`);
           this.createPeerConnection(peer_id);

            let local_stream = this.getMyVideo().srcObject;
            local_stream.getTracks().forEach((track)=>{this.getPeerList()[peer_id].addTrack(track, local_stream);});
        }
    }


    createPeerConnection(peer_id) {
        this.getPeerList()[peer_id] = new RTCPeerConnection(this.getPC_CONFIG());

        this.getPeerList()[peer_id].onicecandidate = (event) => {this.handleICECandidateEvent(event, peer_id)};
        this.getPeerList()[peer_id].ontrack = (event) => {this.handleTrackEvent(event, peer_id)};
        this.getPeerList()[peer_id].onnegotiationneeded = () => {this.handleNegotiationNeededEvent(peer_id)};
        this.getPeerList()[peer_id].onconnectionstatechange  = () => {this.handleConnectionStateEvent(peer_id)};
        this.setDataChannel(this.getPeerList()[peer_id].createDataChannel("dataChannel"))
        this.getPeerList()[peer_id].ondatachannel = (event) => {this.handleDataChannel(event)};


    }


    handleNegotiationNeededEvent(peer_id) {
        this.getPeerList()[peer_id].createOffer()
        .then((offer)=>{return this.getPeerList()[peer_id].setLocalDescription(offer);})
        .then(()=>{
            // console.log(`sending offer to <${peer_id}> ...`);
            this.sendViaServer({
                "sender_id": this.getMyID(),
                "target_id": peer_id,
                "type": "offer",
                "sdp": this.getPeerList()[peer_id].localDescription
            });
        })
        .catch(this.log_error);
    }


    handleOfferMsg(msg) {
        let peer_id = msg['sender_id'];

        // console.log(`offer recieved from <${peer_id}>`);

        this.createPeerConnection(peer_id);
        let desc = new RTCSessionDescription(msg['sdp']);
        this.getPeerList()[peer_id].setRemoteDescription(desc)
        .then(()=>{
            let local_stream = this.getMyVideo().srcObject;
            local_stream.getTracks().forEach((track)=>{this.getPeerList()[peer_id].addTrack(track, local_stream);});
        })
        .then(()=>{return this.getPeerList()[peer_id].createAnswer();})
        .then((answer)=>{return this.getPeerList()[peer_id].setLocalDescription(answer);})
        .then(()=>{
            // console.log(`sending answer to <${peer_id}> ...`);
            this.sendViaServer({
                "sender_id": this.getMyID(),
                "target_id": peer_id,
                "type": "answer",
                "sdp": this.getPeerList()[peer_id].localDescription
            });
        })
        .catch(this.log_error);
    }


    handleAnswerMsg(msg) {
        let peer_id = msg['sender_id'];
        // console.log(`answer recieved from <${peer_id}>`);
        let desc = new RTCSessionDescription(msg['sdp']);
        this.getPeerList()[peer_id].setRemoteDescription(desc)
    }


    handleICECandidateEvent(event, peer_id) {
        if(event.candidate){
           this.sendViaServer({
                "sender_id": this.getMyID(),
                "target_id": peer_id,
                "type": "new-ice-candidate",
                "candidate": event.candidate
            });
        }
    }


     handleNewICECandidateMsg(msg) {
        var candidate = new RTCIceCandidate(msg.candidate);
        this.getPeerList()[msg["sender_id"]].addIceCandidate(candidate)
        .catch(this.log_error);
    }


    handleTrackEvent(event, peer_id) {
        // console.log(`track event recieved from <${peer_id}>`);

        if(this.getUserType()=="therapist" && event.streams)
        {
            this.getVideoObj(peer_id).srcObject = event.streams[0];
        }
        else if(this.getUserType()=="patient"){
            this.getVideoObj("therapist").srcObject = event.streams[0];
        }
    }

    handleConnectionStateEvent(peer_id) {
        if(!(this.getPeerList()[peer_id] && this.getPeerList()[peer_id].connectionState))
            return;
        var connectionState = this.getPeerList()[peer_id].connectionState
        if( connectionState==="failed" ){
            console.log("connection state to "+ peer_id+":  "+connectionState)
            this.closeConnection(peer_id)
            this.getSocket().emit("join-room",{"room_id": this.getMyRoomID()})
        }
    }

     handleDataChannel(event) {
         const dataChannel = event.channel;
         dataChannel.onmessage = (event) => {
             const data = event.data;
             const receivedData = JSON.parse(data);
             this.processReceivedData(receivedData)
         };
     }


     processReceivedData(data){
        switch (data.type){
            case "data":
                this.addPatientsData(data)
                let video1 = this.getVideoObj(data.id)
                video1.style.border = '10px solid green';
                this.createPatientsDataList()
                break
            case "help":
                 console.log('user needs help with id:   ', data.id);
                 let video2 = this.getVideoObj(data.id)
                 video2.style.border = '10px solid red';
                 break
            default:
                console.log("Erorr")
                break
        }
     }


     addPatientsData(patientsData){
        if(this.getPatientsData()==null)
            this.setPatientsData({})
        if(this.getPatientsData()[patientsData.id]==null)
            this.getPatientsData()[patientsData.id]=[]
        this.getPatientsData()[patientsData.id].push(patientsData)
        this.createPatientsDataList()
    }

    createPatientsDataList() {
        const patientsData = document.getElementById("patientsData");
        if(this.getPatientsData()==null) {
            patientsData.innerText = "No Data yet"
            return;
        }
        patientsData.innerHTML=""

        const select = document.createElement('select');
        select.id = "patientsDataSelect"
        const initOption = document.createElement("option");
        initOption.value = 0;
        initOption.textContent = "select patient data";

        select.appendChild(initOption);

        Object.keys(this.getPatientsData()).forEach((key) => {
           const list = this.getPatientsData()[key];

           list.forEach((exerciseData) => {
               const option = document.createElement("option");
               option.value = exerciseData.id + "/" + exerciseData.exerciseId;
               option.textContent = exerciseData.name + " " + exerciseData.exerciseId;
               select.appendChild(option);
           });
        });

        select.addEventListener('change', () => {
            const selectedOption = select.options[select.selectedIndex];
            const selectedValue = selectedOption.value;
            this.displayPatientData(selectedValue);
        });


        patientsData.appendChild(select);
    }

    displayPatientData(patientsData){

        const patientsId = patientsData.substring(0, patientsData.indexOf("/"));
        const exerciseId = patientsData.substring(patientsData.indexOf("/")+1, patientsData.length);


        const self= this

        anychart.onDocumentReady(function () {

        var chartContainer = document.getElementById("analysisData");
        const comparisonTableDiv = document.getElementById("comparisonTable");

        chartContainer.innerHTML = "";

       let data= self.getPatientsData()[patientsId]
       let patientName =""
       if(data !=null && data.length!=0) {
           patientName = data[exerciseId]["name"]
           const isValues = data[exerciseId]["isValues"];
           const targetValues = data[exerciseId]["targetValues"];
           const exerciseName=data[exerciseId]["exerciseName"];
           self.createComparisonTable(exerciseName,isValues, targetValues)
           data = data[exerciseId]["data"]
           let video1 = self.getVideoObj(patientsId)
           if(video1)
                video1.style.border = '10px solid white';
       }
       else {
           chartContainer.innerHTML = ""
           comparisonTableDiv.innerHTML = ""
           return;
       }

        var dataSet = anychart.data.set(data);
        var executionFlowData = dataSet.mapAs({x: 0, value:5});
        var chart = anychart.line();
        var series = chart.line(executionFlowData);
        series.name("Exercise execution flow");


        chart.legend().enabled(true);

        chart.title("analysis Data for patient: "+ patientName);



        chart.container("analysisData");

        chart.draw();

      });
    }

    createComparisonTable(exerciseName,isValues, targetValues) {
        const table = document.createElement("table");
        const headersRow = document.createElement("tr");
        const isValuesRow = document.createElement("tr");
        const targetValuesRow = document.createElement("tr");

         const initHeader = document.createElement("th");
         initHeader.textContent = exerciseName;
         headersRow.appendChild(initHeader);

        const isValCell = document.createElement("td");
        isValCell.textContent = "isValues";
        isValuesRow.appendChild(isValCell);

        const targetValCell = document.createElement("td");
        targetValCell.textContent = "targetValues";
        targetValuesRow.appendChild(targetValCell);

        for (const key in isValues) {
            const headerCell = document.createElement("th");
            headerCell.textContent = key;
            headersRow.appendChild(headerCell);

            const isValueCell = document.createElement("td");
            isValueCell.textContent = isValues[key];
            isValuesRow.appendChild(isValueCell);

            const targetValueCell = document.createElement("td");
            targetValueCell.textContent = targetValues[key];
            targetValuesRow.appendChild(targetValueCell);
        }

        table.appendChild(headersRow);
        table.appendChild(targetValuesRow);
        table.appendChild(isValuesRow);
        const comparisonTableDiv = document.getElementById("comparisonTable");
        comparisonTableDiv.innerHTML = "";

        comparisonTableDiv.appendChild(table);
    }





}

class User {
   constructor(){
        this.username =""
        this.firstname = "";
        this.lastname = "";
        this.userType = "";
        this.password = "";
        this.exercises = "";
        this.socket = io()
        this.localVideo = new LocalVideo()
        this.chatVidoe = null
        this.allExercises = null
        this.handDetector = null
   }

    static initUser() {
        const initUser = new User();
        if (localStorage.getItem("user_data")) {
            initUser.deserialize()
    }
        return initUser
    }

    static loginConstructor(username,password) {
      return new User("",username, "","","",password, null)
    }


    getFirstname() {
      return this.firstname;
    }

    getLastname() {
      return this.lastname;
    }

    getVollName(){
      return this.getFirstname()+" "+this.getLastname()
    }

    getUserType() {
      return this.userType;
    }

    getPassword() {
      return this.password;
    }

    getExercises() {
      return this.exercises;
    }

    getUsername() {
      return this.username;
    }

    getSocket(){
      return this.socket
    }

    getLocalVideo(){
         return this.localVideo;
    }

    getChatVideo(){
         return this.chatVidoe;
    }

    getHandDetector(){
         return this.handDetector
    }


    // Setters
     setUsername(username) {
      this.username = username;
    }

    setFirstname(firstname) {
      this.firstname = firstname;
    }

    setLastname(lastname) {
      this.lastname = lastname;
    }

    setUserType(userType) {
      this.userType = userType;
    }

    setPassword(password) {
      this.password = password;
    }

    setExercises(exercises) {
      this.exercises = exercises;
    }

    setSocket(socket){
        this.socket = socket
    }

    setLocalVideo(localVideo){
         this.localVideo = localVideo
    }

    setChatVideo(localVideo){
         this.chatVidoe = localVideo
    }

    setHandDetector(handDetector){
         this.handDetector = handDetector
    }




    // login method
    login() {
        const username = $('#username').val()
        const password = $('#password').val()
        const data = {
            "username": username,
            "password": password,
        };
        this.getSocket().emit("login", data);
    }

    eventLogin(data){
        if(data) {
            this.username = data.username
            this.firstname = data.firstname
            this.lastname = data.lastname
            this.userType = data.usertype
            this.exercises= data.exercises
            this.sendDataToServer({"username":this.getUsername()})
            if(this.getUserType() === "therapist")
                window.location.replace("/home_therapist");
            else
                window.location.replace("/home_patient");
        }
        else {
              alert("username or password is not correct")
        }
    }


    // serialize user data
    serialize(){
        const data = {
            username:this.getUsername(),
            firstname:this.getFirstname(),
            lastname:this.getLastname(),
            password: this.getPassword(),
            usertype:this.getUserType(),
            exercises:this.getExercises(),
        }
        return data
    }

    // desserialize user date
    deserialize() {
        const data = JSON.parse(localStorage.getItem("user_data"));

        if (data) {
            this.setUsername(data.username);
            this.setFirstname(data.firstname);
            this.setLastname(data.lastname);
            this.setPassword(data.password);
            this.setUserType(data.usertype);
            this.setExercises(data.exercises);
        }
    }

    // send data to server
    sendDataToServer(data){
       localStorage.setItem('user_data', JSON.stringify(this.serialize()));
       document.cookie = "currentusername=" + encodeURIComponent(this.getUsername());
       this.socket.emit("sendData", data);
    }

    // signup method
    signup(){
          const username = $('#username').val();
          const firstname = $('#firstname').val();
          const lastname = $('#lastname').val();
          const password = $('#password').val();
          const usertype = $('#usertype').val();
          const data = {
            "username": username,
            "firstname": firstname,
            "lastname": lastname,
            "password": password,
            "usertype": usertype
          };
          this.getSocket().emit("signup", data);
    }

    eventSignup(data){
       if(data){
             alert("your account has been created, use your data to login now")
             window.location.replace("/");
       }
       else {
            alert("username not available")
       }
    }

    toSignup(){
       window.location.replace("/signup")
    }

    toLogin(){
       window.location.replace("/")
    }

    logout() {
          const data = {
              "username": this.getUsername(),
          };
          this.getSocket().emit("logout", data);
    }

    eventLogout(data){
          window.location.replace("/");
    }

     toString(){
        console.log("user: ",
                    this.getUsername(),
                    this.getFirstname(),
                    this.getLastname(),
                    this.getPassword(),
                    this.getUserType(),
                    )
    }

    startLocalVideo(){
        this.getLocalVideo().init(this.getFirstname()+" "+this.getLastname())
    }

    startVidoeconference(){
       this.getChatVideo().init(true)
    }

    joinVidoeconference(){
       this.getChatVideo().init(false)
    }


    createVideoconference() {
        const name = $('#room_name').val();

        if (name.length==0) {
            alert("name of room can not be blanck")
            return;
        }
        const creator = this.getUsername();
        const description = $('#room_description').val();
        const data = {
            "name": name,
            "creator": creator,
            "description": description,
        };
        this.getSocket().emit("createVideoconference", data);
    }

    eventUpdateVideoconferences(data) {
       data = JSON.parse(data)
        let comboBox = document.getElementById("room_id");
       comboBox.innerHTML = "";
       data.forEach(function(videoconference) {
           let optionElement = document.createElement("option");
           optionElement.value = videoconference.name;
           optionElement.textContent = videoconference.name;
           comboBox.appendChild(optionElement);
       });
    }

    getAllUsers(){
        this.getSocket().emit("getAllUsers", {"test": true});
    }

    getAllPatientsData(){
        this.getSocket().emit("getAllPatients", {"test": true});
    }

    getAllExercisesData(){
        this.getSocket().emit("getAllExercises", {"test": true});
    }

    specifyExercise(data){
         this.getSocket().emit("specifyExercise",data)
    }

    performsExercise(){
       this.getHandDetector().start()
    }

    eventGetAllUsers(users){
         console.log(users)
    }

    eventGetAllPatients(patients) {
        const table = document.createElement('table');
        table.classList.add('user-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['username', 'firstname', 'lastname', 'exercises', 'exercise Configs'];

        headers.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        patients.forEach((user) => {
            const { username, firstname, lastname } = user;

            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            usernameCell.textContent = username;
            const firstNameCell = document.createElement('td');
            firstNameCell.textContent = firstname;
            const lastNameCell = document.createElement('td');
            lastNameCell.textContent = lastname;;


            let select = this.createExerciseList()
            const exerciseCell = document.createElement('td');
            exerciseCell.appendChild(select);

            const selectedOption = select.value;
            const self = this
            const exerciseConfigsCell = document.createElement('td');
            exerciseConfigsCell.textContent = 'select Exercise to specify it';
            let button = document.createElement("button")
            button.id ="specify_"+user.id
            button.textContent="Specify"
            select.addEventListener('change', function(){
                                                                        let method= self.createExerciseConfigs(select.value)
                                                                        if(method){
                                                                            exerciseConfigsCell. innerHTML=''
                                                                            exerciseConfigsCell.appendChild(method)
                                                                            if(select.value==1) {
                                                                            button.addEventListener("click", function() {
                                                                                const bodyPartValue =  document.getElementById('bodyPart').value;
                                                                                const repetitionsValue = document.getElementById('repetitions').value;
                                                                                const durationValue = document.getElementById('duration').value;
                                                                                const distanceValue = document.getElementById('distance').value;
                                                                                const spreadingValue = document.getElementById('spreading').value;
                                                                                const speedValue = document.getElementById('speed').value;
                                                                                if(self.chekValidateExerciseData([bodyPartValue, repetitionsValue, durationValue, distanceValue, speedValue,spreadingValue]))
                                                                                {
                                                                                    let data = {"username":username, "exerciseId": select.value, "repetitions": repetitionsValue, "duration":durationValue , "distance": distanceValue, "speed":speedValue, "bodyPart": bodyPartValue, "spreading": spreadingValue }
                                                                                        self.specifyExercise(data)
                                                                                }
                                                                                else {
                                                                                    alert("input all params to specify exercise")
                                                                                }
                                                                            });
                                                                        }
                                                                            else if(select.value==2){
                                                                                button.addEventListener("click", function() {
                                                                                    const bodyPartValue =  document.getElementById('bodyPart').value;
                                                                                    const repetitionsValue = document.getElementById('repetitions').value;
                                                                                    const durationValue = document.getElementById('duration').value;
                                                                                    if(self.chekValidateExerciseData([bodyPartValue, repetitionsValue, durationValue]))
                                                                                    {
                                                                                        let data = {"username":username, "exerciseId": select.value, "repetitions": repetitionsValue, "duration":durationValue, "bodyPart": bodyPartValue}
                                                                                        self.specifyExercise(data)
                                                                                    }
                                                                                    else {
                                                                                    alert("input all params to specify exercise")
                                                                                    }
                                                                                });
                                                                            }

                                                                            exerciseConfigsCell.appendChild(button)

                                                                        }
                                                                        else
                                                                        {
                                                                            exerciseConfigsCell. innerHTML='select Exercise to specify it'
                                                                        }
                                                                    }
                                    )


            row.appendChild(usernameCell);
            row.appendChild(firstNameCell);
            row.appendChild(lastNameCell);
            row.appendChild(exerciseCell);
            row.appendChild(exerciseConfigsCell);


            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const tableContainer = document.getElementById('userTableContainer');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);

    }

    chekValidateExerciseData(data){
             for(let i=0;i<data.length;i++){
                 if(data[i].length==0)
                     return false
             }
             return true
        }


    createExerciseList(){
        const select = document.createElement('select');
        const initOptions = document.createElement("option");
        initOptions.value=0
        initOptions.textContent = "select exercise"


        select.appendChild(initOptions)

        this.allExercises.forEach((exercise) => {
              let option = document.createElement("option");
              option.value = exercise.id
              option.textContent = exercise.name
              select.appendChild(option);
        })

        return select;
    }

    createExerciseConfigs(exerciseId){
         switch (exerciseId) {
             case "1":
                  return this.createFingerAdductionConfigs(exerciseId)
                  break;
             case "2":
                 return this.createHandExensionConfigs(exerciseId)
                 break;
             default:
                 return null
         }

    }

    createFingerAdductionConfigs(exerciseId){
        const container = document.createElement('div');
        container.id = 'ExerciseContainer' + exerciseId;
        container.innerHTML = '';
        container.id = "ExerciseContainer"+exerciseId


        const label = document.createElement('label');
        label.textContent = "body part"

        const bodyPartselect= document.createElement("select")
        bodyPartselect.id = "bodyPart"
        const option0 = document.createElement("option");
        option0.value=""
        option0.textContent = "select body part"

        const option1 = document.createElement("option");
        option1.value="RightHand"
        option1.textContent = "Right Hand"

        const option2 = document.createElement("option");
        option2.value="LeftHand"
        option2.textContent = "Left Hand"

        bodyPartselect.appendChild(option0)
        bodyPartselect.appendChild(option1)
        bodyPartselect.appendChild(option2)

        container.appendChild(label)
        container.appendChild(bodyPartselect)

        const fields = [
            { label: 'number Of repetitions', type: 'text', id: 'repetitions'},
            { label: 'duration', type: 'text', id:'duration' },
            { label: 'distance between fingers', type: 'text', id:'distance' },
            { label: 'speed', type: 'text', id:'speed' },
            { label: 'spreading', type: 'text', id:'spreading' }
        ];

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = field.type
            input.id = field.id;


            container.appendChild(label);
            container.appendChild(input);
        });

        return container
    }

    createHandExensionConfigs(exerciseId){
        const container = document.createElement('div');
        container.id = 'ExerciseContainer' + exerciseId;
        container.innerHTML = '';
        container.id = "ExerciseContainer"+exerciseId


        const label = document.createElement('label');
        label.textContent = "body part"

        const bodyPartselect= document.createElement("select")
        bodyPartselect.id = "bodyPart"
        const option0 = document.createElement("option");
        option0.value=""
        option0.textContent = "select body part"

        const option1 = document.createElement("option");
        option1.value="RightHand"
        option1.textContent = "Right Hand"

        const option2 = document.createElement("option");
        option2.value="LeftHand"
        option2.textContent = "Left Hand"

        bodyPartselect.appendChild(option0)
        bodyPartselect.appendChild(option1)
        bodyPartselect.appendChild(option2)

        container.appendChild(label)
        container.appendChild(bodyPartselect)

        const fields = [
            { label: 'number Of repetitions', type: 'text',  id: 'repetitions' },
            { label: 'duration', type: 'text', id:'duration' },
        ];

        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.label;

            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;

            container.appendChild(label);
            container.appendChild(input);
        });
        return container
    }



    eventGetAllExercises(exercises) {
        this.allExercises = exercises

        const table = document.createElement('table');
        table.classList.add('exercise-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['id', 'name', 'description'];

        headers.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        exercises.forEach((exercise) => {
            const { id, name, description } = exercise;

            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            idCell.textContent = id;
            const nameCell = document.createElement('td');
            nameCell.textContent = name;
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = description;


            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(descriptionCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        const tableContainer = document.getElementById('exerciseTableContainer');
        tableContainer.innerHTML = '';
      tableContainer.appendChild(table);
   }

   eventSpecifyExercise(data){
        alert(data.message)
   }

   getMyExercisesData(){
       const data = {"username": this.getUsername()}
        this.getSocket().emit("getMyExercises", data );
   }

    eventGetMyExercises(exercises){
         this.setExercises(exercises)
    }

    redirectToHomePage(){
        this.sendDataToServer({"username":this.getUsername()})
        if(this.getUserType() === "therapist")
            window.location.replace("/home_therapist");
        else
            window.location.replace("/home_patient");
    }





}


