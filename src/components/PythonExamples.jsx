import React, { useState } from 'react'

const PythonExamples = () => {
  const [apiType, setApiType] = useState('export') // 'export' or 'query'
  
  // Export API parameters
  const [exportParams, setExportParams] = useState({
    token: 'datacommon',
    database: 'ds',
    schema: 'tabular',
    table: 'hous_building_permits_m',
    format: 'csv',
    years: '2024'
  })
  
  // Query API parameters
  const [queryParams, setQueryParams] = useState({
    token: 'datacommon',
    database: 'ds',
    query: 'SELECT muni, park_dem, util_rate, bldg_affp, walk_score FROM tabular.trans_perfect_fit_parking WHERE muni LIKE \'Boston\''
  })
  
  const [generatedUrl, setGeneratedUrl] = useState('')

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const generateUrl = () => {
    if (apiType === 'export') {
      const params = new URLSearchParams(exportParams)
      const url = `https://datacommon.mapc.org/api/export?${params.toString()}`
      setGeneratedUrl(url)
      return url
    } else {
      const params = new URLSearchParams(queryParams)
      const url = `https://datacommon.mapc.org/api/?${params.toString()}`
      setGeneratedUrl(url)
      return url
    }
  }

  const handleExportParamChange = (param, value) => {
    setExportParams(prev => ({
      ...prev,
      [param]: value
    }))
    // Clear generated URL when parameters change
    setGeneratedUrl('')
  }

  const handleQueryParamChange = (param, value) => {
    setQueryParams(prev => ({
      ...prev,
      [param]: value
    }))
    // Clear generated URL when parameters change
    setGeneratedUrl('')
  }

  const copyUrl = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl)
      alert('URL copied to clipboard!')
    }
  }

  const getDynamicPythonCode = () => {
    const url = generatedUrl || generateUrl()
    
    if (apiType === 'export') {
      if (exportParams.format === 'csv') {
        return `# Install required packages (run once)
# pip install pandas requests matplotlib seaborn

import pandas as pd
import requests
import matplotlib.pyplot as plt
import seaborn as sns

# Read data from DataCommon API
url = "${url}"
data = pd.read_csv(url)

# View data structure and first few rows
print("Data shape:", data.shape)
print("\\nColumn names:")
print(data.columns.tolist())
print("\\nFirst few rows:")
print(data.head())

# Basic data info
print("\\nData info:")
print(data.info())

# Summary statistics
print("\\nSummary statistics:")
print(data.describe())

# Example visualization (uncomment to use)
# plt.figure(figsize=(10, 6))
# sns.histplot(data['column_name'])
# plt.title('Distribution of Column Name')
# plt.show()`
      } else {
        return `# Install required packages (run once)
# pip install requests pandas

import requests
import pandas as pd
import json

# API URL
url = "${url}"

# Make API request
response = requests.get(url)
response.raise_for_status()  # Raises an HTTPError for bad responses

# Parse JSON response
data = response.json()

# Convert to DataFrame if it's a list of records
if isinstance(data, list):
    df = pd.DataFrame(data)
else:
    # If it's a nested structure, you might need to adjust this
    df = pd.DataFrame(data)

# View data structure and first few rows
print("Data shape:", df.shape)
print("\\nColumn names:")
print(df.columns.tolist())
print("\\nFirst few rows:")
print(df.head())

# Basic data info
print("\\nData info:")
print(df.info())`
      }
    } else {
      return `# Install required packages (run once)
# pip install requests pandas

import requests
import pandas as pd
import json

# API URL
url = "${url}"

# Make API request
response = requests.get(url)
response.raise_for_status()  # Raises an HTTPError for bad responses

# Parse JSON response
response_data = response.json()

# Extract data and fields from the response
data = response_data.get('rows', [])
fields = response_data.get('fields', [])

# Convert to DataFrame
if data:
    df = pd.DataFrame(data)
else:
    print("No data rows found in response")
    df = pd.DataFrame()

# View results - Display basic information about the data
if not df.empty:
    print("Data shape:", df.shape)
    print("\\nColumn names:")
    print(df.columns.tolist())
    print("\\nFirst few rows:")
    print(df.head())
else:
    print("DataFrame is empty - no data to display")

# Print field information
print("\\nField information:")
if fields and len(fields) > 0:
    # Check if fields is a list of objects or strings
    # Some APIs return field objects with 'name' and 'type', others return just field names
    if isinstance(fields[0], dict):
        for field in fields:
            print(f"- {field.get('name', 'Unknown')}: {field.get('type', 'Unknown type')}")
    else:
        # If fields is a list of strings (field names only)
        for field in fields:
            print(f"- {field}")
else:
    print("No field information available")

# Basic data info
if not df.empty:
    print("\\nData info:")
    print(df.info())
    
    # Summary statistics for numeric columns
    print("\\nSummary statistics:")
    print(df.describe())
else:
    print("\\nNo data available for info or summary statistics")

`
    }
  }

  return (
    <div className="python-examples">
      <div className="examples-header">
        <h2>Python Copy-Paste Syntax</h2>
        <p>Copy these commands directly into your Python environment to get started with DataCommon API data</p>
      </div>

      <div className="example-content">
        <div className="example-description">
          <h3>Custom API Builder</h3>
          <p>Build your own API calls and generate Python code automatically</p>
        </div>

        {/* API Type Selection */}
        <div className="api-type-section">
          <h4>Select API Type</h4>
          <div className="api-type-selector">
            <label>
              <input
                type="radio"
                value="export"
                checked={apiType === "export"}
                onChange={(e) => setApiType(e.target.value)}
              />
              Export API (Download data in different formats)
            </label>
            <label>
              <input
                type="radio"
                value="query"
                checked={apiType === "query"}
                onChange={(e) => setApiType(e.target.value)}
              />
              Query API (Custom SQL queries)
            </label>
          </div>
        </div>

        {/* API Form Section */}
        <div className="api-form-section">
          <h4>Build Your Custom API Call</h4>
          
          {apiType === 'export' ? (
            <div className="params-grid">
              <div className="param-group">
                <label htmlFor="export-token">Token:</label>
                <input
                  type="text"
                  id="export-token"
                  value={exportParams.token}
                  disabled
                  className="token-input"
                  placeholder="datacommon"
                />
                <small>Fixed value for DataCommon API</small>
              </div>

              <div className="param-group">
                <label htmlFor="export-database">Database:</label>
                <select
                  id="export-database"
                  value={exportParams.database}
                  onChange={(e) => handleExportParamChange('database', e.target.value)}
                >
                  <option value="ds">ds</option>
                  <option value="gisdata">gisdata</option>
                  <option value="towndata">towndata</option>
                </select>
              </div>

              <div className="param-group">
                <label htmlFor="export-schema">Schema:</label>
                <select
                  id="export-schema"
                  value={exportParams.schema}
                  onChange={(e) => handleExportParamChange('schema', e.target.value)}
                >
                  <option value="tabular">tabular</option>
                  <option value="mapc">mapc</option>
                </select>
              </div>

              <div className="param-group">
                <label htmlFor="export-table">Table:</label>
                <input
                  type="text"
                  id="export-table"
                  value={exportParams.table}
                  onChange={(e) => handleExportParamChange('table', e.target.value)}
                  placeholder="hous_building_permits_m"
                />
              </div>

              <div className="param-group">
                <label htmlFor="export-format">Format:</label>
                <select
                  id="export-format"
                  value={exportParams.format}
                  onChange={(e) => handleExportParamChange('format', e.target.value)}
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  {exportParams.database === "towndata" && (
                    <option value="geojson">GeoJSON</option>
                  )}
                </select>
              </div>

              <div className="param-group">
                <label htmlFor="export-years">Years:</label>
                <input
                  type="text"
                  id="export-years"
                  value={exportParams.years}
                  onChange={(e) => handleExportParamChange('years', e.target.value)}
                  placeholder="2024 or 2019-23,2018-22"
                />
                <small>Use comma-separated values for multiple years or year ranges</small>
              </div>
            </div>
          ) : (
            <div className="params-grid">
              <div className="param-group">
                <label htmlFor="query-token">Token:</label>
                <input
                  type="text"
                  id="query-token"
                  value={queryParams.token}
                  disabled
                  className="token-input"
                  placeholder="datacommon"
                />
                <small>Fixed value for DataCommon API</small>
              </div>

              <div className="param-group">
                <label htmlFor="query-database">Database:</label>
                <input
                  type="text"
                  id="query-database"
                  value={queryParams.database}
                  onChange={(e) => handleQueryParamChange('database', e.target.value)}
                  placeholder="ds or gisdata or towndata"
                />
              </div>

              <div className="param-group full-width">
                <label htmlFor="query-sql">SQL Query:</label>
                <textarea
                  id="query-sql"
                  value={queryParams.query}
                  onChange={(e) => handleQueryParamChange('query', e.target.value)}
                  placeholder="SELECT * FROM tabular.your_table WHERE condition"
                  className="query-textarea"
                  rows="4"
                />
                <small>Enter your SQL query here. Use proper SQL syntax.</small>
                <small className="schema-reminder">
                  ⚠️ <strong>Important:</strong> Always include schema in table references (e.g., tabular.demo_race_by_age_gender_m)
                </small>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button 
              onClick={generateUrl}
              className="btn btn-primary"
            >
              Generate URL
            </button>
          </div>

          {generatedUrl && (
            <div className="url-result-section">
              <h4>Generated API URL:</h4>
              <div className="url-display">
                <code>{generatedUrl}</code>
                <button 
                  onClick={copyUrl}
                  className="btn btn-secondary btn-small"
                >
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Python Code Section */}
        <div className="code-section">
          <div className="code-header">
            <h4>Generated Python Code:</h4>
            <button 
              onClick={() => copyCode(getDynamicPythonCode())}
              className="btn btn-primary"
            >
              Copy Python Code
            </button>
          </div>
          <pre className="code-block">
            <code>{getDynamicPythonCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default PythonExamples
