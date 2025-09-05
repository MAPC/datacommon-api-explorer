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
      const params = new URLSearchParams();
      
      // Add all parameters except years
      Object.keys(apiParams).forEach(key => {
        if (key !== 'years') {
          params.append(key, apiParams[key]);
        }
      });
      
      // Only add years parameter if format is not geojson or shapefile
      if (apiParams.format !== 'geojson' && apiParams.format !== 'shapefile') {
        params.append('years', apiParams.years);
      }
      
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
          <div className="instructions">
            <h4>How to use:</h4>
            <ol>
              <li>Fill in the parameters below</li>
              <li>Click "Generate URL"</li>
              <li>Copy the URL and paste it directly into your browser to download the data</li>
            </ol>
          </div>
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
                {apiParams.database === "towndata" && (
                  <option value="shapefile">Shapefile</option>
                )}
              </select>
            </div>

                         {apiParams.format !== 'geojson' && apiParams.format !== 'shapefile' && (
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
             )}
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
          <div className="instructions">
            <h4>How to use:</h4>
            <ol>
              <li>Enter your SQL query below</li>
              <li>Click "Generate URL"</li>
              <li>Copy the URL and use it in your R or Python code (see R Examples and Python Examples tabs)</li>
            </ol>
          </div>
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
          
          {apiType === "export" ? (
            /* Export API Section */
            <div className="doc-section">
              <h3>Export API</h3>
              <p className="section-description">
                The Export API provides programmatic access to DataCommon datasets in various formats. 
                This endpoint allows direct download of data from specified tables with filtering by year.
              </p>
              
              <div className="api-endpoint">
                <h4>Endpoint</h4>
                <code>GET https://datacommon.mapc.org/api/export</code>
              </div>

              <div className="parameters-section">
                <h4>Parameters</h4>
                
                <div className="parameter-table">
                  <div className="param-row header">
                    <div className="param-name">Parameter</div>
                    <div className="param-type">Type</div>
                    <div className="param-required">Required</div>
                    <div className="param-description">Description</div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">token</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">API access token. Use "datacommon" for public access.</div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">database</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      Target database identifier. Valid values:
                      <ul>
                        <li><code>ds</code> - Main dataset database containing tabular data</li>
                        <li><code>gisdata</code> - Geographic/spatial data repository</li>
                        <li><code>towndata</code> - Town-specific datasets and boundaries</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">schema</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      Database schema name. Valid values:
                      <ul>
                        <li><code>tabular</code> - Standard tabular data schema</li>
                        <li><code>mapc</code> - MAPC-specific data schema</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">table</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      Target table name  
                      <br />
                      <strong>Example:</strong> <code>hous_building_permits_m</code>
                    </div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">format</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      Output data format. Valid values:
                      <ul>
                        <li><code>csv</code> - Comma-separated values (default for tabular data)</li>
                        <li><code>json</code> - JavaScript Object Notation</li>
                        <li><code>geojson</code> - Geographic data format (available for spatial tables)</li>
                        <li><code>shapefile</code> - Shapefile format (available for spatial tables)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">years</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Optional (depends on the format)</div>
                    <div className="param-description">
                      Filter for time-series data. The format depends on how years are stored in the database. If you want to query for multiple years, you can use comma-separated values.
                      <ul>
                        <li><strong>Single year:</strong> <code>2024</code> (when data is stored as individual years)</li>
                        <li><strong>Year range:</strong> <code>2019-23</code> (when data is stored as 5-year periods)</li>
                        <li><strong>Multiple years:</strong> <code>2024,2023,2022</code> (comma-separated individual years)</li>or <code>2019-23,2018-22,2017-21</code> (comma-separated year ranges)
                      </ul>
                      <strong>Note:</strong> Check the DataCommon browser to see how years are stored for each specific table. 
                      Some tables use individual years (2023, 2024) while others use 5-year periods (2019-23, 2014-18).
                      <br/><strong>Important:</strong> This parameter is not applicable for GeoJSON and Shapefile formats.
                    </div>
                  </div>
                </div>
              </div>

              <div className="response-section">
                <h4>Response</h4>
                <p>
                  The API returns data in the requested format. For CSV format, the response includes headers in the first row. 
                  For JSON format, data is returned as an array of objects. For GeoJSON format, spatial data is returned 
                  following the GeoJSON specification.
                </p>
              </div>

              <div className="example-section">
                <h4>Example Request</h4>
                <pre className="code-example">
                  <code>
{`GET https://datacommon.mapc.org/api/export?token=datacommon&database=ds&schema=tabular&table=hous_building_permits_m&format=csv&years=2024`}
                  </code>
                </pre>
              </div>
            </div>
          ) : (
            /* Query API Section */
            <div className="doc-section">
              <h3>Query API</h3>
              <p className="section-description">
                The Query API provides programmatic access to DataCommon datasets through custom SQL queries. 
                This endpoint allows you to execute SQL queries against specified databases and retrieve filtered or aggregated data.
              </p>
              
              <div className="api-endpoint">
                <h4>Endpoint</h4>
                <code>GET https://datacommon.mapc.org/api/</code>
              </div>

              <div className="parameters-section">
                <h4>Parameters</h4>
                
                <div className="parameter-table">
                  <div className="param-row header">
                    <div className="param-name">Parameter</div>
                    <div className="param-type">Type</div>
                    <div className="param-required">Required</div>
                    <div className="param-description">Description</div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">token</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">API access token. Use "datacommon" for public access.</div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">database</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      Target database identifier. Valid values:
                      <ul>
                        <li><code>ds</code> - Main dataset database containing tabular data</li>
                        <li><code>gisdata</code> - Geographic/spatial data repository</li>
                        <li><code>towndata</code> - Town-specific datasets and boundaries</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="param-row">
                    <div className="param-name">query</div>
                    <div className="param-type">string</div>
                    <div className="param-required">Yes</div>
                    <div className="param-description">
                      SQL query to execute against the specified database. 
                      <br/>
                      <strong>Important:</strong> Always include schema in table references (e.g., <code>tabular.table_name</code>).
                      <br/>
                      <strong>Example:</strong> <code>SELECT * FROM tabular.hous_building_permits_m WHERE cal_year = '2024'</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="response-section">
                <h4>Response</h4>
                <p>
                  The API returns a JSON response containing the query results and metadata:
                </p>
                <ul>
                  <li><strong>rows:</strong> Array of data objects representing the query results</li>
                  <li><strong>fields:</strong> Array of field metadata including column names and types</li>
                </ul>
              </div>

              <div className="example-section">
                <h4>Example Request</h4>
                <pre className="code-example">
                  <code>
{`GET https://datacommon.mapc.org/api/?token=datacommon&database=ds&query=SELECT%20muni%2C%20park_dem%2C%20util_rate%20FROM%20tabular.trans_perfect_fit_parking%20WHERE%20muni%20LIKE%20%27Boston%27`}
                  </code>
                </pre>
              </div>

              <div className="example-section">
                <h4>Example Response</h4>
                <pre className="code-example">
                  <code>
{`{
  "rows": [
    {
      "muni": "Boston",
      "park_dem": "0.85",
      "util_rate": "0.92"
    }
  ],
  "fields": [
    {
      "name": "muni",
      "type": "text"
    },
    {
      "name": "park_dem", 
      "type": "numeric"
    },
    {
      "name": "util_rate",
      "type": "numeric"
    }
  ]
}`}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiExplorer;
