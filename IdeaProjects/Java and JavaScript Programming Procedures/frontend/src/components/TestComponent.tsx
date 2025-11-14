import React from 'react'

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      border: '2px solid #333',
      margin: '20px',
      fontSize: '18px'
    }}>
      <h1 style={{ color: 'red' }}>🔍 REACT TEST COMPONENT</h1>
      <p>Si ves este texto, React está funcionando correctamente.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      <div style={{ 
        background: 'yellow', 
        padding: '10px', 
        border: '1px solid black' 
      }}>
        ⚠️ COMPONENTE DE PRUEBA VISIBLE
      </div>
    </div>
  )
}

export default TestComponent