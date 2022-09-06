// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorage = (key, defaultValue = '', {serialize = JSON.stringify, deserialize = JSON.parse } = {}) => {
  const [val, setVal] = React.useState(() => {
    const valueInStorage = window.localStorage.getItem(key);
    if (valueInStorage) {
      try {
        return deserialize(valueInStorage);
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;

  })
    
  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    if (prevKeyRef.current !== key) {
      // key has changed
      window.localStorage.removeItem(key);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(val));
  }, [key, val, serialize])

  return [val, setVal];
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const [name, setName] = React.useState(() => window.localStorage.getItem('name') ?? initialName);
  
  const [name, setName] = useLocalStorage('name', '');

  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  
  // React.useEffect(() => {
  //   window.localStorage.setItem('name', name);
  // }, [name])

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
