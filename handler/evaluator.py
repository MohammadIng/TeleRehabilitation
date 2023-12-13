import matplotlib.pyplot as plt
import pandas as pd
import os
import datetime


class Evaluator:
    def __init__(self):
        print(os.getcwd())
        self.png_path = os.getcwd()+"\src\handler\evaluation_data\png\\"
        self.excel_path = os.getcwd()+"\src\handler\evaluation_data\excel\\"

    def receive_evaluation_data(self, data):
        print(data)
        if data["dataType"]=="handDetect":
            print("handDetect")
            self.evaluation_hand_detect(data=data["data"])
        elif data["dataType"]=="lightRoom":
            print("lightRoom")
            self.evaluation_light_room(data=data["data"])
        elif data["dataType"]=="rotationX":
            print("rotationX")
            self.evaluation_rotation_x(data=data["data"])
        elif data["dataType"]=="rotationY":
            print("rotationY")
            self.evaluation_rotation_y(data=data["data"])
        elif data["dataType"] == "handVisibility":
            print("handVisibility")
            self.evaluation_hand_visibility(data=data["data"])
        elif data["dataType"] == "handCameraDistance":
            print("handCameraDistance")
            self.evaluation_hand_camera_distance(data=data["data"])
        else:
            formated_data=self.format_data(data=data["data"])
            # self.display_data(data=formated_data)
            # self.save_data(data=data["data"])

    def get_current_time(self):
        return datetime.datetime.now().strftime("%Y_%m_%d_%H_%M_%S")


    def format_data(self, data=[]):
        formated_data = []
        for val in data:
            formated_data.append(val[len(val)-1])
        return formated_data


    def display_data(self, title ="Title",x_lable="X", y_lable="Y", file_name="test.png", data=[]):


        x_values = list(range(len(data)))

        plt.plot(x_values, data, marker='o')

        plt.xlabel(x_lable)
        plt.ylabel(y_lable)
        plt.title(title)
        plt.savefig(file_name)
        plt.show()

    def save_data(self,data=[[1,2,3,4,5]], columns=['d1', 'd2', 'd3', 'd4', 'd5'],
                  file_name="test.xlsx", startrow=0):


        df = pd.DataFrame(data, columns=columns)
        df.to_excel(file_name, index=False, header=True, startrow=startrow)



    def evaluation_hand_detect(self, data=[]):
        excel_file_name = self.excel_path + "handDetect\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "handDetect\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)


    def evaluation_hand_camera_distance(self, data=[]):
        excel_file_name = self.excel_path + "handCameraDistance\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "handCameraDistance\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)




    def evaluation_light_room(self, data=[]):
        excel_file_name = self.excel_path + "lightRoom\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "lightRoom\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)




    def evaluation_rotation_x(self, data=[]):
        excel_file_name = self.excel_path + "rotationX\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "rotationX\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)




    def evaluation_rotation_y(self, data=[]):
        excel_file_name = self.excel_path + "rotationY\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "rotationY\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)





    def evaluation_hand_visibility(self, data=[]):
        excel_file_name = self.excel_path + "handVisibility\\"+self.get_current_time()+".xlsx"
        png_file_name = self.png_path + "handVisibility\\"+self.get_current_time()
        formated_data = self.format_data(data=data)
        self.display_data(data=formated_data, file_name=png_file_name)
        self.save_data(data=data, file_name=excel_file_name)


