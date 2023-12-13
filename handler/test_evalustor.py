from evaluator import Evaluator
e = Evaluator()

l =[1,2,2,3,4,5,9,6,5]
e.display_data(data=l)

data_list = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
]

e.save_data(data=data_list)