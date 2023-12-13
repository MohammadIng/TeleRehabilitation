
class Videoconference:
    def __init__(self, id="", const_id="", name="", creator="", description="", number_participants=0, participants =[]):
        self.id = id
        self.const_id = const_id
        self.name = name
        self.creator = creator
        self.description = description
        self.number_participants = number_participants
        self.participants = participants

    # get id of videoconference
    def get_id(self):
        return self.id

    # get const_id of videoconference
    def get_const_id(self):
        return self.const_id

    # get name of videoconference
    def get_name(self):
        return self.name

    #
    def get_creator(self):
        return self.creator

    def get_description(self):
        return self.description

    def get_number_participants(self):
        return self.number_participants

    def get_participants(self):
        return self.number_participants


    def set_id(self, id):
        self.id = id

    def set_const_id(self, const_id):
        self.const_id = const_id

    def set_name(self, name):
        self.name = name

    def set_creator(self, creator):
        self.creator = creator

    def set_description(self, description):
        self.description = description

    def set_number_participants(self, number_participants):
        self.number_participants = number_participants

    def get_one_participant(self, username):
        for p in self.participants:
            if p.get_username == username:
                return p
        return None

    def join(self, participant):
        self.number_participants += 1
        self.participants.append(participant)

    def leave(self, participant):
        self.number_participants -= 1
        self.participants.remove(participant)



