let user = User.initUser()

function logout(){
    user.logout()
}

function createVideoconference() {
    user.createVideoconference()
}

function getAllPatientsData(){
    user.getAllPatientsData()
}

function getAllExercisesData(){
    user.getAllExercisesData()
}

getAllExercisesData()
getAllPatientsData()

user.getSocket().on("eventCreateVideoconference", (data) => {alert(data)});

user.getSocket().on("eventLogout", (data) => {user.eventLogout(data);});

user.getSocket().on("eventGetAllPatients", (data) => {user.eventGetAllPatients(data)});

user.getSocket().on("eventGetAllExercises", (data) => {user.eventGetAllExercises(data)});

user.getSocket().on("eventSpecifyExercise", (data) => {user.eventSpecifyExercise(data)});
