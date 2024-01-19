from flask import Flask, g, request, jsonify, render_template
from py2neo import Graph, Node, Relationship
from flask_cors import CORS
import os
import os.path

import requests
import json
import pandas as pd

from datetime import datetime
from pyproj import Proj, transform

import pecktime
import salesCalc
import generateShow

API_KEY = "MKhOJFCcCXA2VYK5BiaJceZ18wCDtOHjzufAuNTT"

url = os.getenv("NEO4J_URI", "bolt://localhost:7687")
username = os.getenv("NEO4J_USER", "neo4j")
#데이터베이스 패스워드 입력
password = os.getenv("NEO4J_PASSWORD", "pv2ev")
neo4jVersion = os.getenv("NEO4J_VERSION", "4")
database = os.getenv("NEO4J_DATABASE", "edacom")

gdb = Graph(url, auth=("neo4j", password))

LAT = 0
LON = 0
MART_NAME = ''
AREA = 0
AZIMUTH = 0
TILT = 0

# pvwatts 이마트 시간별 데이터 받아옵시다.
df = pd.read_csv('pvwatts_emart_hourly.csv')
data_ac = df[['Month', 'Day', 'Hour', 'AC System Output (W)']]

#Nrel에서 데이터 사용 - 월별 평균
def calNreldata_monthly(system_capacity = 4, azimuth=180, tilt=20):
    result = {}
    print("asdasd:  " + LAT)
    print(LON)
    params = {'api_key': API_KEY,
              # 'address': , The address to use. Required if lat/lon or file_id not specified.
              # climate dataset: NREL Physical Solar Model (PSM) TMY from the NREL National Solar Radiation Database (NSRDB)
              'lat': LAT,
              'lon': LON,
              'dataset': 'intl',
              'system_capacity': system_capacity * 0.15,  # Nameplate capacity (kW). 지정된 위치의 태양관 판의 크기라고 이야기할 수 있음
              'azimuth': azimuth,
              'tilt': tilt,  # 각도
              'array_type': 1,
              # 0: Fixed - Open rack, 1: Fixed - Roof Mounted 2: 1-Axis, 3: 1-Axis Backtracking 4: 2-Axis
              'module_type': 1,  # Module type. 0: Standard, 1: Premium, 2: Thin film
              'losses': 10,  # System losses (percent).
              }

    URL_PVWATTS6 = f"https://developer.nrel.gov/api/pvwatts/v6.json?"

    response = requests.get(URL_PVWATTS6, params=params)
    json_obj = response.json()

    df_pv = pd.DataFrame(json_obj['outputs']['ac_monthly'])
    df_pv.columns = ['pv']

    list_df_pv = list(df_pv['pv'])

    for i in range(len(list_df_pv)):
        result[i] = round(list_df_pv[i],2)

    put_graph1(json_obj, MART_NAME, 'Seoul')

    return result

#Nrel에서 데이터 사용 - 시간별
def calNreldata_hourly(system_capacity = 4, azimuth=180, tilt=20, mode = 'default'):
    result = {}
    print("asdasd:  "+LAT)
    print(LON)
    params = {'api_key': API_KEY,
              # 'address': , The address to use. Required if lat/lon or file_id not specified.
              # climate dataset: NREL Physical Solar Model (PSM) TMY from the NREL National Solar Radiation Database (NSRDB)
              'lat': LAT,
              'lon': LON,
              'dataset': 'intl',
              'system_capacity': system_capacity * 0.15,  # Nameplate capacity (kW). 지정된 위치의 태양관 판의 크기라고 이야기할 수 있음
              'azimuth': azimuth,
              'tilt': tilt,  # 각도
              'array_type': 1,
              # 0: Fixed - Open rack, 1: Fixed - Roof Mounted 2: 1-Axis, 3: 1-Axis Backtracking 4: 2-Axis
              'module_type': 1,  # Module type. 0: Standard, 1: Premium, 2: Thin film
              'losses': 10,  # System losses (percent).
              'timeframe': 'hourly'
              }

    URL_PVWATTS6 = f"https://developer.nrel.gov/api/pvwatts/v6.json?"

    response = requests.get(URL_PVWATTS6, params=params)
    json_obj = response.json()

    df_pv = pd.DataFrame(json_obj['outputs']['ac'])
    df_pv.columns = ['pv']
    ts_days_idx = pd.date_range('2021-01-01', periods=8760, freq='H')

    df_time = pd.DataFrame(ts_days_idx)
    df_time.columns = ['time']
    df_time_pv = pd.concat([df_time, df_pv], axis=1)
    df_time_pv['date'] = df_time_pv['time'].dt.strftime("%Y-%m-%d")
    today_time = datetime.today()
    today_date = str(today_time.date())
    print(today_date)

    today_pv = df_time_pv.query('date == @today_date')
    if mode == 'default':
        list_data = list(today_pv['pv'])
        print(list_data)
        for i in range(len(list_data)):
            result[i] = round(list_data[i]/1000,2)
    elif mode == 'cost':
        sum_pv = today_pv['pv'].sum()
        result[0] = round(sum_pv / 1000, 0)
    print(result)

    return result

#마트데이터 전처리
def get_martData():
    df = pd.read_csv('mart.csv', encoding='euc-kr')
    df = df.loc[df['상세영업상태명'].str.startswith("정상영업", na=False)]
    df = df.dropna(subset=['좌표정보(X)', '좌표정보(Y)'])
    df = df.rename(columns={"좌표정보(X)": "x", "좌표정보(Y)": 'y'})

    # Projection 정의
    # 중부원점(Bessel): 서울 등 중부지역 EPSG:2097
    proj_1 = Proj(init='epsg:2097')

    # WGS84 경위도: GPS가 사용하는 좌표계 EPSG:4326
    proj_2 = Proj(init='epsg:4326')

    DataFrame = df.copy()

    x_list = []
    y_list = []

    for idx, row in DataFrame.iterrows():
        x, y = row['x'], row['y']
        x_, y_ = transform(proj_1, proj_2, x, y)
        x_list.append(x_)
        y_list.append(y_)

    print(x_list)
    print(y_list)
    df['lon'] = x_list
    df['lat'] = y_list

    return df

#데이터 베이스 설정
def get_db():
    if not hasattr(g, 'neo4j_db'):
        if neo4jVersion.startswith("4"):
            g.neo4j_db = gdb
        else:
            g.neo4j_db = gdb
    return g.neo4j_db

#데이터 베이스 연결 하는 코드
def put_graph1(json_obj, mart, city):
    conn = get_db()

    ## 트랙젝션 생성(한번에 저장했다가 삽입)
    tx = conn.begin()

    # 노드에 대한 변수 정의
    STATION = "Station"
    PVSYSTEM = "PVSystem"
    ENERGY_ESTIMATE = "EnergyEstimate"
    CITY = "City"
    MART = "Mart"

    # 관계에 대한 정의
    HAS_SYSTEM = Relationship.type("HAS_SYSTEM")
    HAS_ENERGY_ESTIMATE = Relationship.type("HAS_ENERGY_ESTIMATE")
    HAS_MART = Relationship.type("HAS_MART")
    HAS_STATION = Relationship.type("HAS_STATION")

    # 스테이션에 대한 정보 생성
    json_st = json_obj['inputs']
    n_city = Node(CITY, name=city)
    tx.merge(n_city, CITY, "name")
    n_mart = Node(MART, name=mart)
    tx.merge(n_mart, MART, "name")
    tx.merge(HAS_MART(n_city, n_mart), MART, "name")

    n_station = Node(STATION, name=f"{city}-{mart} station", lat=json_st['lat'], lon=json_st['lon'])
    tx.merge(HAS_STATION(n_mart, n_station), STATION, "name")
    n_pvsystem = Node(PVSYSTEM, name=f"{mart} PV system", array_type=json_st['array_type'], azimuth=json_st['azimuth'],
                      losses=json_st['losses'], module_type=json_st['module_type'],
                      system_capacity=json_st['system_capacity'], tilt=json_st['tilt'])
    # 트랙젝션에 노드 와 관련된 관계를 추가
    tx.merge(n_station, STATION, "name")
    tx.merge(n_pvsystem, PVSYSTEM, "name")
    tx.merge(HAS_SYSTEM(n_station, n_pvsystem), STATION, "name")

    # 통계치에 대한 정보 생성
    try:
        json_est = json_obj['outputs']
        n_energy_estimate = Node(ENERGY_ESTIMATE, name=f"{city}{mart} estimates", ac_annual=json_est['ac_annual'],
                                 ac_monthly=json_est['ac_monthly'], capacity_factor=json_est['capacity_factor'],
                                 dc_monthly=json_est['dc_monthly'], poa_monthly=json_est['poa_monthly'],
                                 solrad_annual=json_est['solrad_annual'], solrad_monthly=json_est['solrad_annual'])
        tx.create(HAS_ENERGY_ESTIMATE(n_station, n_energy_estimate))
    except:
        pass

    # 트렉젝션을 그래프 데이터베이스에 반영
    tx.commit()
    print(f"{mart} in {city} is added")


## solve the Cross-Origin Resource Sharing(CORS)
app = Flask(__name__)
cors = CORS()
CORS(app, resources={r'/*': {'origins': '*'}})


############################################################################################################

#P&S 발전량 대시보드 부분(대시보드 1)
@app.route('/map',methods=['POST'])
def get_pvwattsInMap():
    global LAT
    global LON
    global MART_NAME
    if request.method == 'POST':
        content = request.json
        print(content)
        LAT = content['lat']
        LON = content['lon']
        MART_NAME = content['name']
        print(MART_NAME)
        return '성공'
    else:
        return "fail"

@app.route('/param',methods=['POST'])
def get_pvWattParam_hourly():
    global AREA
    global AZIMUTH
    global TILT
    if request.method == 'POST':
        content = request.json
        print(content)
        AREA = float(content['area'])
        AZIMUTH = int(content['azimuth'])
        TILT = int(content['tilt'])
        result = calNreldata_hourly(AREA, AZIMUTH, TILT)
        return result
    else:
        return 'fail'

@app.route('/param/month',methods=['POST'])
def get_pvWattParam_month():
    if request.method == 'POST':
        content = request.json
        print(content)
        result = calNreldata_monthly(float(content['area']), int(content['azimuth']), int(content['tilt']))
        return result
    else:
        return 'fail'

#P&S 피크시간 대시보드 부분(대시보드 2)
@app.route('/parkedcount', methods=['POST'])
def parkedcount():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print('content = ',content)
        result = pecktime.availableParkCarCount(100) # 현재 주차되어있는 자동차 리스트 반환
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/table', methods=['POST'])
def connection():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print(content['totalEVParked'])
        over80 = int(0.8 * int(content['totalEVParked']))
        result = pecktime.getParkedList() # 현재 주차되어있는 자동차 리스트 반환
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/widget', methods=['POST']) # 쇼핑피크시간 계산
def connectionWidget():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print(content['totalEVParked'])
        over80 = int(content['totalEVParked'])
        print("서버 over80 = " , over80)
        result = pecktime.getPeckTime()
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/lineAnnotation', methods=['POST']) # 시간별 주차되었던 ev자동차 수 받아오기
def connectionSpline():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print(content['totalEVParked'])
        result = pecktime.getAccumulateCarCount()
        result = json.dumps(result)
        return result
    else:
        return "fail"

#P&S 기대수익 대시보드 부분(대시보드 3)
@app.route('/serialsales', methods=['POST']) # 시간별 주차되었던 ev자동차 수 받아오기
def serialsales():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print('serial = ', content)
        result = salesCalc.get_serial_sales()
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/predictsales', methods=['POST']) # 시간별 주차되었던 ev자동차 수 받아오기
def predictsales():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        print('predictsales = ', content)
        result = salesCalc.get_predict_sales()
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/generategraph', methods=['POST']) # 쇼핑피크시간 계산
def generateGraph():
    if request.method == 'POST': # 리테일러들의 매장 ev자동차 대수 입력받아오기
        content = request.json
        pvArea = int(content['pvArea'])
        print("pvArea = " , pvArea)
        res1 = {}
        res2 = calNreldata_hourly(AREA, AZIMUTH, TILT)
        result = generateShow.generate(pvArea)
        for i in range(10,22):
            res1[i] = res2[i]
        result.append(res1)
        result = json.dumps(result)
        return result
    else:
        return "fail"

@app.route('/saveCost',methods=['POST'])
def saveCost():
    if request.method == 'POST':
        content = request.json
        a = generateShow.generate(0)[0]
        b = 0
        print(a)
        result = {}
        for i in range(len(a)):
            b += a[i+10]
        c = calNreldata_hourly(AREA, AZIMUTH, TILT, 'cost')
        result[0] = round(c[0] / b, 2) * 100
        return result
    else:

        return 'fail'

#저장해둔 서울 대형마트 위치정보를 Neo4j(데이터베이스)에 저장 하는 부분
@app.route("/api/pvwatts",methods=['POST'])
def get_pvwatts():
    if request.method == 'POST':
        df = get_martData()

        URL_PVWATTS6 = f"https://developer.nrel.gov/api/pvwatts/v6.json?"
        for index, row in df.iterrows():
            params = {'api_key': API_KEY,
                      # 'address': , The address to use. Required if lat/lon or file_id not specified.
                      # climate dataset: NREL Physical Solar Model (PSM) TMY from the NREL National Solar Radiation Database (NSRDB)
                      # 'address': 'KWANGJU, REPUBLIC OF KOREA',
                      'lat': row['lat'],
                      'lon': row['lon'],
                      'dataset': 'intl',
                      'system_capacity': 4,  # Nameplate capacity (kW). 지정된 위치의 태양관 판의 크기라고 이야기할 수 있음
                      'azimuth': 180,
                      'tilt': 40,
                      'array_type': 1,
                      # 0: Fixed - Open rack, 1: Fixed - Roof Mounted 2: 1-Axis, 3: 1-Axis Backtracking 4: 2-Axis
                      'module_type': 1,  # Module type. 0: Standard, 1: Premium, 2: Thin film
                      'losses': 10  # System losses (percent).
                      }

            response = requests.get(URL_PVWATTS6, params=params)
            json_obj = response.json()

            # print(json.dumps(json_obj, indent=4, sort_keys=True))
            # 데이터베이스에 저장하면 될듯
            put_graph1(json_obj, row['사업장명'], "Seoul")

        return '성공'
    else:
        return 'fail'

if __name__ == '__main__':
    app.run()
