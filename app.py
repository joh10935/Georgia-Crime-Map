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

# Set up engine
engine = create_engine(f'postgresql://postgres:Techbobcats=0618@localhost/GACRIME')
Base = automap_base()
Base.prepare(engine, reflect=True)
conn = engine.connect()



# Create Flask
app = Flask(__name__)



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
    session = Session(engine)

    results = pd.read_sql('SELECT public."Offense".offenseid, public."Offense".offense, public."Offense".ori, public."Offense".data_year,public."Offense".cleared,public."Offense".actual,public."Agency".agency_name, public."Agency".county_name, public."Agency".agencyid FROM public."Offense" Left join public."Agency" on public."Offense".ori = public."Agency".ori;', conn)
    df = results.groupby(by=["agency_name"], dropna=False).sum()
    df2 = df.drop(columns=['offenseid', 'data_year', 'agencyid'])
    x = df.to_json()
    return (x)






if __name__ == '__main__':
    app.run(debug=True)