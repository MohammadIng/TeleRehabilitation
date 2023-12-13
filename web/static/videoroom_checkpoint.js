let user = User.initUser()
user.startLocalVideo()

function validate(){
    return user.getLocalVideo().isCameraAccessible();
}

function cancel(){
   user.redirectToHomePage()
}