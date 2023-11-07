import {useState, useEffect, useRef} from "react";
import axios from "axios";

import {LiaEdit} from "react-icons/lia";
import {AiFillDelete, AiOutlinePlus} from "react-icons/ai";
import { Modal } from "bootstrap";

const Book = (props)=>{
    const [bookList, setBookList] = useState([]);

    const loadBook = ()=>{
        axios({
            url:"http://localhost:8080/book/",
            method:"get"
        })
        .then(response=>{
            setBookList(response.data);
        })
        .catch(err=>{});
    };

    useEffect(()=>{
        loadBook();
    }, []);

    const deleteBook = (book) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if(choice === false) return;

        axios({
            url:`http://localhost:8080/book/${book.bookId}`,
            method:"delete"
        })
        .then(response=>{
            loadBook();//목록 갱신
        })
        .catch(err=>{});
    };

    const bsModal = useRef();
    const openModal = ()=>{
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    const closeModal = ()=>{
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();

        clearBook();
    };

    const [book, setBook] = useState({
        bookTitle:"",
        bookAuthor:"",
        bookPublicationDate:"",
        bookPrice:"",
        bookPublisher:"",
        bookPageCount:"",
        bookGenre:"",
    });
    const changeBook = (e)=>{
        setBook({
            ...book,
            [e.target.name] : e.target.value
        });
    };
    const clearBook = ()=>{
        setBook({
            bookTitle:"",
            bookAuthor:"",
            bookPublicationDate:"",
            bookPrice:"",
            bookPublisher:"",
            bookPageCount:"",
            bookGenre:"",
        });
    };

    //axios로 서버에 등록 요청을 보낸 뒤 등록이 성공하면 목록을 갱신하도록 처리
    const saveBook = ()=>{
        //입력값 검사 후 차단 코드 추가

        axios({
            url:"http://localhost:8080/book/",
            method:"post",
            data:book
        })
        .then(response=>{//성공했다면
            loadBook();//목록을 갱신하고
            closeModal();//모달을 닫아라
        })
        .catch(err=>{});    
    };

    const editBook = (target)=>{
        setBook({...target});
        openModal();
    };

    const updateBook = ()=>{

        const {bookId, bookTitle, bookAuthor, bookPublicationDate, 
            bookPrice, bookPublisher, bookPageCount, bookGenre
        } = book;
        axios({
            url:`http://localhost:8080/book/${bookId}`,
            method:"put",
            data:{
                bookTitle: bookTitle,
                bookAuthor: bookAuthor,
                bookPublicationDate: bookPublicationDate,
                bookPrice: bookPrice,
                bookPublisher: bookPublisher,
                bookPageCount: bookPageCount,
                bookGenre: bookGenre
            }
        })
        .then(response=>{
            loadBook();
            closeModal();
        })
        .catch(err=>{});
    };

    return (
        <>
            
            <div className="row">
                <div className="col">
                    <h1>도서 관리</h1>
                    <p>React CRUD 연습 예제</p>
                </div>
            </div>

            {/* 추가 버튼 */}
            <div className="row mt-4">
                <div className="col text-end">
                    <button className="btn btn-success" onClick={openModal}>
                        <AiOutlinePlus/>
                        추가
                    </button>
                </div>
            </div>
            
            {/* 출력 위치 */}
            <div className="row mt-4">
                <div className="col">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>도서번호</th>
                                <th>제목</th>
                                <th>저자</th>
                                <th>출간일</th>
                                <th>판매가</th>
                                <th>출판사</th>
                                <th>페이지</th>
                                <th>장르</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookList.map(book=>(
                                <tr key={book.bookId}>
                                    <td>{book.bookId}</td>
                                    <td>{book.bookTitle}</td>
                                    <td>{book.bookAuthor}</td>
                                    <td>{book.bookPublicationDate}</td>
                                    <td>{book.bookPublisher}</td>
                                    <td>{book.bookPrice}</td>
                                    <td>{book.bookPageCount}</td>
                                    <td>{book.bookGenre}</td>
                                    <td>
                                        {/* 아이콘 자리 */}
                                        <LiaEdit className="text-warning"
                                            onClick={e=>editBook(book)}/>
                                        <AiFillDelete className="text-danger" 
                                            onClick={e=>deleteBook(book)}/>                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" ref={bsModal} 
                        data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" >
                            {book.bookId === undefined ? 
                                '신규 도서 등록' : `${book.bookId}번 도서 수정`}
                        </h5>
                        <button type="button" className="border-0 bg-transparent" 
                                                                                    onClick={closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="row">
                            <div className="col">
                                <label className="form-label">제목</label>
                                <input type="text" name="bookTitle" className="form-control"
                                        value={book.bookTitle} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">저자</label>
                                <input type="text" name="bookAuthor" className="form-control"
                                        value={book.bookAuthor} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">출간일</label>
                                <input type="date" name="bookPublicationDate" className="form-control"
                                        value={book.bookPublicationDate} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">판매가</label>
                                <input type="number" name="bookPrice" className="form-control"
                                        value={book.bookPrice} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">출판사</label>
                                <input type="text" name="bookPublisher" className="form-control"
                                        value={book.bookPublisher} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">페이지</label>
                                <input type="number" name="bookPageCount" className="form-control"
                                        value={book.bookPageCount} onChange={changeBook}/>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">장르</label>
                                <input type="text" name="bookGenre" className="form-control"
                                        value={book.bookGenre} onChange={changeBook}/>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>닫기</button>
                        {book.bookId === undefined ? 
                            <button className="btn btn-success" onClick={saveBook}>저장</button>
                            : 
                            <button className="btn btn-success" onClick={updateBook}>수정</button>
                        }
                        
                    </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Book;