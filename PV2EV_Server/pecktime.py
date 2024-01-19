##############################################쇼핑피크시간 구현########################################################
## solve the Cross-Origin Resource Sharing(CORS)
from datetime import datetime
import os
import json
import os.path

# return 3개를 해야한다.
# 1. 쇼핑피크시간
# 2. 시간에 따른 자동차 count수
# 3. 현재 주차되어있는 자동차 list

def restartTime(): # nowTime이 실시간으로 돌아갈 수 있도록 계속 갱신해주는 함수
    return datetime.now()

class CarInfo:
    def __init__(self, arriveTime, capacity, currentCapacity, remainderCapa, slowChargeTime, species):
        self.arriveTime = arriveTime  # 주차장에 도착한 시간
        self.capacity = capacity  # 배터리 용량
        self.currentCapacity = currentCapacity  # 현재 배터리 잔량
        self.remainderCapa = remainderCapa  # 80% 충전까지 남은 충전용량
        self.remainderTime = arriveTime  # 남은충전시간
        self.slowChargeTime = slowChargeTime  # 충전소요시간(80%충전기준)
        self.species = species  # 차종
        self.leaveTime = 0 # 예상 떠날시간

parkedCarCount = {
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

# 예상 시간이 지났으면 예상한 자동차 삭제 // 1분마다 실행
def removeList (carList): # 삭제된 예정 ev는 나타나지 않음 애초에 짚어넣지 않았으니깐
    for i in range(len(carList)):
        if int(carList[i].leaveTime) <= now.hour*100 + now.minute:
            print("carList[i].arriveTime = ", carList[i].arriveTime, " 삭제")
            del carList[i]
            break
    return carList

# (도착시간, 걸리는 시간)
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

def calcCount(carList): # 누적 주차대수 구하기
    now = restartTime()
    print("calcCount현재시간 = ", now.hour*100+ now.minute)
    for i in range(10,22):
        parkedCarCount[i] = 0
    for i in range(len(carList)):
        if carList[i].arriveTime <= now.hour*100 +  now.minute:
            tempHour = int(carList[i].arriveTime/100)
            parkedCarCount[tempHour] = parkedCarCount[tempHour] + 1
    return parkedCarCount

carList = []
now = restartTime()
print("현재시간 : " , now.hour ,"시 " , now.minute , "분")
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
        a = CarInfo(int(fields[0]), float(fields[1]), fields[2], fields[3], int(round(float(fields[4])*60,0)), fields[5])
        carList.append(a)
f.close()

# 정렬
carList = sorted(carList, key=lambda CarInfo : CarInfo.arriveTime)
#print("=============== 다 추가 후 정렬 ===============")
#print('len = ' , len(carList))

#print('arriveTime   slowChargeTime   leaveTime     ispredict')
for i in range(len(carList)): # 자동차들이 떠나는 시간 계산
    carList[i].leaveTime =getnumberToTime(carList[i].arriveTime,carList[i].slowChargeTime)
    #print(carList[i].arriveTime,'         ' ,carList[i].slowChargeTime,'         ' ,carList[i].leaveTime)


#print("============================== 삭제 후 ===================================")
def deleteList(carList):
    for i in range(len(carList)):
        if len(carList) == 0:
            break
        carList = removeList(carList)
    return carList
#print(len(carList))

# 1시간, 2시간, 주차 시간에 따라 몇대가 주차하고있는지 표시
def availableParkCarCount(acceptable): # 수용가능한 자동차 수 받아오기
    acceptable = int(acceptable)
    now = restartTime()  # 시간 갱신
    currentTime = now.hour * 100 + now.minute # 현재시간

    remainderTime = {
        '0' : 0, # 남은 주차시간이 60분 미만일때
        '60' : 0, # 남은 주차시간이 60분 이상 120분 미만일 때
        '120' : 0,
        '180' : 0,
        'empty' : 0,
        'parked' : 0
    }
    # 남은 충전시간 계산(분단위)
    for i in range(len(carList)):
        if now.minute > carList[i].leaveTime % 100:
            tempHour = int(carList[i].leaveTime / 100) - now.hour - 1
            tempMin = 60 - (now.minute - (carList[i].leaveTime % 100))
            carList[i].remainderTime = tempHour * 100 + tempMin
        else:
            carList[i].remainderTime = carList[i].leaveTime - (now.hour * 100 + now.minute)

    count = 0 # 현대 몇대의 EV가 주차되었는지 나타내는 변수

    for i in range(len(carList)): # temp시간에 있는지 없는지 알기
        if carList[i].arriveTime <= currentTime and currentTime < carList[i].leaveTime:
            count = count + 1
            #print(carList[i].arriveTime, "<=", tempTime, "<=", carList[i].leaveTime)
            # 남은 주차 시간에 따라 count
            if carList[i].remainderTime >= 180:
                remainderTime['180'] = remainderTime['180'] + 1
            elif carList[i].remainderTime >= 120:
                remainderTime['120'] = remainderTime['120'] + 1
            elif carList[i].remainderTime >= 60:
                remainderTime['60'] = remainderTime['60'] + 1
            elif carList[i].remainderTime < 60:
                remainderTime['0'] = remainderTime['0'] + 1
    # print("현재 주차 대수 = ", count,'\n')
    remainderTime['parked'] = count
    remainderTime['empty'] = acceptable - count
    result = []
    makDict = {}
    makDict['topic'] = '점유중인 EV수'
    makDict['num'] = remainderTime['parked']
    result.append(makDict)
    makDict = {}
    makDict['topic'] = '이용가능한 EV수'
    makDict['num'] = remainderTime['empty']
    result.append(makDict)
    makDict = {}
    makDict['topic'] = '1시간 미만'
    makDict['num'] = remainderTime['0']
    result.append(makDict)
    makDict = {}
    makDict['topic'] = '1시간 이상'
    makDict['num'] = remainderTime['60']
    result.append(makDict)
    makDict = {}
    makDict['topic'] = '2시간 이상'
    makDict['num'] = remainderTime['120']
    result.append(makDict)
    return result

def getPeckTime():
    # 피크타임 구하기
    # 변수선언
    finalResult = [] # 마지막에 결과적으로 리스트에 Dict를 싸서 반환하기
    result = {
        'startTime' : 0, # 피크시간 시작 시간
        'endTime' : 0, # 피크시간 끝 시간
        'duration' : 0, # 피크 지속시간
    }
    now = restartTime() # 시간 갱신
    tempTime = now.hour * 100 + now.minute # 임의로 루프안에서 돌릴 시간 변수 선언, 초기값 = 현재시간(숫자형태)
    currentTime = now.hour*100 + now.minute

    max = -1 # 가장 많은 쇼핑피크시간대를 구함
    print("================================= 쇼핑피크시간 계산 15분마다 실행 현재 시간 = ",tempTime, "=================================")
    while tempTime <= now.hour*100 + now.minute + 100: #1시간을 구간으로 잡기
        count = 0 # tempTime시간대에 주차되어있는 EV수 저장 변수
        for i in range(len(carList)):
            # tempTime에 주차되어있는 수 계산
            if carList[i].arriveTime <= tempTime and tempTime <= carList[i].leaveTime\
                    and carList[i].arriveTime <= currentTime and currentTime <= carList[i].leaveTime:
                count = count + 1

        #tempTime에 주차되어있는 EV의 수가 더 많다면 가장 많이 주차되어있는 시간으로 계산
        if count > max:
            max = count
            result['startTime'] == 0 #쇼핑피크시간이 설정되지 않았다면
            result['startTime'] = tempTime
            result['duration'] = 0
            result['endTime'] = 0

        if max == count and result['endTime'] == 0:
            result['duration'] = result['duration'] + 1

        if max > count and result['endTime'] == 0:
            result['endTime'] = tempTime

        tempTime = tempTime + 1
        # 분이 60분이 넘어갈 경우 시간 데이터로 정리
        if tempTime % 100 == 60 :
            tempTime = getnumberToTime(tempTime,0)



    finalResult.append(result)
    return finalResult

def getAccumulateCarCount(): # 시간별 주차되었던 ev자동차 수
    now = restartTime() # 시간갱신
    parkedCarCount = calcCount(carList)
    #print(parkedCarCount)
    return parkedCarCount

def getParkedList(): # 현재 주차되어있는 자동차 리스트 반환
    now = restartTime() # 시간갱신
    deliverCarInto = []
    for i in range(len(carList)):
        if now.minute > carList[i].leaveTime % 100:
            tempHour = int(carList[i].leaveTime/100) - now.hour - 1
            tempMin = 60 - (now.minute - (carList[i].leaveTime % 100))
            carList[i].remainderTime = tempHour*100 + tempMin
        else:
            carList[i].remainderTime = carList[i].leaveTime - (now.hour * 100 + now.minute)

    for i in range(len(carList)):
        if carList[i].arriveTime <= now.hour * 100+ now.minute < carList[i].leaveTime:  # 현재 주차장에 존재하고 예상 자동차가 아닌경우
            makeDict = {}
            makeDict['arriveTime'] = carList[i].arriveTime  # 주차장에 도착한 시간
            makeDict['capacity'] = carList[i].capacity  # 배터리 용량
            makeDict['currentCapacity'] = carList[i].currentCapacity  # 현재 배터리 잔량
            makeDict['remainderCapa'] = carList[i].remainderCapa  # 80% 충전까지 남은 충전용량
            makeDict['remainderTime'] = carList[i].remainderTime  # 남은충전시간
            makeDict['slowChargeTime'] = carList[i].slowChargeTime  # 충전소요시간(80%충전기준)
            makeDict['species'] = carList[i].species  # 차종
            makeDict['leaveTime'] = carList[i].leaveTime  # 예상 떠날시간
            deliverCarInto.append(makeDict)

    #print(makeDict)
    return deliverCarInto
