let user = User.initUser()

function login(){
    user.login()
}

function toSignup(){
    user.toSignup()
}

user.getSocket().on("eventLogin", (data) => {user.eventLogin(data);});

