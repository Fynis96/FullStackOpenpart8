import { useState, useEffect } from 'react'

const Books = (props) => {
  const [filteredBooks, setFilteredBooks] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [books, setBooks] = useState([])


  useEffect(() => {
    setBooks([...props.allBooks])
    let genreList = ['All genres']
    books.forEach((book) => {
      book.genres.forEach((genre) => {
        if (genreList.indexOf(genre) === -1) {
          genreList.push(genre)
        }
      })
    })
    setGenres(genreList)
    setSelectedGenre('All genres')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.allBooks])

  useEffect(() => {
    if (selectedGenre === 'All genres') {
      setFilteredBooks(books)
    } else {
      setFilteredBooks(
        books.filter((b) => b.genres.indexOf(selectedGenre) !== -1)
      )
    }
  }, [books, selectedGenre])

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
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
      <div>
        {genres.map((genre) => (
          <button onClick={() => setSelectedGenre(genre)} key={genre}>
            {genre}
          </button>  
        ))}
      </div>
    </div>
  )
}

export default Books
