# DataCommon API Explorer

A comprehensive web application for exploring and learning how to use the DataCommon API. This tool provides interactive examples for both R and Python programming languages, allowing users to build custom API calls and generate ready-to-use code.

## Features

- **API Explorer**: Interactive interface to build and test DataCommon API calls with real-time URL generation
- **R Examples**: Generate R code for data analysis with the DataCommon API
- **Python Examples**: Generate Python code for data analysis with the DataCommon API
- **Data Preview**: Explore data structure and sample records from live API calls
- **Export & Query APIs**: Support for both export and custom query APIs
- **Technical Documentation**: Comprehensive API documentation with parameter details and examples
- **Smart Parameter Handling**: Automatic parameter validation and conditional field display

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local development URL (typically http://localhost:5173)

## How to Use the API Explorer

### Export API - Step by Step Guide

1. **Select API Type**
   - Click on the "Export API (Download data in different formats)" radio button
   - This will show the Export API parameter form

2. **Configure Parameters**
   - **Token**: Fixed as "datacommon" (cannot be changed)
   - **Database**: Choose from dropdown:
     - `ds` - Main dataset database
     - `gisdata` - Geographic/spatial data
     - `towndata` - Town-specific data
   - **Schema**: Choose from dropdown:
     - `tabular` - Tabular data tables
     - `mapc` - MAPC-specific data
   - **Table**: Enter the table name (e.g., `hous_building_permits_m`)
   - **Format**: Choose output format:
     - `CSV` - Comma-separated values
     - `JSON` - JavaScript Object Notation
     - `GeoJSON` - Geographic data (available for spatial tables)
     - `Shapefile` - Shapefile format (available for spatial tables)
   - **Years**: Enter year(s) for time-series data (only for CSV and JSON formats):
     - Single year: `2024`
     - Multiple years: `2024,2023,2022`
     - Year ranges: `2019-23,2018-22`
     - Mixed format: `2019-23,2024,2021`

3. **Generate URL**
   - Click the "Generate URL" button
   - The API URL will appear in the "Generated Export API URL" section

4. **Copy and Use the URL**
   - Click the "Copy" button to copy the URL to your clipboard
   - **Paste the URL directly into your browser** to download the data
   - The browser will either download the file or display the data depending on the format

5. **Example URLs**
   - CSV: `https://datacommon.mapc.org/api/export?token=datacommon&database=ds&schema=tabular&table=hous_building_permits_m&format=csv&years=2024`
   - JSON: `https://datacommon.mapc.org/api/export?token=datacommon&database=ds&schema=tabular&table=hous_building_permits_m&format=json&years=2024`

### Query API - Step by Step Guide

1. **Select API Type**
   - Click on the "Query API (Custom SQL queries)" radio button
   - This will show the Query API parameter form

2. **Configure Parameters**
   - **Token**: Fixed as "datacommon" (cannot be changed)
   - **Database**: Enter database name (e.g., `ds`, `gisdata`, `towndata`)
   - **SQL Query**: Enter your custom SQL query
     - Always include schema in table references: `tabular.table_name`
     - Example: `SELECT * FROM tabular.hous_building_permits_m WHERE cal_year = '2024'`

3. **Generate URL**
   - Click the "Generate URL" button
   - The API URL will appear in the "Generated Query API URL" section

4. **Copy and Use the URL**
   - Click the "Copy" button to copy the URL to your clipboard
   - Use the URL in your R or Python code (see R Examples and Python Examples tabs)

## API Types Supported

- **Export API**: Download data in CSV, JSON, GeoJSON, and Shapefile formats
- **Query API**: Execute custom SQL queries against DataCommon databases

## Key Features

### Smart Parameter Handling
- **Conditional Fields**: Years parameter only appears for CSV and JSON formats
- **Format-Specific Options**: GeoJSON and Shapefile options only available for spatial data
- **Dynamic URL Generation**: URLs automatically exclude irrelevant parameters

### Code Generation
- **R Examples**: Generates R code with proper error handling and data exploration
- **Python Examples**: Generates Python code with pandas, requests, and data analysis examples
- **Format-Specific Code**: Different code templates based on API type and format

### Technical Documentation
- **Comprehensive API Docs**: Detailed parameter descriptions with examples
- **Dynamic Documentation**: Shows only relevant API documentation based on selection
- **Professional Format**: Technical documentation with parameter tables and examples

## Deployment

The application can be deployed to GitHub Pages using:

```bash
npm run build
npm run deploy
```

## Technologies Used

- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Modern JavaScript (ES6+)**: Latest JavaScript features
- **CSS3**: Responsive design with modern styling
- **GitHub Pages**: Static site hosting
