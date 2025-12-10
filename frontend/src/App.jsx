import React from 'react'
import TodosPage from './pages/Todos'

export default function App(){
  return (
    <div style={{maxWidth:800, margin:'20px auto', fontFamily:'Arial, sans-serif'}}>
      <h1>Todo List</h1>
      <TodosPage />
    </div>
  )
}
