let user = User.initUser()

function signup(){
    user.signup()
}

function toLogin(){
    user.toLogin()
}

user.getSocket().on("eventSignup", (data) => {user.eventSignup(data);});

