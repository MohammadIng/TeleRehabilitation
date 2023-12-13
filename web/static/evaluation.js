class ChatVideo{

    constructor(){
        this.myVideo = null;
        this.patientsData = null
    }



    getMyVideo() {
        return this.myVideo;
    }

    setMyVideo(myVideo) {
        this.myVideo = myVideo;
    }

    setPatientsData(patientsData){
        this.patientsData = patientsData
    }

    getPatientsData(){
        return this.patientsData
    }

    addPatientsData(patientsData){
        if(this.getPatientsData()==null)
            this.setPatientsData({})
        if(this.getPatientsData()[patientsData.id]==null)
            this.getPatientsData()[patientsData.id]=[]
        this.getPatientsData()[patientsData.id].push(patientsData)
        this.createPatientsDataList()
    }




    displayPatientData(patientsData){




        const patientsId = patientsData.substring(0, patientsData.indexOf("/"));
        const exerciseId = patientsData.substring(patientsData.indexOf("/")+1, patientsData.length);
        const self= this

        anychart.onDocumentReady(function () {

        var chartContainer = document.getElementById("analysisData");
        chartContainer.innerHTML = "";

       let data= self.getPatientsData()[patientsId]
       if(data !=null && data.length!=0)
           data = data[exerciseId]["data"]
       else {
           chartContainer.innerHTML = "data is null"
           return;
       }

        var dataSet = anychart.data.set(data);

        var data1 = dataSet.mapAs({x: 0, value: 1});
        var data2 = dataSet.mapAs({x: 0, value: 2});
        var data3 = dataSet.mapAs({x: 0, value: 3});
        var data4 = dataSet.mapAs({x: 0, value:4});
        var data5 = dataSet.mapAs({x: 0, value:5});



        var chart = anychart.line();

        var series1 = chart.line(data1);
        series1.name("Finger 1");
        var series2 = chart.line(data2);
        series2.name("Finger 2");
        var series3 = chart.line(data3);
        series3.name("Finger 3");
        var series4 = chart.line(data4);
        series4.name("Finger 4");
        var series5 = chart.line(data5);
        series5.name("Finger 5");


        chart.legend().enabled(true);

        chart.title("analysis Data: "+ patientsId);



        chart.container("analysisData");

        chart.draw();

      });
    }






    init(){
        const self = this
        document.addEventListener("DOMContentLoaded", (event)=>{
            var muteBttn = document.getElementById("bttn_mute");
            var muteVidBttn = document.getElementById("bttn_vid_mute");
            var callEndBttn = document.getElementById("call_end");
            var helpBttn = document.getElementById("bttn_help");


            muteBttn.addEventListener("click", (event)=>{

            });

            muteVidBttn.addEventListener("click", (event)=>{

            });

            callEndBttn.addEventListener("click", (event)=>{

            });

            helpBttn.addEventListener("click", (event) => {
                this.requestHelp()
            });
        });

        document.addEventListener("DOMContentLoaded", (event)=>{
            this.startCamerabyPatient()
        });

    }




     startCamerabyPatient() {

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
         })

    }


}


class EvluationUser {

    constructor() {
        this.userId = "";
        this.username = ""
        this.firstname = "";
        this.lastname = "";
        this.userType = "";
        this.password = "";
        this.exercises = "";
        this.videoconferences = []
        this.selectedVideoconference = null
        this.socket = io()
        this.chatVideo = null
        this.allExercises = null
        this.trainingChack = false
        this.localHand = null
    }

    static initUser() {
        return new EvluationUser();
    }


    setUserId(userId) {
      this.userId = userId;
    }

     setUsername(username) {
      this.username = username;
    }

    getUsername(){
        return this.username
    }

    getMyExercises(){
        this.socket.emit("getMyExercises", {"username": this.getUsername()});
    }

     getSocket(){
         return this.socket
    }
}


class AnalysisiData{
    constructor() {
        this.angleValues = []
    }

    getAngleValues(){
        return this.angleValues
    }

    setAngleValues(angleValues){
        this.angleValues = angleValues
    }

    addAngleVlaue(angleVlaue){
        this.getAngleValues().push(angleVlaue)
    }

    formatAnalysisData(){
         let data = [
        ];

       for (let i = 0; i < this.getAngleValues().length; i++) {
           let sublist = this.getAngleValues()[i];
           if(this.isDataValid(sublist)){
               sublist.unshift(i);
               data.push(sublist);
           }
        }
        return data
    }

    isDataValid(data){
        if(data.length<=3)
            return false
        for(let i=0;i<data.length;i++) {
            if (data[i] > 180)
                return false
        }
        return true
    }

    analyze(exercise){
        var max = exercise.distance
        var min = 45;
        const duration = exercise.duration

        const list = this.getbBasicData(max, min)
        const reps = this.countReps(list,max, min)
        const speed = this.speedCalculate(duration, reps)
        const spreading = this.spreadingDurationCalculate(list, max, duration)
        max = this.getMaxDistance(list)

        const data = {
                        "duration":duration,
                        "reps":reps,
                        "speed":speed,
                        "spreading":spreading,
                        "max": max
                    }
        return data;
    }

    getbBasicData(max, min){
       let data = []
        for (let i = 0; i < this.getAngleValues().length; i++) {
            let val = this.getAngleValues()[i][4];
            if (val < min || (val > max && val < 100))
                data.push(val)
        }
        return data
    }

    countReps(lst, max, min) {
        const subsMax = this.countSublistsMax(lst,max)
        const subsMin = this.countSublistsMin(lst,min)
        const count = Math.round((subsMax+subsMin)/2)
        return count;
    }

    countSublistsMin(lst,min){
        let count = 0;
        let isSublist = false;

        for (const value of lst) {
            if (value < min) {
                if (!isSublist) {
                    count++;
                    isSublist = true;
                }
            } else {
                isSublist = false;
            }
      }
      return count;
    }

    countSublistsMax(lst,max){
        let count = 0;
        let isSublist = false;

        for (const value of lst) {
            if (value > max) {
              if (!isSublist) {
                count++;
                isSublist = true;
              }
            } else {
                isSublist = false;
            }
        }
      return count;
    }

    speedCalculate(duration, reps){
        return duration/reps
    }

     spreadingDurationCalculate(list, max, duration){
        const length = list.length
        let longestSublistLength = 0;
        let currentSublistLength = 0;

        for (const value of list) {
            if (value > max) {
              currentSublistLength++;
              longestSublistLength = Math.max(longestSublistLength, currentSublistLength);
            } else {
              currentSublistLength = 0;
            }
          }
      return  Math.round((longestSublistLength * duration) / length)
    }

    average(list){
        const sum = list.reduce((accumulator, value) => accumulator + value, 0);
        return sum / list.length
    }

    getMaxDistance(data){
        return Math.max(...data);
    }

    showAngleVlaues(exercise){

        const self= this
        anychart.onDocumentReady(function () {

       let data = [
             ];
       const copiedList = self.getAngleValues().map(innerList => [...innerList]);

       for (let i = 0; i < copiedList.length; i++) {
           let sublist = copiedList[i];
           if(self.isDataValid(sublist)){
               sublist.unshift(i);
               data.push(sublist);
           }
        }

        var dataSet = anychart.data.set(data);

        var data1 = dataSet.mapAs({x: 0, value: 1});
        var data2 = dataSet.mapAs({x: 0, value: 2});
        var data3 = dataSet.mapAs({x: 0, value: 3});
        var data4 = dataSet.mapAs({x: 0, value: 4});
        var data5 = dataSet.mapAs({x: 0, value: 5});



        var chart = anychart.line();

        var series1 = chart.line(data1);
        series1.name("data1");
        var series2 = chart.line(data2);
        series2.name("data2");
        var series3 = chart.line(data3);
        series3.name("data3");
        var series4 = chart.line(data4);
        series4.name("data4");
        var series5 = chart.line(data5);
        series5.name("data5");

        chart.legend().enabled(true);

        chart.title("analysis Data");

        var chartContainer = document.getElementById("analysisData");
        chartContainer.innerHTML = "";

        chart.container("analysisData");

        chart.draw();

      });


    this.createResultTable(this.analyze(exercise))

     return this.getAngleValues()
    }

    createResultTable(data) {
        const table = document.createElement("table");
        const headersRow = document.createElement("tr");
        const dataRow = document.createElement("tr");

        const headers = ["Duration", "Reps", "Speed", "Spreading", "Max"];
        for (const header of headers) {
            const headerCell = document.createElement("th");
            headerCell.textContent = header;
            headersRow.appendChild(headerCell);
        }
        table.appendChild(headersRow);



        const durationCell = document.createElement("td");
        durationCell.textContent = data.duration;
        dataRow.appendChild(durationCell);

        const repsCell = document.createElement("td");
        repsCell.textContent = data.reps;
        dataRow.appendChild(repsCell);

        const speedCell = document.createElement("td");
        speedCell.textContent = data.speed;
        dataRow.appendChild(speedCell);

        const spreadingCell = document.createElement("td");
        spreadingCell.textContent = data.spreading;
        dataRow.appendChild(spreadingCell);

        const maxCell = document.createElement("td");
        maxCell.textContent = data.max;
        dataRow.appendChild(maxCell);

        table.appendChild(dataRow);

        const resultTableDiv = document.getElementById("resultTable");
        resultTableDiv.innerHTML = "";
        resultTableDiv.appendChild(table);
    }

}

class Constraint{
    constructor(id ,name,  method, message, met) {
        this.id = id
        this.name = name
        this.met = met
        this.method = method
        this.message = message
    }

    getName(){
        return this.name
    }

    getId(){
        return this.id
    }

    isMet(){
        return this.met
    }

    setName(name){
        this.name = name
    }

    setId(id){
        this.id = id
    }

    setMet(met){
        this.met = met
    }

    getMethod(){
        return this.method
    }

    setMethod(method){
        this.method = method
    }

    getMessage(){
        return this.message
    }

    setMessage(message){
        this.message = message
    }

    invokeMethod(){
        return this.method()
    }

}

class AllConstraints{
    constructor(numberOfConstraints, constraintsValues) {
        this.numberOfConstraints = numberOfConstraints
        this.constraintsValues = constraintsValues
    }

    getNumberOfConstraints(){
        return this.numberOfConstraints
    }

    setNumberOfConstraints(numberOfConstraints){
         this.numberOfConstraints = numberOfConstraints
    }

    getConstraintsValues(){
        return this.constraintsValues
    }

    setConstraintsValues(constraintsValues){
        this.constraintsValues = constraintsValues
    }

    isAllconstraintsValuesMet() {
        for (let i= 0; i<this.getNumberOfConstraints() ; i++) {
            const constraint = this.getConstraintsValues()[i]
            if (!constraint.invokeMethod()) {
                constraint.met =false
                return constraint
            }
        }
        return new Constraint(0, "",  function () {
            console.log("all is met")
        }, "all is met", true)
    }

    setConstraintValue(id, value){
        this.getConstraintsValues()[id] = value
    }

    addConstraint(constraint){
        this.getConstraintsValues().push(constraint)

    }

}

class Performance{
    constructor(id ,name,  method, message, met) {
        this.id = id;
        this.name = name;
        this.method = method;
        this.message = message;
        this.met = met
    }

    getName(){
        return this.name
    }

    getId(){
        return this.id
    }

    isMet(){
        return this.met
    }

    setName(name){
        this.name = name
    }

    setId(id){
        this.id = id
    }

    setMet(met){
        this.met = met
    }

    getMethod(){
        return this.method
    }

    setMethod(method){
        this.method = method
    }

    getMessage(){
        return this.message
    }

    setMessage(message){
        this.message = message
    }

    invokeMethod(){
        return this.method()
    }

}

class AllPerformances{
    constructor(numberOfPerformances, performancesValues) {
        this.numberOfPerformances = numberOfPerformances
        this.performancesValues = performancesValues
    }

    getNumberOfPerformances(){
        return this.numberOfPerformances
    }

    setNumberOfPerformances(numberOfPerformances){
         this.numberOfPerformances = numberOfPerformances
    }

    getPerformancesValues(){
        return this.performancesValues
    }

    setPerformancesValues(performancesValues){
        this.performancesValues = performancesValues
    }

    isAllPerformancesMet() {


        // for (let i= 0; i<this.getNumberOfPerformances() ; i++) {
        //     const performance = this.getPerformancesValues[i]
        //     if (performance.invokeMethod().length!=0) {
        //         return performance
        //     }
        // }
        // return new Performance(0, "",  function () {
        //     console.log("all is met")
        // }, "all is met", true)
        const message = this.getPerformancesValues()[0].getName() + this.getPerformancesValues()[0].getMessage()
        return  message
    }

    setPerformanceValue(id, value){
        this.getPerformancesValues()[id] = value
    }

    addPerformance(performance){
        this.getPerformancesValues().push(performance)

    }

}

class Exercise {
    constructor(id, name, rightHand) {
        this.id = id
        this.name = name;
        this.rightHand = rightHand
        this.constraints = []
        this.performances = []
        this.allConstraints = null
        this.allPerformances = null
    }

    getId(){
        return this.id
    }

    setId(id){
        this.id = id
    }

    getName(){
        return this.name
    }

    setName(name){
        this.name = name
    }

    isRightHand(){
        return this.rightHand
    }

    setRightHand(rightHand){
        this.rightHand = rightHand

    }


}



class FingerAdduction extends Exercise {
    constructor(id,handdetected, correctHand, rightHand, performances,landmarks) {
        super(id, "FingerAdduction", rightHand);
        this.handdetected = false
        this.landmarks = landmarks
        this.initConstraints(handdetected,correctHand,rightHand,landmarks)
        this.initPerformances(performances,landmarks);
    }


    initConstraints(handdetected, correctHand, rightHand,landmarks){

        let names = ["detecteHand","correctHand","detecteHandPalm","fingersUp"]
        let messages = ["No Hand detected","Not correct Hand","No Hand Palm detected","No fingers Up"]
        let functions=[function () {return handdetected},
                       function () {return correctHand},
                       function () {if(!rightHand && landmarks[4].x > landmarks[17].x)return true;else  if(rightHand && landmarks[4].x < landmarks[17].x) return true;return false},
                       function () {if(landmarks[12].y < landmarks[9].y) return true; return false},
                    ]

        for(let i =0; i<4; i++){
            let  constraint = new Constraint(i+1, names[i], functions[i], messages[i], false);
            this.constraints.push(constraint)
        }

        this.allConstraints  = new AllConstraints(4,this.constraints)
    }

    initPerformances(performances ,landmarks){
        let names = ["exerciseDuration ","NumberOfRepetition","spreadingDuration","adductionSpeed", "distanceBetweenFingers"]
        let messages = [performances.exerciseDuration,performances.NumberOfRepetition,performances.spreadingDuration,performances.adductionSpeed, performances.distanceBetweenFingers]
        let functions=[function () {return messages[0]},
                       function () {return messages[1]},
                       function () {return messages[2]},
                       function () {return messages[3]},
                       function () {return messages[4]}
                    ]

        for(let i =0; i<5; i++){
            let performance = new Performance(i+1, names[i], functions[i], messages[i], false);
            this.performances.push(performance)
        }
        // console.log("performances:  "+this.performances[0].getMessage())

        this.allPerformances  = new AllPerformances(4,this.performances)
    }


    checkConstraints(){
        return this.allConstraints.isAllconstraintsValuesMet()
    }

    checkPerformances(){
        return this.allPerformances.isAllPerformancesMet()
    }

}

// this is to testing
class HandExtension extends Exercise {
    constructor(id,handdetected, correctHand, rightHand, performances, landmarks) {
        super(id, "HandExtension", rightHand);
        this.handdetected = false
        this.landmarks = landmarks
        this.initConstraints(handdetected,correctHand,rightHand,landmarks)
    }

    isHanddetected(){
        return this.handdetected
    }

    setHanddetected(handdetected){
        this.handdetected = handdetected
    }

    getLandmarks(){
        return this.landmarks
    }

    setLandmarks(landmarks){
        this.landmarks = landmarks
    }

    initConstraints(handDetected, correctHand, rightHand, landmarks){

        let names = ["detecteHand","correctHand","detecteHandPalm",]
        let messages = ["No Hand detected","Not correct Hand","No Hand Palm detected"]
        let functions=[function () {return handDetected},
                       function () {return correctHand},
                       function () {if(!rightHand && landmarks[4].x > landmarks[17].x)return true;else  if(rightHand && landmarks[4].x < landmarks[17].x) return true;return false},
                    ]

        for(let i =0; i<3; i++){
            let  constraint = new Constraint(i+1, names[i], functions[i], messages[i], false);
            this.constraints.push(constraint)
        }
        this.allConstraints  = new AllConstraints(3,this.constraints)
    }

    checkConstraints(){
        return this.allConstraints.isAllconstraintsValuesMet()
    }

}


class Hand {
    constructor() {
        this.width = 480;
        this.height = 480;
        this.landmarks = null;
        this.classification=null;
        this.video = null;
        this.canvas = null;
        this.controls = null;
        this.canvasCtx = null;
        this.fpsControl = new FPS();
        this.hands = null;
        this.camera = null;
        this.options =  {"selfieMode":true,
                         "maxNumHands":1,
                         "minDetectionConfidence":0.5,
                         "minTrackingConfidence":0.5};
        this.bodyPart = "RightHand"
        if(this.bodyPart!=="RightHand")
            this.isRightHand = false;
        this.exerciseAnalyzer = new ExerciseAnalyzer();
        this.myExercises = []
        this.exercise  = null
        this.currentExersie = 0
        this.wichExercise = ""
        this.exerciseCheck = ""
        this.performances = null
        this.timeInterval = null
        this.duration = 0
        this.currentTime= 0
        this.toAnalysis = false
        this.analysisData  = null
        this.timer = 5
        this.socket = null

    }


    setExerciseCheck(exerciseCheck){
        this.exerciseCheck = exerciseCheck
    }

    isExerciseCheck(){
        return this.exerciseCheck
    }

    setMyExercise(myExercises){
        this.myExercises = myExercises
    }

    getMyExercises(){
        return this.myExercises
    }

    setBodyPart(bodyPart){
        this.bodyPart = bodyPart
    }

    setWichExercise(wichExercise){
        this.wichExercise =wichExercise
    }

    getWichExercise(){
        return this.wichExercise
    }

    getPerformances(){
        return this.performances
    }

    setPerformances(performances){
        this.performances = performances

    }

    getTimeInterval(){
        return this.timeInterval
    }

    setTimeInterval(timeInterval){
        this.timeInterval = timeInterval
    }

    getDuration(){
        return this.duration
    }

    setDuration(duration){
        this.duration = duration
    }

    getCurrentTime(){
        return this.currentTime
    }

    setCurrentTime(currentTime){
        this.currentTime = currentTime
    }

    setToAnalysis(toAnalysis){
        this.toAnalysis = toAnalysis

    }

    isToAnalysis(){
        return this.toAnalysis
    }

    getAnaysisData(){
        return this.analysisData
    }

    setAnalysisData(analysisData){
        this.analysisData = analysisData
    }

    setCurrentExersie(currentExersie){
        this.currentExersie = currentExersie
    }

    getCurrentExersie(){
        return this.currentExersie
    }

    getTimer(){
        return this.timer
    }

    setTimer(timer){
        this.timer = timer
    }




    startAnalysis(){
       this.setCurrentTime(0)
       const self = this
       const timeInterval = setInterval(function() {
                                                                if(self.getCurrentTime()>=self.getDuration()) {
                                                                    // Evaluation
                                                                    self.sendDataToServer(self.getAnaysisData().showAngleVlaues(self.getMyExercises()[self.getCurrentExersie()]))
                                                                    self.stopAnalysis()
                                                                    self.displayCurrentExercise()
                                                                    self.startTimer()
                                                                    return;
                                                                }
                                                                else if(self.isToAnalysis())  {
                                                                    self.setCurrentTime(self.getCurrentTime()+1)
                                                                }
                                                                else if(!self.isToAnalysis()){
                                                                    self.restartAnalysis()
                                                                }

                                                            }, 1000);
       this.setTimeInterval(timeInterval)
    }

    stopAnalysis(){
        this.restartAnalysis()
        const self = this
        clearInterval(self.getTimeInterval())
    }

    restartAnalysis(){
        this.setCurrentTime(0)
        this.setAnalysisData(new AnalysisiData())
    }

    sendDataToServer(data){
        const dataType = document.getElementById("evaluatioType").value
        const dataToSend = {};
        dataToSend["dataType"] = dataType
        dataToSend["data"] = data;
        this.socket.emit("evalutionData", dataToSend);
    }

    initExercise(){
        if(this.getWichExercise()=="FingerAdduction")
            this.exercise = new FingerAdduction(this.id, true, this.isCorrectHand(), this.isRightHand, this.getPerformances(), this.landmarks)
        else {
            this.exercise = new HandExtension  (this.id, true, this.isCorrectHand(), this.isRightHand, this.getPerformances() ,this.landmarks)
        }
    }


   getExercisesToPatients(socket, exercises){
        this.socket = socket
        this.setMyExercise(exercises)
        this.setCurrentExersie(0)
        this.startTimer()
    }

    updateExercise(){
        if(this.getMyExercises().length>this.getCurrentExersie()) {
            const {
                exerciseId,
                name,
                description,
                bodyPart,
                repetitions,
                duration,
                distance,
                speed,
                spreading
            } = this.getMyExercises()[this.getCurrentExersie()];
            console.log("exercise:  ", name)
            this.setBodyPart(bodyPart)
            this.setWichExercise(name)
            this.setAnalysisData(new AnalysisiData());
            this.updatePerformances(duration, repetitions, spreading, speed, distance);
            this.setExerciseCheck(true)
            this.startAnalysis();

        }
        else
        {
            console.log("not exercises more")
        }
    }

    startTimer(){
        this.setTimer(5)
        this.displayCurrentExercise()
        const self = this
            let timer =
                setInterval(() => {
                    second.style.transform = `rotate(${6 * self.getTimer()}deg)`;
                    self.setTimer(self.getTimer() - 1)
                        if(self.getTimer()<0){
                            clearInterval(timer)
                            self.updateExercise()
                        }
                    }, 1000);
        }




   updatePerformances(exerciseDuration, NumberOfRepetition, spreadingDuration, adductionSpeed, distanceBetweenFingers){
        this.setDuration(exerciseDuration)
        const performances = {"exerciseDuration":exerciseDuration,"NumberOfRepetition":NumberOfRepetition}
        if(spreadingDuration!= null && spreadingDuration.length!=0)
            performances["spreadingDuration"] = spreadingDuration
        if(adductionSpeed!= null && adductionSpeed.length!=0)
            performances["adductionSpeed"] = adductionSpeed
        if(distanceBetweenFingers!= null && distanceBetweenFingers.length!=0)
            performances["distanceBetweenFingers"] = distanceBetweenFingers
        this.setPerformances(performances)
   }


   displayCurrentExercise() {
        const exercise = this.getMyExercises()[this.getCurrentExersie()];

        const table = document.createElement('table');
        table.classList.add('exercise-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['property', 'value'];

        headers.forEach((headerText) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        const propertyOrder = ['name', 'description','bodyPart', 'duration', 'repetitions', 'distance', 'speed', 'spreading'];

        propertyOrder.forEach((propertyName) => {
            if (propertyName in exercise) {
                const row = document.createElement('tr');

                const propertyNameCell = document.createElement('td');
                propertyNameCell.textContent = propertyName;

                const propertyValueCell = document.createElement('td');
                propertyValueCell.textContent = exercise[propertyName];

                row.appendChild(propertyNameCell);
                row.appendChild(propertyValueCell);

                tbody.appendChild(row);
            }
        });

        table.appendChild(tbody);

        const tableContainer = document.getElementById('currentExerciseTable');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
    }




    // init start
   start(){
        this.handsDetectCameraLocal()
        return this.camera
   }


    // hands detector init local video
   handsDetectCameraLocal(){
        this.createHands ()
        this.getHTMLMPElements()
        this.hands.onResults(results => this.onResultsHands(results));
        this.createCameraLocal()
        this.createControlPanel()
        this.camera.start()
   }

   createCameraLocal() {
        this.camera= new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({image: this.video});
            },
            width: this.width,
            height: this.height,
        });
   }

    createHands() {
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
            }
        });
    }

    // get html ids
    getHTMLIds() {
        const iD = {
            "video": "videoCamera",
            "canvas": "output",
            "controls": "control"
        }
        return iD;
    }

    // canvas init to show processed frame to local video
    getHTMLMPElements() {
        const iD = this.getHTMLIds();
        this.video = document.getElementById(iD.video);
        this.canvas = document.getElementsByClassName(iD.canvas)[0];
        this.controls = document.getElementsByClassName(iD.controls)[0];
        this.canvasCtx = this.canvas.getContext('2d');
    }


   updateMessage(message){
        var textElement = document.getElementById("textContainer");
        textElement.textContent = message;
   }

    // process frame to detect hand
   onResultsHands(results) {
        var message = "get ready to start"
        let data = "Error"
        var state = false
        this.canvasCtx.font = '15px Arial';
        this.canvasCtx.fillStyle = 'red';
        this.canvasCtx.textAlign = 'center';
        document.body.classList.add('loaded');
        this.fpsControl.tick();
        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasCtx.drawImage(results.image, 0, 0, this.canvas.width,this. canvas.height);
        if (results.multiHandLandmarks && results.multiHandedness) {
            this.classification = results.multiHandedness[0];
            this.isRightHand = this.classification.label === 'Right';
            this.landmarks = results.multiHandLandmarks[0];
            this.initExercise()
            this.setToAnalysis(this.exercise.checkConstraints().met)

            if(this.getTimer()<=0) {
                state = true
                if (this.isToAnalysis() && this.getTimer() <= 0)
                    message = this.getDuration() + ":    " + this.getCurrentTime()
                if (!this.isToAnalysis()) {
                    message = this.exercise.checkConstraints().message
                }
            }
            if (!this.isToAnalysis()) {
                this.restartAnalysis()
            }

            data = this.exerciseAnalyzer.run(this.id,[false, false, false, state],this.isRightHand,this.landmarks,this.canvas,this.canvasCtx, this.exercise.checkConstraints(), this.getDuration()+":    "+this.getCurrentTime())
            if(this.getAnaysisData() && this.isToAnalysis())
                this.getAnaysisData().addAngleVlaue(data)
        }
        else {
            this.restartAnalysis()
            if(this.getTimer()<=0) {
                message = "No Hand detected"
            }
        }
        this.updateMessage(message)
        this.canvasCtx.restore();

    }

    isCorrectHand() {
        if (this.bodyPart == "RightHand" && this.isRightHand) {
            return true
        }
        if (this.bodyPart == "RightHand" && !this.isRightHand) {
            return false
        }
        if (this.bodyPart == "LeftHand" && !this.isRightHand) {
            return true
        }
        if (this.bodyPart == "LeftHand" && this.isRightHand) {
            return false
        }
    }

    sendData(data){
        // console.log(this.dataChannel)
        if(this.dataChannel)
            this.dataChannel.send(data)
    }

    // draw Default

    drawDefault(){
        drawLandmarks(
              this.canvasCtx, this.landmarks, {
              color: this.isRightHand ? '#00FF00' : '#FF0000',
              fillColor: this.isRightHand ? '#FF0000' : '#00FF00',
              radius: (x) => {
                return lerp(x.from.z, -0.15, .1, 5, 1);
              }
            });
    }


    // control panel create
    createControlPanel() {

        new ControlPanel(this.controls, {
            selfieMode: this.options.selfieMode,
            maxNumHands: this.options.maxNumHands,
            minDetectionConfidence: this.options.minDetectionConfidence,
            minTrackingConfidence: this.options.minTrackingConfidence
        })
            .add([
                new StaticText({title: 'MediaPipe Hands'}),
                this.fpsControl,

                new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),

                new Slider(
                    {title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1}),

                new Slider({
                    title: 'Min Detection Confidence',
                    field: 'minDetectionConfidence',
                    range: [0, 1],
                    step: 0.01
                }),

                new Slider({
                    title: 'Min Tracking Confidence',
                    field: 'minTrackingConfidence',
                    range: [0, 1],
                    step: 0.01
                }),
            ])
            .on(options => {
                this.video.classList.toggle('selfie', options.selfieMode);
                this.hands.setOptions(options);
            });
    }


    // stop hand detector
    stop(){
        this.video.remove()
        this.camera.stop()
    }
}


class ExerciseAnalyzer {
    constructor() {

    }


    init(canvas, canvasCtx){
        this.canvas = canvas;
        this.canvasCtx = canvasCtx;
        return this
    }

     run(id, toShow,isRightHand,landmarks,canvas, canvasCtx, constraintState, message){
        this.id = id
        this.landmarks = landmarks;
        this.isRightHand= isRightHand;
        this.canvas = canvas;
        this.canvasCtx = canvasCtx;
        this.angles = []
        this.points = [this.landmarks[1], this.landmarks[5], this.landmarks[9], this.landmarks[17], this.landmarks[0]]
        this.calculateAngles();
         if (toShow[0])
             this.showAngles(message);
         if (toShow[1])
             this.drawCirclesDefault()
         if (toShow[2])
             this.drawLinesDefault()
        if(toShow[3] && constraintState.met ) {
            this.drawInitAngle(parseInt(this.calculateInitAngle()))
        }
        return this.angles
     }

     calculateInitAngle(){
        let p2 = this.landmarks[0]
        let p1 = this.landmarks[4]
        let p3 = this.landmarks[20]
        let angle;
        const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
        angle = radians * 180 / Math.PI;
        angle = angle < 0 ? angle + 360 : angle;
        angle = this.reCalculateAngle(angle)
        return angle
    }

    calculateAngles() {
        let p1 = 4
        let p2 = 2
        this.landmarks[2] = this.getMiddlePoint(this.landmarks[2], this.landmarks[5])
        let p3 = 6

        let p4 = 8
        let p5 = 5
        this.landmarks[5] = this.getMiddlePoint(this.landmarks[5], this.landmarks[9])
        let p6 = 12

        let p7 = 12
        let p8 = 9
        this.landmarks[9] = this.getMiddlePoint(this.landmarks[9], this.landmarks[13])
        let p9 = 16

        let p10 = 16
        let p11 = 13
        this.landmarks[13] = this.getMiddlePoint(this.landmarks[13], this.landmarks[17])
        let p12 = 20

        let p13 = 4
        let p14 = 0
        let p15 = 20


        const fingers = [
            [p1, p2, p3],
            [p4, p5, p6],
            [p7, p8, p9],
            [p10, p11, p12],
            [p13,p14,p15]
        ];

        let angle;
        this.angles=[]
        for (let i = 0; i < fingers.length; i++) {
            const [p1, p2, p3] = fingers[i].map(idx => this.landmarks[idx]);
            const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
            angle = radians * 180 / Math.PI;
            angle = angle < 0 ? angle + 360 : angle;
            angle = this.reCalculateAngle(angle)
            this.angles.push(Math.round(angle));
        }


    }

    reCalculateAngle(angle) {
        if (this.isRightHand && this.landmarks[0].x < this.landmarks[20].x)
            return angle
        if (this.isRightHand && this.landmarks[0].x > this.landmarks[20].x)
            return 360 - angle
        if (this.landmarks[0].x > this.landmarks[20].x)
            return 360 - angle
        if (this.landmarks[0].x < this.landmarks[20].x)
            return angle
    }

    showAngles() {
        for (let i = 0; i < this.angles.length; i++) {
            this.canvasCtx.fillText(this.angles[i], this.points[i].x * this.canvas.width, this.points[i].y * this.canvas.height);
        }

    }

     showMessage(message) {
        this.canvasCtx.fillText(message, this.canvas.width/3,  this.canvas.height/7);
        return message
    }

    drawInitAngle(angle){
        this.drawLine(this.landmarks[0], this.landmarks[4], "red",1)
        this.drawLine(this.landmarks[0], this.landmarks[20], "red",1)
        this.drawCircle(this.landmarks[0], 3, "black")
        this.canvasCtx.fillText(angle, this.points[4].x * this.canvas.width, this.points[4].y * this.canvas.height + 20);
        // this.showMessage(angle)
    }

    drawCirclesDefault() {
        this.drawCircles(3, "red")
    }

    drawCircles(radius, color) {
        for (let i = 0; i < this.points.length; i++) {
            this.drawCircle(this.points[i], radius, color)
        }
    }

    drawCircle( point, radius, color) {
        const startAngle = 0;
        const endAngle = Math.PI * 2;
        const counterClockwise = false;
        this.canvasCtx.beginPath();
        this.canvasCtx.arc(point.x * this.canvas.width, point.y * this.canvas.height, radius, startAngle, endAngle, counterClockwise);
        this.canvasCtx.stroke();
        this.canvasCtx.fillStyle = color;
        this.canvasCtx.fill();
    }

    drawLinesDefault() {


        const lines = [];

        let l1 = {"start": this.landmarks[1], "end": this.landmarks[4]};
        lines.push(l1)
        let l2 = {"start": this.landmarks[1], "end": this.landmarks[5]};
        lines.push(l2)


        let l3 = {"start": this.landmarks[8], "end": this.landmarks[5]};
        lines.push(l3)
        let l4 = {"start": this.landmarks[5], "end": this.landmarks[12]};
        lines.push(l4)


        let l5 = {"start": this.landmarks[12], "end": this.landmarks[9]};
        lines.push(l5)
        let l6 = {"start": this.landmarks[9], "end": this.landmarks[16]};
        lines.push(l6)


        let l7 = {"start": this.landmarks[16], "end": this.landmarks[13]};
        lines.push(l7)
        let l8 = {"start": this.landmarks[13], "end": this.landmarks[20]};
        lines.push(l8)
        this.drawLines(lines)


    }

    drawLines(lines) {
        for (let i = 0; i < lines.length; i++)
            this.drawLine(lines[i].start, lines[i].end, "blue", 0.5)
    }


    drawLine(start, end, color, width) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(start.x * this.canvas.width, start.y * this.canvas.height);
        this.canvasCtx.lineTo(end.x * this.canvas.width, end.y * this.canvas.height);
        this.canvasCtx.strokeStyle = color;
        this.canvasCtx.lineWidth = width;
        this.canvasCtx.stroke();
    }

    toString(angles) {
        let str = "[ ";
        str += angles[0];
        str += ", "
        str += angles[1];
        str += ", "
        str += angles[2];
        str += ", "
        str += angles[3];
        str += " ]"
        return str;
    }

    getMiddlePoint(p1, p2) {
        const x = (p1.x + p2.x) / 2;
        const y = (p1.y + p2.y) / 2;
        return {x, y};
    }
}


