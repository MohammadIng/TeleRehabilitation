from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, join_room
import json

from src.handler.handlers import Handler
from src.handler.evaluator import Evaluator

# init flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = "telereha"

# init socket_io
socket_io = SocketIO(app)

# init handler for event
handler = Handler()

# init evaluation hnadler
evaluator = Evaluator()


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data1 = request.cookies.get("currentusername")
        data2 = handler.request
        if not data1 in handler.loggedusers and not data2 in handler.loggedusers:
            handler.request = None
            return redirect(url_for('login'))
        handler.request = None
        return f(*args, **kwargs)

    return decorated_function


@socket_io.on("evalutionData")
def receive_evaluation_data(data):
    evaluator.receive_evaluation_data(data)


# event signup
@socket_io.on("signup")
def handle_signup_event(data):
    emit("eventSignup", handler.handle_signup(data))


# event login
@socket_io.on("login")
def handle_login_event(data):
    user_data = handler.handle_login(data)
    if user_data and user_data["username"] not in handler.loggedusers:
        handler.loggedusers.append(user_data["username"])
    emit("eventLogin", user_data)


# event logout
@socket_io.on("logout")
def handle_logout_event(data):
    emit("eventLogout", handler.handle_logout(data))


# creaete new videoconference
@socket_io.on("createVideoconference")
def handle_create_videoconference_event(data):
    emit("eventCreateVideoconference", handler.handle_create_videoconference(data))


# get all users data
@socket_io.on("getAllUsers")
def handle_get_all_users(data):
    emit("eventGetAllUsers", handler.handle_get_all_users())


# get all patients data
@socket_io.on("getAllPatients")
def handle_get_all_patients(data):
    emit("eventGetAllPatients", handler.handle_get_all_users(patients_data=True))


# get all exercises data
@socket_io.on("getAllExercises")
def handle_get_all_exercises(data):
    emit("eventGetAllExercises", handler.handle_get_all_exercises())


# get my exercise sto patient
@socket_io.on("getMyExercises")
def handle_get_my_exercises(data):
    emit("eventGetMyExercises", handler.handle_get_my_exercises(data))


# specify exercise to patient
@socket_io.on("specifyExercise")
def handle_spicify_exercise(data):
    emit("eventSpecifyExercise", handler.handle_specify_exercise(data))


# change language
@socket_io.on("changeLanguage")
def handle_spicify_exercise(data):
    emit("eventChangeLanguage", handler.handle_change_language(language=data["language"]))


@app.route('/evaluation')
def evaluation():
    return render_template('evaluation.html')


# render index page
@app.route('/')
def login():
    return render_template('login.html')


# render signup page
@app.route('/signup')
def signup():
    return render_template('signup.html')


# render home-therapist page
@app.route("/home_therapist", methods=["GET", "POST"])
@login_required
def index_therapist():
    if request.method == "POST":
        room_id = request.form['room_id']
        return redirect(url_for("entry_checkpoint_therapist", room_id=room_id))

    return render_template("home_therapist.html", rooms=handler.handle_get_videoconferences())


# render chatroom_therapist page
@app.route("/home_therapist/<string:room_id>/")
@login_required
def enter_room_therapist(room_id):
    handler.handle_start_videoconference(room_id)
    if room_id not in session:
        return redirect(url_for("entry_checkpoint_therapist", room_id=room_id))
    return render_template("videoroom_therapist.html", room_id=room_id, user_name=session[room_id]["user_name"],
                           mute_audio=session[room_id]["mute_audio"],
                           mute_video=session[room_id]["mute_video"], user_type="therapist")


# render checkpoint_therapist page
@app.route("/home_therapist/<string:room_id>/checkpoint/", methods=["GET", "POST"])
# @login_required
def entry_checkpoint_therapist(room_id):
    if request.method == "POST":
        user_name = request.form['user_name']
        mute_audio = request.form['mute_audio']
        mute_video = request.form['mute_video']
        session[room_id] = {"user_name": user_name, "mute_audio": mute_audio, "mute_video": mute_video,
                            "user_type": "therapist"}
        return redirect(url_for("enter_room_therapist", room_id=room_id))
    return render_template("videoroom_checkpoint.html", room_id=room_id, user_type="therapist")


# render home_patient page
@app.route("/home_patient", methods=["GET", "POST"])
@login_required
def index_pateint():
    if request.method == "POST":
        room_id = request.form['room_id']
        return redirect(url_for("entry_checkpoint_patient", room_id=room_id))

    return render_template("home_patient.html", rooms=handler.handle_get_active_videoconferences())


# render chatroom_patient page
@app.route("/home_patient/<string:room_id>/")
@login_required
def enter_room_patient(room_id):
    if room_id not in session:
        return redirect(url_for("entry_checkpoint_patient", room_id=room_id))
    return render_template("videoroom_patient.html", room_id=room_id, user_name=session[room_id]["user_name"],
                           mute_audio=session[room_id]["mute_audio"],
                           mute_video=session[room_id]["mute_video"], user_type="patient")


# render checkpoint_patient page
@app.route("/home_patient/<string:room_id>/checkpoint/", methods=["GET", "POST"])
@login_required
def entry_checkpoint_patient(room_id):
    if request.method == "POST":
        user_name = request.form['user_name']
        mute_audio = request.form['mute_audio']
        mute_video = request.form['mute_video']
        session[room_id] = {"user_name": user_name, "mute_audio": mute_audio, "mute_video": mute_video,
                            "user_type": "patient"}
        return redirect(url_for("enter_room_patient", room_id=room_id))

    return render_template("videoroom_checkpoint.html", room_id=room_id, user_type="pateint")


@socket_io.on("connect")
def handle_connect_event():
    sid = request.sid
    print("New socket connected ", sid)


@socket_io.on("join-room")
def handle_join_room_event(data):
    sid = request.sid
    room_id = data["room_id"]
    user_name = session[room_id]["user_name"]
    user_type = session[room_id]["user_type"]

    # register sid to the room
    if room_id not in handler.users_in_room:
        join_room(room_id)
    handler.room_of_sid[sid] = room_id
    handler.name_of_sid[sid] = user_name
    handler.type_of_sid[sid] = user_type

    # broadcast to others in the room
    print("[{}] New member joined: {}<{}>".format(room_id, user_name, sid))
    emit("user-connect", {"sid": sid, "user_name": user_name}, broadcast=True, include_self=False, room=room_id)

    # add to user list maintained on server
    if room_id not in handler.users_in_room:
        handler.users_in_room[room_id] = [sid]
        emit("user-list", {"my_id": sid})  # send own id only
        emit("eventUpdateVideoconferences", json.dumps(handler.handle_get_active_videoconferences()), broadcast=True)
    else:
        usrlist = {handler.users_in_room[room_id][0]: handler.name_of_sid[handler.users_in_room[room_id][0]]}

        emit("user-list", {"list": usrlist, "my_id": sid}, room=sid)  # send list of existing users to the new member
    print("\nusers: ", handler.users_in_room, "\n")


@socket_io.on("leaveRoom")
def handle_leave_room():
    sid = request.sid
    room_id = handler.room_of_sid[sid]
    emit("user-disconnect", {"sid": sid}, broadcast=True, include_self=False, room=room_id)


@socket_io.on("disconnect")
def handle_disconnect_event():
    try:
        sid = request.sid
        room_id = handler.room_of_sid[sid]
        user_name = handler.name_of_sid[sid]
        user_type = handler.type_of_sid[sid]

        print("[{}] Member left: {}<{}>".format(room_id, user_name, sid))
        emit("user-disconnect", {"sid": sid}, broadcast=True, include_self=False, room=room_id)

        handler.users_in_room[room_id].remove(sid)

        if len(handler.users_in_room[room_id]) == 0 or user_type == "therapist":
            handler.users_in_room.pop(room_id)
            handler.handle_close_videoconference(room_id)
            emit("eventUpdateVideoconferences", json.dumps(handler.handle_get_active_videoconferences()),
                 broadcast=True)

        handler.room_of_sid.pop(sid)
        handler.name_of_sid.pop(sid)
        handler.type_of_sid.pop(sid)

        session.pop(room_id, None)

        print("\nusers: ", handler.users_in_room, "\n")
    except:
        pass


@socket_io.on("data")
def handle_data_event(data):
    sender_sid = data['sender_id']
    target_sid = data['target_id']
    if sender_sid != request.sid:
        print("[Not supposed to happen!] request.sid and sender_id don't match!!!")

    if data["type"] != "new-ice-candidate":
        print('{} message from {} to {}'.format(data["type"], sender_sid, target_sid))
    socket_io.emit('data', data, room=target_sid)


@socket_io.on("sendData")
def handle_send_data(data):
    handler.handle_send_data(data)


# flask app run (run Server)
if __name__ == '__main__':
    app.run(debug=True)
