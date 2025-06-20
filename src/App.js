import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

    return (
    <div className="App" style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#000000",
      color: "#ffffff",
      fontFamily: "sans-serif",
      paddingTop: "5vh"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "600",
        marginBottom: "2rem",
        color: "#ffffff"
      }}>
        Analyze.io
      </h1>

      <form onSubmit={handleSubmit} style={{
        background: "#1e1e1e",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(255,255,255,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "90%",
        maxWidth: "600px",
        color: "#fff"
      }}>
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the insights you want"
          style={{
            padding: "0.75rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#121212",
            color: "#fff"
          }}
        />
        <input
          type="file"
          accept=".csv"
          onChange={e => setFile(e.target.files[0])}
          style={{
            fontSize: "1rem",
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#121212",
            color: "#fff"
          }}
        />
        <button type="submit" style={{
          padding: "0.75rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}>
          Analyze
        </button>
      </form>

      {result && (
        <section style={{
          marginTop: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          padding: "2rem",
          gap: "2rem"
        }}>

          {/* TOP: AI-Generated Insights */}
          <div style={{
            width: "100%",
            backgroundColor: "#1e1e1e",
            padding: "1.5rem",
            borderRadius: "12px"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#ffffff" }}>AI-Generated Insights</h2>
            <pre style={{
              whiteSpace: 'pre-wrap',
              background: '#121212',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '1rem',
              lineHeight: '1.6',
              color: "#ddd"
            }}>
              {result.insights}
            </pre>
            <p style={{ color: "#bbb", marginTop: "1rem" }}>
              <strong>Dataset Shape:</strong> {JSON.stringify(result.shape)}
            </p>
            <p style={{ color: "#bbb" }}>
              <strong>Columns:</strong> {result.columns.join(', ')}
            </p>
          </div>

          {/* MIDDLE: Charts + Analysis (title + content structure) */}
          {result.charts && result.chart_sections && result.chart_sections.length > 0 && (
            result.chart_sections.map((section, i) => (
              <div key={i} style={{
                display: "flex",
                flexDirection: "row",
                gap: "2rem",
                width: "100%"
              }}>
                {/* LEFT: Text Content */}
                <div style={{
                  flex: 1,
                  backgroundColor: "#1e1e1e",
                  padding: "1rem",
                  borderRadius: "12px"
                }}>
                  <h3 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>{section.title}</h3>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    background: '#121212',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: "#ccc"
                  }}>
                    {section.content}
                  </pre>
                </div>

                {/* RIGHT: Image */}
                <div style={{
                  flex: 1,
                  backgroundColor: "#1e1e1e",
                  padding: "1rem",
                  borderRadius: "12px"
                }}>
                  <img
                    src={`http://localhost:5000/${result.charts[i]}`}
                    alt={`Chart ${i + 1}`}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "1px solid #444"
                    }}
                  />
                </div>
              </div>
            ))
          )}

          {/* BOTTOM: Overall Insights/Recommendations */}
          {result.overall_insights && (
            <div style={{
              width: "100%",
              backgroundColor: "#1e1e1e",
              padding: "1.5rem",
              borderRadius: "12px"
            }}>
              <h3 style={{ color: "#ffffff", marginBottom: "1rem" }}>
                Overall Additional Insights & Recommendations
              </h3>
              <pre style={{
                whiteSpace: 'pre-wrap',
                background: '#121212',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: '1.6',
                color: "#ccc"
              }}>
                {result.overall_insights}
              </pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default App;