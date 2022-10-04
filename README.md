# Project-Group-D
## Group Participants
* Joe Johnson
* Jenny Bedwell
* John McMullan
* Huda Alghazouli
* Hwa Hara
* Sarje Page
* Chloe Stitik
* Lennox Nguyen
* Diana Lam
* Daulton Davis

## Data Sources
* "Crime Data" API Call on <a href = "https://crime-data-explorer.fr.cloud.gov/pages/explorer/crime/crime-trend">Crime Data</a>
* "Median Household Income" Dataset <a href = "https://fred.stlouisfed.org/release/tables?rid=175&eid=266512">Median Household Income</a> 

## Overview
Georgia has been in the news a lot in the last few years especially due to the recent up surge of crimes. As some of us are residents of Georgia, we are aware that most of these crimes are confined to certain counties of Georgia but to truly understand the true nature of these crimes, we decided to dig deeper into the Georgia county data available from our data sources by looking at the average income of each of the counties and see its correlation with crime.

With ORI (Originating Agency Identifier) of the Georgia law enforcement system, we will be able to extract different crime data from 2017 to 2020 inside Georgia. By utilizing different data sources, Jupyter notebook, Leaflet, Plotly, Postgres SQL, HTML/CSS, JS, and LoDash (the unintroduced JS library), we analyze the GA county crimes and the median household income to show:

* Index page with the summary of crime data and household income data
* Dashboard with bar charts for each year (2017-2020)
* Leaflet page with the map that has median household income data and crime data with filtered checkboxes

## Rough Breakdown of Data and Data Delivery
### Extract: indicates the original data sources and how the data were formatted at a professional level
### Transform: explains what data clearing or transformation was required at a professional level
### Load: explains the final database, tables/collections, and why the topic was chosen at a professional level
To create the database, we had to identify and relate the columns from the Crime Data and Median House Income Data.

<img src = "resources/Postgesql_erd.PNG" width = "450">

Finally, we had to build SQL Database using PostgreSQL, import data, and then execute table joins via query.

[Placeholder for image]

## Analysis
### The Index Page with the summary of crime data and median household income data

### The Dashboard with bar charts for each year (2017-2020)

### Leaflet Page with the map that has median household income data and crime data with filtered checkboxes

## Conclusions
