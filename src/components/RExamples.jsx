import React, { useState } from 'react'

const RExamples = () => {
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

  const getDynamicRCode = () => {
    const url = generatedUrl || generateUrl()
    
    if (apiType === 'export') {
      if (exportParams.format === 'csv') {
        return `# Install required packages (run once)
install.packages(c("readr", "dplyr", "ggplot2"))

# Load libraries
library(readr)
library(dplyr)
library(ggplot2)

# Read data from DataCommon API
data <- read_csv("${url}")

# View data structure and first few rows
str(data)
head(data)

# Example analysis: Summary statistics
summary(data)

# Example visualization (if applicable)
# ggplot(data, aes(x = column_name)) + geom_histogram()`
      } else {
        return `# Install jsonlite if you don't have it yet
install.packages("jsonlite")

# Load the library
library(jsonlite)

# API URL
url <- "${url}"

# Read JSON directly into a data frame
data <- fromJSON(url)

# Inspect the data
str(data)
head(data)

# Optional: Convert to data frame if needed
# df <- as.data.frame(data)`
      }
    } else {
      return `# Install jsonlite if you don't have it yet
install.packages("jsonlite")

# Load the library
library(jsonlite)

# API URL
url <- "${url}"

# Read JSON directly into a data frame
response <- fromJSON(url)

# Extract data and fields
data <- response$rows
fields <- response$fields

# View results
str(data)
head(data)
print(fields)

# Convert to data frame for analysis
df <- as.data.frame(data)

# Example analysis
summary(df)`
    }
  }

  return (
    <div className="r-examples">
      <div className="examples-header">
        <h2>R Studio Copy-Paste Syntax</h2>
        <p>Copy these commands directly into R Studio to get started with DataCommon API data</p>
      </div>


      <div className="example-content">
        <div className="example-description">
          <h3>Custom API Builder</h3>
          <p>Build your own API calls and generate R code automatically</p>
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

        {/* Dynamic R Code Section */}
        <div className="code-section">
          <div className="code-header">
            <h4>Generated R Code:</h4>
            <button 
              onClick={() => copyCode(getDynamicRCode())}
              className="btn btn-primary"
            >
              Copy R Code
            </button>
          </div>
          <pre className="code-block">
            <code>{getDynamicRCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default RExamples
