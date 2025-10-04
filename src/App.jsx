import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './ProtectedRoutes'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' 
      element={
        <ProtectedRoutes>
          <Dashboard/>
        </ProtectedRoutes>
        }/>

      
      

    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
