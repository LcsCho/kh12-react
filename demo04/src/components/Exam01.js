import { useEffect, useState, useRef } from "react";
import { Modal } from "bootstrap/dist/js/bootstrap.esm";

const Exam01 = () => {
    const [todoList, setTodoList] = useState([
        { no: 1, title: "학원가기", type: "공부" },
        { no: 2, title: "영어단어외우기", type: "공부" },
        { no: 3, title: "헬스장가기", type: "운동" },
        { no: 4, title: "친구만나기", type: "일상" }
    ]);
    const [backup, setBackup] = useState([]);
    const [data, setData] = useState({
        no: "",
        title: "",
        type: "",
    });

    const bsModal = useRef();

    const changeData = e => {
        const newData = {
            ...data,
            [e.target.name]: e.target.value
        };
        setData(newData);
    };

    useEffect(() => {
        setBackup(todoList.map(list => {
            const newlist = { ...list };
            return newlist;
        }));
    }, []);


    const changeToEdit = (target) => {
        const newTodoList = todoList.map(list => {
            if (list.no === target.no) {
                return {
                    ...list,
                    edit: true
                };
            }
            return list;
        });

        setTodoList(newTodoList);
    };

    const changelist = (target, e) => {
        const newTodoList = todoList.map(list => {
            if (list.no === target.no) {
                return {
                    ...list,
                    [e.target.name]: e.target.value
                }
            }
            return list;
        });
        setTodoList(newTodoList);
    };

    const cancellist = (target) => {

        const findResult = backup.filter(list => list.no === target.no);
        const newTodoList = todoList.map(list => {
            if (list.no === target.no) {
                return {
                    ...findResult[0],
                    edit: false
                };
            }
            return list;
        });

        setTodoList(newTodoList);
    };
    const savelist = (target) => {

        const newBackup = backup.map(list => {
            if (list.no === target.no) {
                return {
                    ...target,
                    edit: false
                };
            }
            return list;
        });
        setBackup(newBackup);

        const newTodoList = todoList.map(list => {
            if (list.no === target.no) {
                return {
                    ...list,
                    edit: false
                };
            }
            return list;
        });

        setTodoList(newTodoList);
    };

    const deletelist = (target) => {
        const newTodoList = todoList.filter(list => list.no !== target.no);
        setTodoList(newTodoList);

        const newBackup = backup.filter(list => list.no !== target.no);
        setBackup(newBackup);
    };

    const addlist = e => {

        const no = todoList.length == 0 ? 1 : todoList[todoList.length - 1].no + 1;

        const newTodoList = [
            ...todoList,
            {
                ...data,
                edit: false,
                no: no
            }
        ];
        setTodoList(newTodoList);

        const newBackup = [
            ...backup,
            {
                ...data,
                edit: false,
                no: no
            }
        ];
        setBackup(newBackup);

        setData({
            no: "",
            title: "",
            type: "",
        });

        closeModal();
    };

    const cancelAddlist = () => {
        setData({
            no: "",
            title: "",
            type: "",
        });

        closeModal();
    };

    const openModal = () => {
        var modal = new Modal(bsModal.current); // React style
        modal.show();
    };
    const closeModal = () => {
        var modal = Modal.getInstance(bsModal.current); // React style
        modal.hide();
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-10 offset-md-1">

                    <div className="p-4 text-light bg-dark rounded">
                        <h1>할 일 목록</h1>
                    </div>

                    <div className="row mt-4">
                        <div className="col">
                            <button type="button" className="btn btn-primary"
                                onClick={openModal}>
                                신규등록
                            </button>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col">

                            <table className="table table-hover" data-bs-theme="light">
                                <thead>
                                    <tr>
                                        <th width="20%">번호</th>
                                        <th width="30%">제목</th>
                                        <th width="20%">종류</th>
                                        <th width="30%">관리</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todoList.map((list, index) => (
                                        list.edit ? (
                                            <tr key={list.no}>
                                                <td>{list.no}</td>
                                                <td>
                                                    <input className="form-control" type="text" name="title"
                                                        value={list.title} onChange={e => changelist(list, e)} />
                                                </td>
                                                <td>
                                                    <input className="form-control" type="text" name="type"
                                                        value={list.type} onChange={e => changelist(list, e)} />
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-secondary"
                                                        onClick={e => cancellist(list)}>취소</button>
                                                    <button className="btn btn-sm btn-success ms-1"
                                                        onClick={e => savelist(list)}>완료</button>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={list.no}>
                                                <td>{list.no}</td>
                                                <td>{list.title}</td>
                                                <td>{list.type}</td>
                                                <td>
                                                    <button className="btn btn-sm btn-warning"
                                                        onClick={e => changeToEdit(list)}>수정</button>
                                                    <button className="btn btn-sm btn-danger ms-1"
                                                        onClick={e => deletelist(list)}>삭제</button>
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

                </div>
            </div>

            {/* Modal */}
            <div className="modal fade" ref={bsModal} id="exampleModal"
                data-bs-backdrop="static" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">리스트 등록</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">타이틀</label>
                                    <input className="form-control" name="title" value={data.title} onChange={changeData} />
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col">
                                    <label className="form-label">종류</label>
                                    <input className="form-control" name="type" value={data.type} onChange={changeData} />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={cancelAddlist}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={addlist}>추가</button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Exam01;