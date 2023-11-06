import { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";

import "./Book.css";

const Book = (props) => {
    const [bookList, setBookList] = useState([]);

    const loadBook = () => {
        axios({
            url:"http://localhost:8080/book/",
            method:"get"
        })
        .then(response=>{
            setBookList(response.data);
        })
        .catch(err=>{});
    }
    useEffect(() => {
        loadBook();
    }, []);

    const deleteBook = (book) => {
        axios({
            url:`http://localhost:8080/book/${book.bookId}`,
            method:"delete"
        })
        .then(response=>{
            loadBook();
        })
        .catch(err=>{});
      };
    
    const editBook = (book) => {


    };
    

    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>도서 목록</h1>
                    <p>React CRUD 연습 예제</p>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th className="pc-only">번호</th>
                                <th>제목</th>
                                <th>저자</th>
                                <th className="pc-only">출판일</th>
                                <th>출판사</th>
                                <th>판매가</th>
                                <th className="pc-only">페이지</th>
                                <th className="pc-only">장르</th>
                                <th>수정</th>
                                <th>삭제</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookList.map(book => (
                                <tr key={book.bookId}>
                                    <td className="pc-only">{book.bookId}</td>
                                    <td>{book.bookTitle}</td>
                                    <td>{book.bookAuthor}</td>
                                    <td className="pc-only">{book.bookPublicationDate}</td>
                                    <td>{book.bookPublisher}</td>
                                    <td className="pc-only">{book.bookPrice}</td>
                                    <td className="pc-only">{book.bookPageCount}</td>
                                    <td>{book.bookGenre}</td>
                                    <td><FaRegEdit className="text-warning ms-1" onClick={e => editBook(book)} />
                                    </td>
                                    <td><FaXmark className="text-danger ms-1" onClick={e => deleteBook(book)} />
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Book;