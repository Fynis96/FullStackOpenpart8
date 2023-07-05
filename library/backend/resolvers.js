const { GraphQLError } = require("graphql");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          if (args.genre) {
            return await Book.find({
              author: author.id,
              genres: { $in: [args.genre] },
            }).populate("author");
          }
          return await Book.find({ author: author.id }).populate("author");
        }
        return null;
      }
      if (args.gerne) {
        return await Book.find({ genres: { $in: [args.genre] } }).populate(
          "author"
        );
      }
      return Book.find({}).populate("author");
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name });
      const books = await Book.find({ author: author.id });
      return books.length;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
    
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = new Author({name: args.author})
          await author.save()
        }
        catch (error) {
          throw new GraphQLError("saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
            }
        })
      }
    }
      
      const book = new Book({...args, author})

      try {
        await book.save()
      }
      catch (error) {
        throw new GraphQLError('saving book failed', {
          extensions: {
            code: "BAD_USER_INPUT",
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
      
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.born
      try {
        await author.save()
      }
      catch (error) {
        throw new GraphQLError('invalid author save', {
          extensions: {
            code: "BAD_USER_INPUT",
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
};

module.exports = resolvers