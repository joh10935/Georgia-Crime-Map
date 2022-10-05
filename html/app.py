import numpy as np
import datetime as dt
# Import Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
# Import Flask
from flask import Flask, jsonify
from sqlalchemy import text
import pandas as pd
from flask_cors import CORS, cross_origin
import collections
import json
import psycopg2

# Set up engine
# engine = create_engine(f'postgresql://postgres:Techbobcats=0618@localhost/GACRIME')
# Base = automap_base()
# Base.prepare(engine, reflect=True)
# conn = engine.connect()

conn_string = "host='localhost' dbname='GACRIME' user='postgres' password='Techbobcats=0618'"
conn = psycopg2.connect(conn_string)
cursor = conn.cursor()

# Create Flask
app = Flask(__name__)
CORS(app)



# Different API routes:
@app.route("/")
def welcome():
    """Homepage."""
    """List all available routes."""
    return (
        f"Available Routes:<br/>"
        f"Crime Agency Data: /api/agency<br/>"
        f"Median Income by County Data: /api/income<br/>"
        f"Crime Data: /api/crime<br/>"
    )


@app.route('/api/agency')
def agency():
    # session = Session(engine)
    x=[]
    results = cursor.execute('SELECT public."Agency".agency_name, CAST(sum(public."Offense".cleared) as bigint), CAST(sum(public."Offense".actual) as bigint) FROM public."Agency" Left Join public."Offense" on public."Offense".ori = public."Agency".ori group by public."Agency".agency_name;')
    rows = cursor.fetchall()
    # results = pd.read_sql('SELECT * FROM public."Agency"', conn)
    for row in rows:
        d = collections.OrderedDict()
        d['agency_name'] = row[0]
        d['cleared'] = row[1]
        d['actual'] = row[2]

        x.append(d)
    return jsonify(x)

@app.route('/api/agencyLocation')
def agencyLocation():
    x=[]
    results = cursor.execute('SELECT public."Agency".agency_name, public."Agency".Longitude, public."Agency".Latitude FROM public."Agency" where public."Agency".Latitude IS NOT NULL')
    rows = cursor.fetchall()
    # results = pd.read_sql('SELECT * FROM public."Agency"', conn)
    for row in rows:
        d = collections.OrderedDict()
        d['agency_name'] = row[0]
        d['Longitude'] = row[1]
        d['Latitude'] = row[2]

        x.append(d)
    return jsonify(x)


@app.route('/api/Income')
def Income():
    x=[]
    results = cursor.execute('SELECT public."Income".countyid, public."Income".percapita_income, public."Income".data_year, public."County".county_name FROM public."Income" Left join public."County" on public."Income".countyid = public."County".countyid where public."Income".data_year = 2020')
    rows = cursor.fetchall()
    # results = pd.read_sql('SELECT * FROM public."Agency"', conn)
    for row in rows:
        d = collections.OrderedDict()
        d['Percapita_Income'] = row[1]
        d['County_Name'] = row[3]

        x.append(d)
    return jsonify(x)

@app.route('/api/CountyCrimes')
def CountyCrimes():
    x=[]
    results = cursor.execute('SELECT CAST(sum(public."Offense".cleared) as bigint), CAST(sum(public."Offense".actual) as bigint), public."Agency".county_name From public."Offense" left join public."Agency" on public."Offense".ori = public."Agency".ori group by public."Agency".county_name;')
    rows = cursor.fetchall()
    # results = pd.read_sql('SELECT * FROM public."Agency"', conn)
    for row in rows:
        d = collections.OrderedDict()
        d['cleared'] = row[0]
        d['actual'] = row[1]
        d['county_name'] = row[2]

        x.append(d)
    return jsonify(x)

@app.route('/api/Offense')
def Offense():
    x=[]
    results = cursor.execute('SELECT agc.agencyid, agency_name, offense, cnty.countyid, cnty.county_name, actual, percapita_income, offn.data_year "year" FROM "Agency" agc inner join "CountyAgency" cntyagc on agc.agencyid = cast (cntyagc.agencyid as bigint) inner join "County" cnty on cntyagc.countyid = cnty.countyid inner join "Income" inc on cnty.countyid = inc.countyid inner join "Offense" offn on agc.ori = offn.ori WHERE offn.data_year = inc.data_year ORDER BY agc.agencyid, countyid, offense, offn.data_year')
    rows = cursor.fetchall()
    # results = pd.read_sql('SELECT * FROM public."Agency"', conn)
    for row in rows:
        d = collections.OrderedDict()
        d['agencyid'] = row[0]
        d['agency_name'] = row[1]
        d['offense'] = row[2]
        d['countyid'] = row[3]
        d['county_name'] = row[4]
        d['actual'] = row[5]
        d['percapita_income'] = row[6]
        d['year'] = row[7]

        x.append(d)
    return jsonify(x)


if __name__ == '__main__':
    app.run(debug=True)