// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary';

// class ErrorBoundary extends React.Component {
//   state = { error: null }
//
//   static getDerivedStateFromError(error) {
//     return { error }
//   }
//
//   render() {
//     if (this.state.error) {
//       return <this.props.FallbackComponent error={this.state.error} />
//     }
//
//     return this.props.children;
//   }
// }

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [ state, setState ] = React.useState({
    pokemon: null,
    error: null,
    // idle | pending | resolved | rejected
    status: 'idle'
  });

  React.useEffect(() => {
    if (!pokemonName) {
      return;
    }
    setState({
      pokemon: null,
      status: 'pending'
    });

    fetchPokemon(pokemonName).then(data => {
      setState({
        pokemon: data,
        status: 'resolved'
      });
    })
    .catch(error => {
      setState({
        error: error,
        status: 'rejected'
      });
    })

  }, [pokemonName]);

  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null.
  // (This is to enable the loading state when switching between different pokemon.)
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => {/* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  // 💣 remove this
  if (state.status === 'rejected') {
    throw state.error;
  }

  if (state.status === 'idle') {
    return 'Submit a Pokemon'
  }

  if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return (
    <PokemonDataView pokemon={state.pokemon} />
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary 
          FallbackComponent={ErrorFallback} 
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]} 
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
