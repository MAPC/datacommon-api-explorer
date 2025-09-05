import React, { useState } from "react";

const ApiExplorer = () => {
  const [apiType, setApiType] = useState("export"); // 'export' or 'query'
  const [apiParams, setApiParams] = useState({
    token: "datacommon",
    database: "ds",
    schema: "tabular",
    table: "b25117_hu_tenure_by_fuel_acs_ct",
    format: "csv",
    years: "2019-23,2018-22,2017-21",
  });

  const [queryParams, setQueryParams] = useState({
    token: "datacommon",
    database: "ds",
    query:
      "SELECT years,pop,pop_u18,pop18_24,pop25_34,pop35_39,pop40_44,pop45_49,pop50_54,pop55_59,pop60_64,pop65_69,pop70_74,pop75_79,pop80_84,pop85o,race_eth FROM tabular.demo_race_by_age_gender_m WHERE municipal ilike 'tyngsborough' AND years = '2020'",
  });

  const [generatedUrl, setGeneratedUrl] = useState("");
  const [decodedUrl, setDecodedUrl] = useState("");
  const [error, setError] = useState(null);

  const exportBaseUrl = "https://datacommon.mapc.org/api/export";
  const queryBaseUrl = "https://datacommon.mapc.org/api";

  const generateUrl = () => {
    if (apiType === "export") {
      const params = new URLSearchParams(apiParams);
      const url = `${exportBaseUrl}?${params.toString()}`;
      setGeneratedUrl(url);
      setDecodedUrl(url);
      return url;
    } else {
      const params = new URLSearchParams(queryParams);
      const url = `${queryBaseUrl}/?${params.toString()}`;
      setGeneratedUrl(url);
      setDecodedUrl(url);
      return url;
    }
  };

  const decodeUrl = (encodedUrl) => {
    try {
      const url = new URL(encodedUrl);
      const decodedParams = {};

      for (const [key, value] of url.searchParams.entries()) {
        if (key === "query") {
          decodedParams[key] = decodeURIComponent(value);
        } else {
          decodedParams[key] = value;
        }
      }

      if (url.pathname.includes("/export")) {
        setApiType("export");
        setApiParams((prev) => ({ ...prev, ...decodedParams }));
      } else {
        setApiType("query");
        setQueryParams((prev) => ({ ...prev, ...decodedParams }));
      }

      setDecodedUrl(encodedUrl);
    } catch (err) {
      setError("Invalid URL format");
    }
  };

  const handleParamChange = (param, value) => {
    if (apiType === 'export') {
      setApiParams(prev => ({
        ...prev,
        [param]: value
      }))
      // Clear generated URL when parameters change
      setGeneratedUrl('')
    } else {
      setQueryParams(prev => ({
        ...prev,
        [param]: value
      }))
      // Clear generated URL when parameters change
      setGeneratedUrl('')
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    alert("URL copied to clipboard!");
  };

  const getRCode = () => {
    if (apiType === "export") {
      return `# Read CSV directly from DataCommon API
library(readr)

# Single year data
data <- read_csv("${generatedUrl}")

# Multiple years data
data_multi <- read_csv("${generatedUrl.replace(
        apiParams.years,
        "2024,2016,2017,2018"
      )}")

# View data structure
str(data)
head(data)`;
    } else {
      return `# Read JSON from DataCommon Query API
library(jsonlite)

# Make API request and parse JSON
response <- fromJSON("${generatedUrl}")

# Extract data
data <- response$rows
fields <- response$fields

# View results
print(data)
print(fields)

# Convert to data frame for analysis
demographics_df <- as.data.frame(data)

# Example: Get total population by race/ethnicity
race_summary <- demographics_df %>%
  group_by(race_eth) %>%
  summarise(total_pop = sum(pop, na.rm = TRUE)) %>%
  arrange(desc(total_pop))

print(race_summary)`;
    }
  };

  return (
    <div className="api-explorer">
      <div className="explorer-section">
        <h2>API Type Selection</h2>
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

      {apiType === "export" ? (
        <div className="explorer-section">
          <h2>
            Export API Parameters 
          </h2>
          <div className="params-grid">
            <div className="param-group">
              <label htmlFor="token">Token:</label>
              <input
                id="token"
                type="text"
                value={apiParams.token}
                disabled
                className="token-input"
                placeholder="datacommon"
              />
              <small>Fixed value for DataCommon API</small>
            </div>

            <div className="param-group">
              <label htmlFor="database">Database:</label>
              <select
                id="database"
                value={apiParams.database}
                onChange={(e) => handleParamChange("database", e.target.value)}
              >
                <option value="ds">ds</option>
                <option value="gisdata">gisdata</option>
                <option value="towndata">towndata</option>
              </select>
            </div>

            <div className="param-group">
              <label htmlFor="schema">Schema:</label>
              <select
                id="schema"
                value={apiParams.schema}
                onChange={(e) => handleParamChange("schema", e.target.value)}
              >
                <option value="tabular">tabular</option>
                <option value="mapc">mapc</option>
              </select>
            </div>

            <div className="param-group">
              <label htmlFor="table">Table:</label>
              <input
                id="table"
                type="text"
                value={apiParams.table}
                onChange={(e) => handleParamChange("table", e.target.value)}
                placeholder="hous_building_permits_m"
              />
              {/* <small>
                {apiParams.database === "ds" &&
                  "Examples: b25117_hu_tenure_by_fuel_acs_ct, hous_building_permits_m, demo_race_by_age_gender_m"}
                {apiParams.database === "gisdata" &&
                  "Examples: municipal_boundaries, census_tracts, transportation_networks"}
                {apiParams.database === "towndata" &&
                  "Examples: malden_neighborhoods_poly"}
              </small> */}
            </div>

            <div className="param-group">
              <label htmlFor="format">Format:</label>
              <select
                id="format"
                value={apiParams.format}
                onChange={(e) => handleParamChange("format", e.target.value)}
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                {apiParams.database === "towndata" && (
                  <option value="geojson">GeoJSON</option>
                )}
              </select>
            </div>

            <div className="param-group">
              <label htmlFor="years">Years:</label>
              <input
                id="years"
                type="text"
                value={apiParams.years}
                onChange={(e) => handleParamChange("years", e.target.value)}
                placeholder="2019-23,2018-22,2017-21 or 2024"
              />
              <small>
                Use comma-separated values for multiple years or year ranges
                (applies to time-series data)
              </small>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={generateUrl} className="btn btn-primary">
              Generate URL
            </button>
          </div>

          {generatedUrl && apiType === 'export' && (
            <div className="url-result-section">
              <h4>Generated Export API URL</h4>
              <div className="url-display">
                <code>{generatedUrl}</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    alert('URL copied to clipboard!');
                  }} 
                  className="btn btn-small"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="explorer-section">
          <h2>Query API Parameters with Custom SQL queries</h2>
          <div className="params-grid">
            <div className="param-group">
              <label htmlFor="query-token">Token:</label>
              <input
                id="query-token"
                type="text"
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
                id="query-database"
                type="text"
                value={queryParams.database}
                onChange={(e) => handleParamChange('database', e.target.value)}
                placeholder="ds or gisdata or towndata"
              />
            </div>

            <div className="param-group full-width">
              <label htmlFor="query-sql">SQL Query:</label>
              <textarea
                id="query-sql"
                value={queryParams.query}
                onChange={(e) => handleParamChange('query', e.target.value)}
                placeholder="SELECT years,pop,pop_u18,pop18_24,pop25_34,pop35_39,pop40_44,pop45_49,pop50_54,pop55_59,pop60_64,pop65_69,pop70_74,pop75_79,pop80_84,pop85o,race_eth FROM tabular.demo_race_by_age_gender_m WHERE municipal ilike 'tyngsborough' AND years = '2020'"
                rows="4"
                className="query-textarea"
              />
              <small>
                Example: Demographic data by age and race/ethnicity for Tyngsborough, MA (2020)
              </small>
              <small className="schema-reminder">
                ⚠️ <strong>Important:</strong> Always include schema in table references (e.g., tabular.demo_race_by_age_gender_m)
              </small>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={generateUrl} className="btn btn-primary">
              Generate URL
            </button>
          </div>
          
          {generatedUrl && apiType === 'query' && (
            <div className="url-result-section">
              <h4>Generated Query API URL</h4>
              <div className="url-display">
                <code>{generatedUrl}</code>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    alert('URL copied to clipboard!');
                  }} 
                  className="btn btn-small"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="explorer-section">
        <h2>API Documentation</h2>
        <div className="api-docs">
          
          {/* Export API Section */}
          <div className="doc-section">
            <h3>Export API</h3>
            <p className="section-description">
              Download data directly from DataCommon tables in various formats.
              Some tables are only available in certain formats. Please refer datasets on <a href="https://datacommon.mapc.org/browser">DataCommon website</a> for more information.
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <h4>Supported Databases</h4>
                <ul>
                  <li><strong>ds</strong></li>
                  <li><strong>gisdata</strong></li>
                  <li><strong>towndata</strong></li>
                </ul>
              </div>
              
              <div className="feature-card">
                <h4>Year Formats</h4>
                <ul>
                  <li><strong>Single year:</strong> 2024</li>
                  <li><strong>Multiple years:</strong> 2024,2016,2017,2018</li>
                  <li><strong>Year ranges:</strong> 2019-23,2018-22,2017-21</li>
                </ul>
                <small className="note">
                  ⚠️ Years parameter applies to time-series data (housing, demographics etc.)
                </small>
              </div>
              
              <div className="feature-card">
                <h4>Available Response Formats</h4>
                <ul>
                  <li><strong>CSV:</strong> Comma-separated values</li>
                  <li><strong>JSON:</strong> JavaScript Object Notation</li>
                  <li><strong>GeoJSON:</strong> Geographic data format(not for all tables)</li>
                  <li><strong>Shapefile:</strong> Shapefile format(not for all tables)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExplorer;
