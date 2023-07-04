import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $publishedInt: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $publishedInt,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author
      genres
    }
  }
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $bornInt: Int!) {
    editAuthor(name: $name, born: $bornInt) {
      name
      born
      bookCount
    }
  }
`