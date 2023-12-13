let  user = User.initUser()


function logout(){
    user.logout()
}
user.getSocket().on("eventLogout", (data) => {user.eventLogout(data);});

user.getSocket().on("eventUpdateVideoconferences", (data) => {user.eventUpdateVideoconferences(data);});
