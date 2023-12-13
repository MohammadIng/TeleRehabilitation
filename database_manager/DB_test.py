from src.model.user import User

# db = DatabaseManager()
user = User(username="mm", id="123452")
# user.insert_to_DB()
# user.set_exercise({"1":1})
# user.updaet_in_DB()

print(user.get_videoconferences())