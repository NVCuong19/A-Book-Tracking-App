import React, {Component} from 'react'

class Book extends Component {
  book = this.props.book;
  state = {
    value: this.book.shelf
  };
  updateBookshelf(event) {
    let type = event.target.value;
    if(type === 'move' || type === 'none') {return;}
    this.setState({value: type})
    this.props.onChangeOnBookshelf(this.props.issearchpage, type, this.book);
  }
  render() {
    return <li>
      {
        this.book && <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${this.book.imageLinks ? this.book.imageLinks.thumbnail : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'})` }}></div>
            <div className="book-shelf-changer">
              <select id="book" onChange={this.updateBookshelf.bind(this)} value={this.state.value}>
                <option value="move" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{this.book.title}</div>
          <div className="book-authors">
            <ol>
              { !this.book.authors ? '' :
                this.book.authors.map((author, i) => (
                  <li key={i}>{author}</li>
                ))
              }
            </ol>
          </div>
        </div>
      }
    </li>
  }
}

export default Book