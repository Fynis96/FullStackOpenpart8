import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ME } from '../queries'

const Recommended = (props) => {
  const result = useQuery(ME)
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])

  useEffect(() => {
    setBooks([...props.allBooks])
  }, [props.allBooks])

  useEffect(() => {
    if(result.data){
    setFilteredBooks(
      books.filter((b) => b.genres.indexOf(result.data.me.favoriteGenre) !== -1)
    )
    }
  }, [result, books])


  if (!props.show){
    return null
  }

  if (result.loading) {
    return (
      <div>
        loading...
      </div>
    )
  }

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre: {result.data.me.favoriteGenre}
      </div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended