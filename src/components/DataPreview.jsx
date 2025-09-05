import React, { useState, useEffect } from 'react'

const DataPreview = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState('2024')

  const sampleData = {
    columns: [
      'seq_id', 'muni_id', 'municipal', 'cal_year', 'months_rep', 
      'tot_b', 'tot_units', 'sf_b', 'sf_units', 'sf_share_p',
      'mf_b', 'mf_units', 'mf_share_p', 'mf2_b', 'mf2_units',
      'mf3_4_b', 'mf3_4units', 'mf5o_b', 'mf5ovunits'
    ],
    sampleRecords: [
      {
        seq_id: '17816',
        muni_id: '1',
        municipal: 'Abington',
        cal_year: '2024',
        months_rep: '0',
        tot_b: '2',
        tot_units: '2',
        sf_b: '2',
        sf_units: '2',
        sf_share_p: '1.0000000000000000000',
        mf_b: '0',
        mf_units: '0',
        mf_share_p: '0',
        mf2_b: '0',
        mf2_units: '0',
        mf3_4_b: '0',
        mf3_4units: '0',
        mf5o_b: '0',
        mf5ovunits: '0'
      },
      {
        seq_id: '17817',
        muni_id: '2',
        municipal: 'Acton',
        cal_year: '2024',
        months_rep: '12',
        tot_b: '3',
        tot_units: '151',
        sf_b: '1',
        sf_units: '1',
        sf_share_p: '0.0066225100000000000',
        mf_b: '2',
        mf_units: '150',
        mf_share_p: '0.993377480000000000',
        mf2_b: '0',
        mf2_units: '0',
        mf3_4_b: '0',
        mf3_4units: '0',
        mf5o_b: '2',
        mf5ovunits: '150'
      },
      {
        seq_id: '17818',
        muni_id: '3',
        municipal: 'Acushnet',
        cal_year: '2024',
        months_rep: '12',
        tot_b: '2',
        tot_units: '2',
        sf_b: '2',
        sf_units: '2',
        sf_share_p: '1.0000000000000000000',
        mf_b: '0',
        mf_units: '0',
        mf_share_p: '0',
        mf2_b: '0',
        mf2_units: '0',
        mf3_4_b: '0',
        mf3_4units: '0',
        mf5o_b: '0',
        mf5ovunits: '0'
      }
    ]
  }

  const columnDescriptions = {
    'seq_id': 'Sequential identifier for the record',
    'muni_id': 'Municipality identifier',
    'municipal': 'Municipality name',
    'cal_year': 'Calendar year of the data',
    'months_rep': 'Number of months reported (0 = full year)',
    'tot_b': 'Total number of buildings',
    'tot_units': 'Total number of housing units',
    'sf_b': 'Single-family buildings',
    'sf_units': 'Single-family housing units',
    'sf_share_p': 'Proportion of single-family units',
    'mf_b': 'Multi-family buildings',
    'mf_units': 'Multi-family housing units',
    'mf_share_p': 'Proportion of multi-family units',
    'mf2_b': '2-unit multi-family buildings',
    'mf2_units': '2-unit multi-family housing units',
    'mf3_4_b': '3-4 unit multi-family buildings',
    'mf3_4units': '3-4 unit multi-family housing units',
    'mf5o_b': '5+ unit multi-family buildings',
    'mf5ovunits': '5+ unit multi-family housing units'
  }

  const fetchLiveData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const url = `https://datacommon.mapc.org/api/export?token=datacommon&database=ds&schema=tabular&table=hous_building_permits_m&format=csv&years=${selectedYear}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const csvText = await response.text()
      const lines = csvText.split('\n')
      const headers = lines[0].split(',')
      const records = lines.slice(1, 6).map(line => {
        const values = line.split(',')
        const record = {}
        headers.forEach((header, index) => {
          record[header.trim()] = values[index] ? values[index].trim() : ''
        })
        return record
      })
      
      setData({ columns: headers, sampleRecords: records })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveData()
  }, [selectedYear])

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h2>Data Structure & Preview</h2>
        <p>Explore the structure and sample data from the DataCommon API</p>
      </div>

      <div className="year-selector">
        <label htmlFor="year-select">Select Year:</label>
        <select 
          id="year-select"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>
        <button onClick={fetchLiveData} className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="error-section">
          <h3>Error Loading Data</h3>
          <p className="error-message">{error}</p>
          <p>Using sample data instead.</p>
        </div>
      )}

      <div className="data-structure">
        <h3>Data Structure</h3>
        <p>The building permits data contains the following columns:</p>
        
        <div className="columns-grid">
          {sampleData.columns.map(column => (
            <div key={column} className="column-item">
              <strong>{column}</strong>
              <p>{columnDescriptions[column] || 'No description available'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sample-data">
        <h3>Sample Data Records</h3>
        <p>Here are sample records from the {selectedYear} dataset:</p>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {sampleData.columns.map(column => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleData.sampleRecords.map((record, index) => (
                <tr key={index}>
                  {sampleData.columns.map(column => (
                    <td key={column}>{record[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="data-insights">
        <h3>Data Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Data Coverage</h4>
            <ul>
              <li>Data covers Massachusetts municipalities</li>
              <li>Available from 2016 to present</li>
              <li>Monthly and annual reporting periods</li>
              <li>Both single-family and multi-family housing</li>
            </ul>
          </div>
          
          <div className="insight-card">
            <h4>Key Metrics</h4>
            <ul>
              <li><strong>Building Count:</strong> Number of structures permitted</li>
              <li><strong>Unit Count:</strong> Total housing units created</li>
              <li><strong>Housing Mix:</strong> Single vs multi-family proportions</li>
              <li><strong>Temporal Trends:</strong> Year-over-year changes</li>
            </ul>
          </div>
          
          <div className="insight-card">
            <h4>Data Quality</h4>
            <ul>
              <li>Standardized municipality identifiers</li>
              <li>Consistent column naming</li>
              <li>Proportional data for easy analysis</li>
              <li>Missing data handling with proper indicators</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="usage-tips">
        <h3>Usage Tips</h3>
        <div className="tips-content">
          <h4>For Data Analysis</h4>
          <ul>
            <li>Use <code>months_rep</code> to filter for complete year data</li>
            <li>Combine multiple years for trend analysis</li>
            <li>Calculate percentages using the share columns</li>
            <li>Filter by municipality for local analysis</li>
          </ul>
          
          <h4>For R Programming</h4>
          <ul>
            <li>Use <code>read_csv()</code> for direct URL reading</li>
            <li>Convert <code>cal_year</code> to date for time series</li>
            <li>Handle missing values with <code>na.rm = TRUE</code></li>
            <li>Use <code>group_by()</code> for municipality-level analysis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DataPreview
