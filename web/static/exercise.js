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

class Exercise {
    constructor(id, name, bodyPart) {
        this.id = id
        this.name = name;
        this.bodyPart = bodyPart
        this.constraints = []
        this.performances = []
        this.allConstraints = null
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

    getBodyPart(){
        return this.bodyPart
    }

    setBodyPart(bodyPart){
        this.bodyPart = bodyPart

    }

}

class FingerAdduction extends Exercise {
    constructor(id,handdetected, correctHand, rightHand, landmarks) {
        super(id, "fingerAdduction", rightHand);
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

        let names = ["detecteHand","correctHand","detecteHandPalm","fingersUp"]
        let messages = ["No Hand detected","Not correct Hand","No Hand Palm detected","No fingers Up"]
        let functions=[function () {return handDetected},
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

    checkConstraints(){
        return this.allConstraints.isAllconstraintsValuesMet()
    }

}


// this is to testing
class HandExtension extends Exercise {
    constructor(id,handdetected, correctHand, rightHand, landmarks) {
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

class AnalysisData{
    constructor() {
        this.targetPerformances = null
        this.actualPerformances = null
        this.rawAnalysisData = []
    }

    getRawAnalysisData(){
        return this.rawAnalysisData
    }

    setRawAnalysisData(rawAnalysisData){
        this.rawAnalysisData = rawAnalysisData
    }

    getTargetPerformances(){
        return this.targetPerformances
    }

    setTargetPerformances(targetPerformances){
        this.targetPerformances = targetPerformances
    }

    getActualPerformances(){
        return this.actualPerformances
    }

    setActualPerformances(actualPerformances){
        this.actualPerformances = actualPerformances
    }


    addValues(angleVlaue){
        this.getRawAnalysisData().push(angleVlaue)
    }


    formatAnalysisData(){
         let data = [
        ];

       for (let i = 0; i < this.getRawAnalysisData().length; i++) {
           let sublist = this.getRawAnalysisData()[i];
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

    analyze(patientId,patientName, exerciseIndex, exercise){
        const min = 45

        // get patient data
        const exerciseId = exercise.exerciseId
        const exerciseName = exercise.name

        // get targetValues of exercise
        const max = exercise.distance
        const duration = exercise.duration
        const repetitions = exercise.repetitions
        const speed = exercise.speed
        const spreading = exercise.spreading

        // get isValues of exercise
        const list = this.getbBasicData(max, min)
        const reps = this.countReps(list, max, min)
        const mergeSpeed = this.mergeSpeedCalculate(duration, reps)
        const spreadingDuration = this.spreadingDurationCalculate(list, max, duration)
        const maxDistance = this.getMaxDistance(list)
        const initData = this.formatAnalysisData()


        const targetValues= {
                        "duration":duration,
                        "reps":repetitions,
                        "spreadingDuration":spreading,
                        "mergeSpeed":speed,
                        "maxDistance":max,
                        }
        const isValues = {
                            "duration":duration,
                            "reps":reps,
                            "spreadingDuration":spreadingDuration,
                            "mergeSpeed":mergeSpeed,
                            "maxDistance":maxDistance,
                            }
        const data = {  "type": "data",
                        "id":patientId,
                        "name":patientName,
                        "exerciseId":exerciseIndex,
                        "data":initData,
                        "isValues":isValues,
                        "targetValues":targetValues,
                        "exerciseName":exerciseName,
                    }
        return JSON.stringify(data);
    }

    getbBasicData(max, min){
       let data = []
        for (let i = 0; i < this.getRawAnalysisData().length; i++) {
            let val = this.getRawAnalysisData()[i][4];
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

    mergeSpeedCalculate(duration, reps){
        return Math.round(duration/reps)
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

     getMaxDistance(data){
        return Math.max(...data);
     }

    average(list){
        const sum = list.reduce((accumulator, value) => accumulator + value, 0);
        return sum / list.length
    }

}




class HandDetector {
    constructor() {
        this.id = "";
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
        this.patientName = "";
        this.bodyPart = "RightHand"
        if(this.bodyPart!=="RightHand")
            this.isRightHand = false;
        this.exerciseAnalyzer = new ExerciseAnalyzer();
        this.exercise  = null
        this.wichExercise = ""
        this.timeInterval = null
        this.duration = 0
        this.currentTime= 0
        this.toAnalysis = false
        this.analysisData  = null
        this.myExercises = []
        this.currentExersie = 0
        this.userId = 0
        this.timer = 5


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

    getAnalysisData(){
        return this.analysisData
    }

    setAnalysisData(analysisData){
        this.analysisData = analysisData
    }

    setMyExercise(myExercises){
        this.myExercises = myExercises
    }

    getMyExercises(){
        return this.myExercises
    }

    setCurrentExersie(currentExersie){
        this.currentExersie = currentExersie
    }

    getCurrentExersie(){
        return this.currentExersie
    }

    setUserId(userId){
        this.userId = userId
    }

    getUserId(){
        return this.userId
    }

    getTimer(){
        return this.timer
    }

    setTimer(timer){
        this.timer = timer
    }

    getPatientName(){
        return this.patientName
    }

    setPatientName (patientName){
        this.patientName = patientName
    }



    initExercise(){
        if(this.getWichExercise()=="fingerAdduction")
            this.exercise = new FingerAdduction(this.id, true, this.isCorrectHand(), this.isRightHand, this.landmarks)
        else {
            this.exercise = new HandExtension(this.id, true, this.isCorrectHand(), this.isRightHand, this.landmarks)
        }
    }

   getExercisesToPatients(userId, patientName, exercises, dataChannel){
        this.setUserId(userId)
        this.setPatientName(patientName)
        this.setMyExercise(exercises)
        this.setDataChannel(dataChannel)
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
            this.setBodyPart(bodyPart)
            this.setWichExercise(name)
            this.setAnalysisData(new AnalysisData());
            this.updatePerformances(duration, repetitions, spreading, speed, distance);
            this.startAnalysis();

        }
        else
        {
            console.log("not exercises more")
        }
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
        return performances
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

       startTimer(){
        this.setTimer(60)
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

    startAnalysis(){
       this.setCurrentTime(0)
       const self = this
       const timeInterval = setInterval(function() {
                                                                if(self.getCurrentTime()>=self.getDuration()) {
                                                                    self.sendData(self.getAnalysisData().analyze(self.getUserId(), self.getPatientName(),self.getCurrentExersie(), self.getMyExercises()[self.getCurrentExersie()]))
                                                                    self.stopAnalysis()
                                                                    self.setCurrentExersie(self.getCurrentExersie()+1)
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
        this.setAnalysisData(new AnalysisData())
    }

     setDataChannel(dataChannel){
        this.dataChannel = dataChannel
    }

    // init start
    start(){
        this.createHands ()
        this.getHTMLMPElements()
        this.hands.onResults(results => this.onResultsHands(results));
        this.createCamera()
        this.createControlPanel()
        this.camera.start()
        return this.camera
    }

    // camera create to detect hand
    createCamera() {
        this.camera= new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({image: this.video});
            },
            width: this.width,
            height: this.height,
        });
    }

    // media pipe hand object init
    createHands() {
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
            }
        });
    }


    // canvas init to show processed frame to local video
    getHTMLMPElements() {
        const iD =   {
                        "video": "videoCamera",
                        "canvas": "output",
                        "controls": "control"
                        }
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
        var data = "Error"
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
                if (!this.isToAnalysis())
                    message = this.exercise.checkConstraints().message
            }
            if (!this.isToAnalysis()) {
                this.restartAnalysis()
            }
            data = this.exerciseAnalyzer.run(this.id,[false, false, false, state],this.isRightHand,this.landmarks,this.canvas,this.canvasCtx, this.exercise.checkConstraints(), this.getDuration()+":    "+this.getCurrentTime())
            if(this.getAnalysisData())
                this.getAnalysisData().addValues(data)

        }
        else {
            this.restartAnalysis()
            if(this.getTimer()<=0)
                message = "No Hand detected"
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
        this.extractAnalysisData();

        if (toShow[0])
            this.showAngles();
        if (toShow[1])
            this.drawCirclesDefault()
        if (toShow[2])
            this.drawLinesDefault()
        if(toShow[3] && constraintState.met )
            this.drawInitAngle(parseInt(this.calculateInitAngle()))

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



    extractAnalysisData() {
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


