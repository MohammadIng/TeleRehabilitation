import pandas as pd
import os

from src.database_manager.databaseManager import DatabaseManager
from src.model.videoconference import Videoconference

class User:

    def __init__(self, id="1", username="mm12", firstname="Mohammad", lastname="Matar", usertype="",
                 password="password", exercises={}):
        self.id = id;
        self.username = username
        self.firstname = firstname
        self.lastname = lastname
        self.usertype = usertype
        self.password = password
        self.exercises = exercises
        self.databaseManager = DatabaseManager(collection_name="users")

    # get id to user
    def get_id(self):
        return self.id

    # get username to user
    def get_username(self):
        return self.username

    # get firstname to user
    def get_firstname(self):
        return self.firstname

    # get lastname to user
    def get_lastname(self):
        return self.lastname

    # get usertype to user
    def get_usertype(self):
        return self.usertype

    # get password to user
    def get_password(self):
        return self.password

    # get all exercises to user
    def get_exercises(self):
        return self.exercises

    # get one exercise by id
    def get_exercise(self, exercise_Id):
        return self.exercises[exercise_Id]

    # set id to user
    def set_id(self, id):
        self.id = id

    # set username to user
    def set_username(self, username):
        self.username = username

    # set firstname to user
    def set_firstname(self, firstname):
        self.firstname = firstname

    # set lastname to user
    def set_lastname(self, lastname):
        self.lastname = lastname

    # set usertype tp user
    def set_usertype(self, usertype):
        self.usertype = usertype

    # set password to user
    def set_password(self, password):
        self.password = password

    # set exercises to user
    def set_exercise(self, exercises):
        self.exercises = exercises

    # add exercise to user
    def add_exercise(self, exercise):
        self.exercises[exercise.get_id()] = exercise

    # delete one exercise
    def delete_exercise(self, exercise_Id):
        del self.exercises[exercise_Id]

    # login
    def login(self):
        att = ["username", "firstname", "lastname", "password", "usertype", "exercises"]
        user_data = self.databaseManager.get_user_by_username(username=self.get_username())
        if not user_data:
            return None
        for k in att:
            if k not in user_data.keys():
                user_data[k] = None
        if user_data and self.get_password() == user_data['password']:
            user = User(
                        username=user_data['username'],
                        firstname=user_data['firstname'],
                        lastname=user_data['lastname'],
                        usertype=user_data['usertype'],
                        password=user_data['password'],
                        exercises=user_data['exercises'])
            return user.serialize()
        else:
            return None

    # signup
    def signup(self):
        return self.databaseManager.insert_user(self)

    # logout
    def logout(self):
        pass

    # print user atts as string
    def to_String(self):
        print("user:")
        print("userid: ", self.id)
        print("username: ", self.username)
        print("firstname :", self.firstname)
        print("lastname: ", self.lastname)
        print("password: ", self.password)
        print("usertype: ", self.usertype)

    # user data serialize to send per server
    def serialize(self):
        user_data = {"id": self.get_id(), "username": self.get_username(), "firstname": self.get_firstname(),
                     "lastname": self.get_lastname(), "password": self.get_password(), "usertype": self.get_usertype()}
        print(user_data)
        return user_data

    # insert user to db
    def insert_to_db(self):
        return self.databaseManager.insert_user(self)

    # update user in db
    def update_in_db(self):
        return self.databaseManager.update_user(self)

    # delete of db
    def delete_of_db(self):
        return self.databaseManager.delete_user(self.get_username())


    # get all videoconferences of db
    def get_videoconferences(self):
        return self.databaseManager.get_videoconferences()

    # get a videoconference by id of db
    def get_videoconferenceById(self, const_id):
        return self.databaseManager.get_videoconferenceById(const_id)

    # serialize all videoconferences data data to send per server
    def serialize_videoconferences(self, data):
        for videoconference in data:
            if videoconference and "_id" in videoconference.keys() :
                del videoconference['_id']
        return data

    # serialize a videoconference data to send per server
    def serialize_videoconference(self, const_id):
        vido_data= self.get_videoconferenceById(const_id)
        del vido_data['_id']
        return vido_data

    # create videoconference
    def create_videoconference(self, videoconference):
        return self.databaseManager.insert_videoconference(videoconference)


    # get all user data
    def get_all_users(self, patients_data):
        return self.databaseManager.get_all_users(patients_data)

    # serialize users data to send via server
    def serialize_users(self, data):
        for user in data:
            if user and "_id" in user.keys() :
                del user['_id']
                if "password" in user.keys():
                    del user['password']
        return data

    # get all exercises data
    def get_all_exercises(self):
        return self.databaseManager.get_all_exercises()

    # get my exercises to patient
    def get_my_exercises(self, user_id):
        all_exercises = self.databaseManager.get_my_exercises()
        return [exercise for exercise in all_exercises if exercise['username'] == user_id]

    # serialize exercises data to send via server
    def serialize_exercises(self, data):
        for exercise in data:
            if exercise and "_id" in exercise.keys():
                del exercise['_id']
        return data

    # specify exercise
    def specify_exercise(self, data):
        return self.databaseManager.insert_exercise_to_patient(data)

    # change language
    def change_language(self, language):
        # file_path = os.getcwd() + "\language_data.xlsx"
        file_path = os.getcwd() + "\src\handler\language_data.xlsx"
        df = pd.read_excel(file_path)
        data = {}
        for index, row in df.iterrows():
            key = row['Key']
            value = row['English' if language == 'English' else 'Deutsch']
            data[key] = value
        print(language)
        return data


