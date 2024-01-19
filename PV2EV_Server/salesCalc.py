########################################### 기대수익 예측 ###########################################
from flask import Flask, g, request, jsonify, render_template
import os
import json
import os.path
import requests
from datetime import datetime ,timedelta

class CarInfo:
    def __init__(self, arriveTime,  slowChargeTime):
        self.arriveTime = arriveTime  # 주차장에 도착한 시간
        self.slowChargeTime = slowChargeTime  # 충전소요시간(80%충전기준) = 예상 체류시간
        self.stayingTime = 0 #실제 체류시간
        self.realLeveingTime = 0 # 실제 떠나는 시간
        self.leaveTime = 0 # 예상 떠날시간
        self.beforeCharger = 0 # EV충전기 설치 전 소비금액
        self.afterCharger = 0 # EV충전기 설치 후 소비금액

def restartTime(): # nowTime이 실시간으로 돌아갈 수 있도록 계속 갱신해주는 함수
    return datetime.now()

# (도착시간, 걸리는 시간) // ev자동차들이 떠날 예상시간 구하는 것
def getnumberToTime(arrive, chargingTime):
    getHour = int(chargingTime / 60)
    getMin = int(chargingTime % 60)
    arriveHour = int(arrive / 100)
    arriveMin = int(arrive % 100)
    totalHour = arriveHour + getHour
    totalMin = getMin + arriveMin
    if totalMin >= 60: # 분단위 더한게 60넘은 경우 => 시간으로 바꿔줘야함
        totalMin = totalMin - 60
        totalHour = totalHour + 1

    if totalHour*100 + totalMin >= 2200: # 마감시간 10시가 지나서 leaveTime = 2200으로 정하기
        return 2200
    else:
        return totalHour*100 + totalMin

carList = []
now = restartTime()
#print("현재시간 : " , now.hour ,"시 " , now.minute , "분")
# 시나리오 받아오기
scriptpath = os.path.dirname(__file__)
filename = os.path.join(scriptpath, 'senario1.csv')
f = open(filename)
line = f.readline()
while True:
    line = f.readline()
    if not line: break
    else :
        line = line.replace('\n',"")
        line = line.replace(' ', "")
        fields = line.split(',')
        #print(fields)
        a = CarInfo(int(fields[0]), int(round(float(fields[4])*60,0)))
        carList.append(a)
f.close()

# 실제 체류시간 데이터(분단위) 받아오기
scriptpath = os.path.dirname(__file__)
filename = os.path.join(scriptpath, 'real_leavetime.csv')
f = open(filename)
line = f.readline()
i=0
while True:
    line = f.readline()
    if not line: break
    else :
        line = line.replace('\n',"")
        line = line.replace(' ', "")
        fields = line.split(',')
        #print(fields)
        carList[i].stayingTime = int(round(float(fields[1])*60,0))
        i = i+1
f.close()

# 정렬
carList = sorted(carList, key=lambda CarInfo : CarInfo.arriveTime)

for i in range(len(carList)): # 자동차들이 떠나는 시간 계산
    carList[i].leaveTime =getnumberToTime(carList[i].arriveTime,carList[i].slowChargeTime)
    #print(carList[i].arriveTime,'         ' ,carList[i].slowChargeTime,'         ' ,carList[i].leaveTime ,'         ')
    carList[i].realLeveingTime = getnumberToTime(carList[i].arriveTime, carList[i].realLeveingTime)

def get_predict_sales():
    now = restartTime() # 시간 갱신
    tempTime = now.hour * 100+ now.minute # 임의로 루프안에서 돌릴 시간 변수 선언, 초기값 = 현재시간(숫자형태)
    currentTime = now.hour*100 + now.minute

    count = 0  # tempTime의 수가 전체 ev자동차 주차대수의 80%가 넘는지 확인하는 변수
    #print('===========================================',currentTime,'=============================================')
    #print('carList[i].arriveTime    <=    tempTime    <=    carList[i].leaveTime')
    for i in range(len(carList)): # temp시간에 있는지 없는지 알기
        if carList[i].arriveTime<=currentTime and currentTime < carList[i].leaveTime: # 현재시간보다 전에 왔고 현재시간이 예상 떠날 시간 전인 경우
            count = count + 1
            #print(carList[i].arriveTime, "<=", tempTime, "<=", carList[i].leaveTime, " isPredict = ",
             #     carList[i].isPridict)
    #print("현재 주차 대수 = ", count,'\n')

    if now.hour < 18 : # 시간이 17시 이전인 경우
        money = 50000 # 1인당 평균 예산
    else: # 시간이 18시 이후인 경우
        money = 55000
    total_income = 0 # 총 기대수익
    for i in range(len(carList)):
        if carList[i].arriveTime<=currentTime and currentTime < carList[i].leaveTime: # 현재 들어와있는 차량이라면
            if carList[i].slowChargeTime < 90 : # 충전시간이 90분 미만이면 추가소비하지 않음
                total_income = total_income + money
                #print('도착시간 : ',carList[i].arriveTime, '예상충전시간 : ', carList[i].slowChargeTime, '기대수익 : ', money)
            elif 90 >= carList[i].slowChargeTime and carList[i].slowChargeTime < 180: # 예상 충전시간이 1시간 이상 2시간 미만이라면
                total_income = total_income + money + money * 0.1 # 소비자들이 정한 예산보다 10% 더 소비
                #print('도착시간 : ', carList[i].arriveTime, '예상충전시간 : ', carList[i].slowChargeTime, '기대수익 : ', money*1.1)
            elif carList[i].slowChargeTime >= 180: # 예상 충전시간이 2시간 이상일 경우
                total_income = total_income + money + money * 0.2  # 소비자들이 정한 예산보다 20% 더 소비
                #print('도착시간 : ', carList[i].arriveTime, '예상충전시간 : ', carList[i].slowChargeTime, '기대수익 : ', money * 1.2)

    return total_income

#/*-------------------------시간별 얻는 수익-------------------------------*/
# 시간별 소비 시나리오 받아오기
scriptpath = os.path.dirname(__file__)
filename = os.path.join(scriptpath, 'sales.csv')
f = open(filename)
line = f.readline()
i=0
while True:
    line = f.readline()
    if not line: break
    else :
        line = line.replace('\n',"")
        line = line.replace(' ', "")
        fields = line.split(',')
        #print(fields)
        carList[i].beforeCharger = int(fields[1]) # 충전기 설치 전 고객단가
        carList[i].afterCharger = int(round(float(fields[2]),0))
        i = i+1
f.close()
print('==========================sales=========================')
for i in range(len(carList)):
    print("carList[",i,'] || arriveTime = ',carList[i].arriveTime, ' 충전기 설치 전 객단가 = ',carList[i].beforeCharger,
          '충전기 설치 후 고객단가',carList[i].afterCharger)

def get_serial_sales():
    not_stay_serialTime = { # 체류시간을 적용하지 않은 시간별 누적 수익 값 저장
            10 : 0,
            11 : 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
        }
    stay_serialTime = { # 체류시간을 적용한 시간별 누적 수익 값 저장
            10 : 0,
            11 : 0,
            12: 0,
            13: 0,
            14: 0,
            15: 0,
            16: 0,
            17: 0,
            18: 0,
            19: 0,
            20: 0,
            21: 0,
            22: 0,
        }

    # 나가는 시간에 따라 소비금액을 계산해 버리면 나가는 시간에 달라서 비교 정확도가 떨어짐
    # 따라서 동일한 매장 도착시간으로 기준을 정해서 보여주기로 함
    for i in range(len(carList)):
        tempHour = int((carList[i].arriveTime)/100)
        not_stay_serialTime[tempHour] = not_stay_serialTime[tempHour] + carList[i].beforeCharger
        stay_serialTime[tempHour] = stay_serialTime[tempHour] + carList[i].afterCharger


    final_result = []
    final_result.append(not_stay_serialTime)
    final_result.append(stay_serialTime)

    return final_result