from pymongo import MongoClient
import time
import random

class DatabaseManager:
    def __init__(self, host="localhost", port=27017, db_name='Test', collection_name=""):
        self.host = host
        self.port = port
        self.db_name = db_name
        self.client = MongoClient('mongodb://' + self.host + ':' + str(self.port))
        self.db = self.client[self.db_name]
        self.collection_name = collection_name
        self.collection = ""

        # Names of collections in db
        self.users_collection = "users"
        self.exercises_collection = "exercises"
        self.exercises_to_patients_collection = "exercises_to_patients"
        self.videoconference_collection = "videoconferences"

    def set_collection_name(self, collection_name):
        self.collection_name = collection_name

    # create connection to dataebase
    def create_connection(self):
        pass


    # Check if username available
    def is_username_available(self, username):
        self.collection = self.db[self.collection_name]
        query = {'username': username}
        result = self.collection.count_documents(query)
        return result == 0

    # Insert new user to db
    def insert_user(self, user):
        try:
            # Create connection to db (user collection)
            self.collection = self.db[self.collection_name]

            # Check if username available
            if not self.is_username_available(user.get_username()):
                print("New user not inserted: username or userid not unique")
                return False

            # Preparing data of user to save in db
            data = {
                'username': user.get_username(),
                'firstname': user.get_firstname(),
                'lastname': user.get_lastname(),
                'password': user.get_password(),
                'usertype': user.get_usertype(),
                'exercises': user.get_exercises()
            }

            # Save data in db
            self.collection.insert_one(data)

            # Print the result in console
            print("New user with username", user.get_username(), "inserted")
            return True

        except Exception as e:
            print("New user not inserted:", str(e))
            return False

    # get all esers in db
    def get_all_users(self, patients_data):
        self.set_collection_name(self.users_collection)
        self.collection = self.db[self.collection_name]
        if patients_data:
            users_data = list(self.collection.find({"usertype": "patient"}))
        else:
            users_data = list(self.collection.find())
        return users_data

    # get user data based on query
    def get_user(self, query):
        self.collection = self.db[self.collection_name]
        user_data = self.collection.find_one(query)
        return user_data

    # get user by id
    def get_user_by_id(self, user_id):
        query = {'id': user_id}
        return self.get_user(query)

    # get user by username
    def get_user_by_username(self, username):
        query = {'username': username}
        return self.get_user(query)

    # Update user in db
    def update_user(self, user):
        try:
            # Create connection to db (user collection)
            self.collection = self.db[self.collection_name]

            # Check if user exists
            query = {'username': user.get_username()}
            existing_user = self.collection.find_one(query)
            if existing_user is None:
                print("User not found: unable to update")
                return False

            # Update user data
            updated_data = {
                'username': user.get_username(),
                'firstname': user.get_firstname(),
                'lastname': user.get_lastname(),
                'password': user.get_password(),
                'exercises': user.get_exercises()
            }

            # execute update operation
            self.collection.update_one(query, {'$set': updated_data})

            # print the result in console
            print("User with ID", user.get_id(), "updated")
            return True

        except Exception as e:
            print("User not updated:", str(e))
            return False

    # delete user
    def delete_user(self, username):
        try:
            # Create connection to db (user collection)
            self.collection = self.db[self.collection_name]

            # Check if user exists
            query = {'username': username}
            existing_user = self.collection.find_one(query)
            if existing_user is None:
                print("User not found: unable to delete")
                return False

            # Perform delete operation
            self.collection.delete_one(query)

            # Print the result in console
            print("User with username", username, "deleted")
            return True

        except Exception as e:
            print("User not deleted:", str(e))
            return False

    def is_name_videoconference_available(self, name):
        self.collection = self.db[self.collection_name]
        query = {'name': name}
        result = self.collection.count_documents(query)
        return result == 0


    def insert_videoconference(self, videoconference):
        self.set_collection_name(self.videoconference_collection)
        try:

            if not self.is_name_videoconference_available(videoconference.get_name()):
                return "nawm of videoconference is not available"

            # generate random const id for videoconference
            videoconference.set_const_id(self.generate_const_id())

            # Create connection to db (user collection)
            self.collection = self.db[self.collection_name]

            # Preparing data of user to save in db
            data = {
                'const_id': videoconference.get_const_id(),
                'name': videoconference.get_name(),
                'creator': videoconference.get_creator(),
                'description': videoconference.get_description()
            }

            # Save data in db
            self.collection.insert_one(data)

            # Print the result in console
            print("New videoconference with name ", videoconference.get_name(), " inserted")
            return "videoconference with name "+ videoconference.get_name()+ " inserted"

        except Exception as e:
            print("New videoconference not inserted:", str(e))
            return "new videoconference was not created"


    def get_videoconferences(self):
        self.set_collection_name(self.videoconference_collection)
        self.collection = self.db[self.collection_name]
        videoconferences_data = list(self.collection.find())
        return videoconferences_data


    def get_videoconferenceById(self, const_id):
        self.set_collection_name(self.videoconference_collection)
        query = {'const_id': const_id}
        self.collection = self.db[self.collection_name]
        videoconference_data = self.collection.find_one(query)
        return videoconference_data


    def generate_const_id(self):
        timestamp = str(int(time.time()))
        random_num = str(
            random.randint(0, 999))
        random_id = timestamp + random_num
        return random_id

    def get_all_exercises(self):
        self.set_collection_name(self.exercises_collection)
        self.collection = self.db[self.collection_name]
        exercises_data = list(self.collection.find())
        return exercises_data

    def get_my_exercises(self):
        self.set_collection_name(self.exercises_to_patients_collection)
        self.collection = self.db[self.collection_name]
        exercise_to_patient_data = list(self.collection.find().sort("id", 1))

        self.set_collection_name(self.exercises_collection)
        self.collection = self.db[self.collection_name]
        exercises_data = list(self.collection.find().sort("id", 1))

        for x in exercise_to_patient_data:
            for y in exercises_data:
                if x["exerciseId"] == y["id"]:
                    x["name"] = y["name"]
                    x["description"] = y["description"]
        return exercise_to_patient_data

    def insert_exercise_to_patient(self, data):
        self.set_collection_name(self.exercises_to_patients_collection)
        try:
            # Create connection to db (user collection)
            self.collection = self.db[self.collection_name]

            # Save data in db
            self.collection.insert_one(data)

            # Print the result in console
            print("New exercise to patient with ", data["username"], " inserted")
            return {"state": True, "message": "exercise inserted"}

        except Exception as e:
            print("New exercise to patient with not inserted:", str(e))
            return False


