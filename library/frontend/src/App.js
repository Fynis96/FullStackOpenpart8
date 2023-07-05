import { useState } from 'react'
import { useApolloClient, useQuery } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'
import LoginForm from './components/LoginForm'
import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const result = useQuery(ALL_AUTHORS)
  const bookResult = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  if (result.loading || bookResult.loading) {
    return <div>loading...</div>
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
        />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommend')}>recommend</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} allAuthors={result.data.allAuthors}/>

      <Books show={page === 'books'} allBooks={bookResult.data.allBooks} />

      <NewBook show={page === 'add'} />

      <Recommended show={page ==='recommend'} allBooks={bookResult.data.allBooks} />
    </div>
  )
}

export default App
