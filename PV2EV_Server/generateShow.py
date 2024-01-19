from flask import Flask, g, request, jsonify, render_template
import os
import json
import os.path
import requests
from datetime import datetime ,timedelta

# (도착시간, 체류시간)
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

def generate(area):
    print('area : ', area)
    now = datetime.now()
    todayM = now.month
    todayD = now.day
    findDate = str(todayM) + ',' + str(todayD) # 오늘 날짜의 정보만 받아오려고 찾을 문자열 생성
    generateInfoList = []
    # pvwatts 이마트 시간별 데이터 받아옵시다.
    scriptpath = os.path.dirname(__file__)
    filename = os.path.join(scriptpath, 'pvwatts_emart_hourly.csv') #12,31,8,19 출력형태
    f = open(filename)
    line = f.readline()

    while True:
        line = f.readline()
        if not line: break
        else :
            if line.find(findDate) != -1:
                generateInfo = {} # 발전시간, 발전량 저장하기
                line = line.replace('\n',"")
                line = line.replace(' ', "")
                fields = line.split(',')
                if int(fields[0]) == todayM and int(fields[1]) == todayD:
                    generateInfo['hour'] = int(fields[2])
                    generateInfo['generate'] = (float(fields[10])/1000)*area
                    generateInfoList.append(generateInfo)
    f.close()

    hourly_generater={
        10:0,
        11:0,
        12:0,
        13:0,
        14:0,
        15:0,
        16:0,
        17:0,
        18:0,
        19:0,
        20:0,
        21:0
    }

    for i in range(10,22):
            hourly_generater[i] = generateInfoList[i]['generate']

    ################################## 시간별 전력소비량 구하기 ##################################
    # 언제 소비자들이 떠나는지 실제시간 불러오기

    class StayInfo:
        def __init__(self, arriveTime, leaveTime):
            self.arriveTime = arriveTime  # 주차장에 도착한 시간
            self.leaveTime = leaveTime  # 예상 떠날시간

    scriptpath = os.path.dirname(__file__)
    filename = os.path.join(scriptpath, 'real_leavetime.csv')  # 12,31,8,19 출력형태
    f = open(filename)
    line = f.readline()
    stayInfoList = [] # 고객들의 도착시간과 떠나는시간 클래스를 리스트로 저장
    #carList[i].leaveTime =getnumberToTime(carList[i].arriveTime,carList[i].slowChargeTime)
    while True:
        line = f.readline()
        if not line: break
        else :
            generateInfo = {} # 발전시간, 발전량 저장하기
            line = line.replace('\n',"")
            line = line.replace(' ', "")
            fields = line.split(',')
            a = StayInfo(int(fields[0]),0)
            a.leaveTime = round(getnumberToTime(a.arriveTime,int(round(float(fields[1])*60,0))),2)
            stayInfoList.append(a)
    f.close()

    power_consumtion = { # 시간별 전력소모량
        10: 0.0,
        11: 0.0,
        12: 0.0,
        13: 0.0,
        14: 0.0,
        15: 0.0,
        16: 0.0,
        17: 0.0,
        18: 0.0,
        19: 0.0,
        20: 0.0,
        21: 0.0
    }
    # 시간별 소모량 구하기
    tempTime = 1000  # 10시부터 영업시작

    while (tempTime < 2159):
        count = 0  # tempTime의 수가 전체 ev자동차 주차대수의 80%가 넘는지 확인하는 변수
        for i in range(len(stayInfoList)):  # temp시간에 있는지 없는지 알기
            if stayInfoList[i].arriveTime < tempTime and tempTime < stayInfoList[i].leaveTime:
                power_consumtion[int(tempTime/100)] = power_consumtion[int(tempTime/100)] + 0.117
                count = count + 1
        #print('count = ', count, 'power_consumtion[',int(tempTime/100),'] = ', power_consumtion[int(tempTime/100)])

        # tempTime의 4자리 숫자로 된 60분 단위의 시간을 제대로 맞춰주기 위해
        if tempTime % 100 >= 59:
            tempTime = (int(tempTime / 100)) * 100 + 100
        else:
            tempTime = tempTime + 1

    finalRasult = []
    finalRasult.append(power_consumtion)
    #print(finalRasult)
    return finalRasult