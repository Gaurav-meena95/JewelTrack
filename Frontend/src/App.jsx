import { useState } from 'react'
import { Landing } from './components/Landing'
import Signup from './components/Auth/Signup'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      {/* <Landing/> */}
      <Signup/>
    </div>

    </>
  )
}

export default App
