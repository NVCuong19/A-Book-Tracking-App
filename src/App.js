import React from 'react'
import Book from './components/book'
import { Link, Routes, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
    state = {
        query: '',
        books: [],
        bookshelf: {
            currentlyReading: [],
            wantToRead: [],
            read: []
        }
    }

    componentDidMount() {
        BooksAPI.getAll().then((res) => {
            let bookshelf = {
                currentlyReading: [],
                wantToRead: [],
                read: [],
            }
            res.forEach(_book => {
            switch(_book.shelf) {
                case 'read':
                bookshelf.read.push(_book);
                break;
                case "wantToRead":
                bookshelf.wantToRead.push(_book);
                break;
                default:
                bookshelf.currentlyReading.push(_book);
            }
            });
            this.setState({bookshelf});
        })
    }

    handleChange(query) {
        this.setState({query})
        BooksAPI.search(query).then((res) => {
            let books = !res || res.error ? [] : res;
            books.forEach((_book) => {
                if(this.state.bookshelf.currentlyReading.filter(b => b.id === _book.id).length > 0) {
                    _book.shelf = 'currentlyReading';
                } else if(this.state.bookshelf.read.filter(b => b.id === _book.id).length > 0) {
                    _book.shelf = 'read';
                } else if(this.state.bookshelf.wantToRead.filter(b => b.id === _book.id).length > 0) {
                    _book.shelf = 'wantToRead';
                } else {
                    _book.shelf = 'move';
                }
            });
            this.setState({books});
        });
    }

    updateBookshelf(_isSearchPage, _destination, _book) {
        this.setState(prevState => {
            if(_isSearchPage === "true") {
                prevState.books = prevState.books.filter(b => b.id !== _book.id);

            }
            if(_book.shelf !== "move") {
                prevState.bookshelf[_book.shelf] = prevState.bookshelf[_book.shelf].filter(b => b.id !== _book.id);
            }
            _book.shelf = _destination;
            prevState.bookshelf[_destination].push(_book);
            return prevState;
        });

    }

    render() {
        const {currentlyReading, wantToRead, read} = this.state.bookshelf
        return (
        <div className="app">
            <Routes>
                <Route exact path='/' element = {
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                        <div>
                            <div className="bookshelf">
                            <h2 className="bookshelf-title">Currently Reading</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    {
                                        currentlyReading.map((_book) => (
                                            <Book key={_book.id} book={_book} issearchpage={"false"} onChangeOnBookshelf={this.updateBookshelf.bind(this)}/>    
                                        ))
                                    }
                                </ol>
                                
                            </div>
                            </div>
                            <div className="bookshelf">
                            <h2 className="bookshelf-title">Want to Read</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    {
                                        wantToRead.map((_book) => (
                                            <Book key={_book.id} book={_book} issearchpage={"false"} onChangeOnBookshelf={this.updateBookshelf.bind(this)}/>    
                                        ))
                                    }
                                </ol>
                                
                            </div>
                            </div>
                            <div className="bookshelf">
                            <h2 className="bookshelf-title">Read</h2>
                            <div className="bookshelf-books">
                                <ol className="books-grid">
                                    {
                                        read.map((_book) => (
                                            <Book key={_book.id} book={_book} issearchpage={"false"} onChangeOnBookshelf={this.updateBookshelf.bind(this)}/>    
                                        ))
                                    }
                                </ol>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="open-search">
                        <Link to='/search' state={{ testvalue: "hello" }}>
                            <button>Add a book</button>
                        </Link>  
                        </div>
                    </div>
                } />
                <Route path='/search' element = {
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link to = '/' >
                                <button className="close-search">Close</button>
                            </Link>
                            <div className="search-books-input-wrapper">
                                <input type="text" value={this.state.query} onChange={(event) => {this.handleChange(event.target.value)}} placeholder="Search by title or author"/>
                            </div>
                        </div>
                        <div className="search-books-results">

                            <ol className="books-grid">
                                {
                                    this.state.books.length === 0 ? 'No matching results' :
                                    this.state.books.map((_book) => (
                                        <Book key={_book.id} book={_book} issearchpage={"true"} onChangeOnBookshelf={this.updateBookshelf.bind(this)}/>    
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                } />
            </Routes>
            
        </div>
        )
    }

}

export default BooksApp
