from src.model.user import User
from src.model.videoconference import Videoconference


class Handler:

    def __init__(self):
        self.request = None
        self.loggedusers = []
        self.vidoeconferencses = []
        self.active_vidoeconferencses = []

        # web rtc
        self.users_in_room = {}
        self.room_of_sid = {}
        self.name_of_sid = {}
        self.type_of_sid = {}


    # handlig signup event
    @staticmethod
    def handle_signup(data):
        user = User(
                    username=data["username"],
                    firstname=data["firstname"],
                    lastname=data["lastname"],
                    password=data["password"],
                    usertype=data["usertype"])
        return user.signup()

    # handling login event
    @staticmethod
    def handle_login(data):
        user = User(username=data["username"],
                    password=data["password"])
        return user.login()

    # handling logout event
    def handle_logout(self, data):
        try:
            username = data["username"]
            self.loggedusers.remove(username)
            return True
        except:
            return False

    # handling get all available not active videoconferences
    def handle_get_videoconferences(self, data=None):
        user = User()
        available_videoconferences = user.get_videoconferences()
        if not len(self.active_vidoeconferencses) == 0:
            for v1 in available_videoconferences:
                for v2 in self.active_vidoeconferencses:
                    if v1["name"] == v2["name"]:
                        if(v1 in available_videoconferences):
                            available_videoconferences.remove(v1)
        return user.serialize_videoconferences(available_videoconferences)

    # handling get active videoconferences by patient
    def handle_get_active_videoconferences(self):
        user = User()
        return user.serialize_videoconferences(self.active_vidoeconferencses)


    # handling create videoconference by therapist
    @staticmethod
    def handle_create_videoconference(data):
        videoconference = Videoconference(name=data["name"],
                                          creator=data["creator"],
                                          description=data["description"])
        user = User(username=data["creator"])
        return user.create_videoconference(videoconference)


    # handling start videoconference by therapist
    def handle_start_videoconference(self,name):
        user = User()
        for v in user.get_videoconferences():
            if name == v.get("name"):
                self.active_vidoeconferencses.append(v)
                break


    # handling close videoconference by therapist
    def handle_close_videoconference(self,name):
        user = User()
        for v in self.active_vidoeconferencses:
            if name == v.get("name"):
                self.active_vidoeconferencses.remove(v)
                break

    # hanlding check state of video room
    def handle_check_Videoroom_State(self, data):
        if self.users_in_room.keys().__contains__(data["id"]):
            return {"state": False}
        return {"state": True}

    # handling get all users data
    def handle_get_all_users(self, patients_data=False):
        user = User()
        return user.serialize_users(user.get_all_users(patients_data))

    # handling get all exercises data
    def handle_get_all_exercises(self):
        user = User()
        return user.serialize_exercises(user.get_all_exercises())

    # handling get my exercises to patient
    def handle_get_my_exercises(self, data):
        user = User()
        return user.serialize_exercises(user.get_my_exercises(data["username"]))

    # handling specify exercise
    def handle_specify_exercise(self, data):
        user = User()
        return user.specify_exercise(data)

    def handle_send_data(self, data):
        self.request = data["username"]

    def handle_change_language(self, language="Deutsch"):
        user = User()
        return user.change_language(language=language)


