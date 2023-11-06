import { useState, useEffect, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlinePlus, AiFillDelete } from "react-icons/ai";
import { Modal } from "bootstrap";
import axios from "axios";

const Pokemon = (props) => {
    const [pokemonList, setPokemonList] = useState([]);

    //서버에서 pokemon list를 불러와서 state에 설정하는 코드
    const loadPokemon = () => {
        axios({
            url: "http://localhost:8080/pokemon/",
            method: "get"
        })
            .then(response => {
                //console.log(response);
                setPokemonList(response.data);
            })
            .catch(err => { });
    };


    useEffect(() => {
        loadPokemon();
    }, []);

    // 포켓몬스터 삭제
    // - 이제는 state에서 삭제하는 것이 아니라 서버에 통신을 보낸 뒤 목록을 갱신하면 된다
    const deletePokemon = (pokemon) => {
        // axios({옵션}).then(성공시 실행할 함수).cath(실패시 실행할 함수);
        axios({
            url: `http://localhost:8080/pokemon/${pokemon.no}`,
            method: "delete"
        })
            .then(response => {
                loadPokemon(); // 목록 갱신
            })
            .catch(err => { });
    };

    const eidtPokemon = (pokemon) => {

    };

    // modal 관련된 처리
    const bsModal = useRef();
    const openModal = () => {
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    const closeModal = () => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    };

    // 등록과 관련된 state
    const [pokemon, setPokemon] = useState({
        name:"",
        type:""
    });
    const changePokemon = (e) => {
        setPokemon({
            ...pokemon,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>포켓몬스터 관리</h1>
                    <p>React CRUD 연습 예제</p>
                </div>
            </div>

            {/* 추가 버튼 */}
            <div className="row mt-4">
                <div className="col">
                    <button className="btn btn-success" onClick={openModal}>
                        <AiOutlinePlus />
                        추가
                    </button>
                </div>
            </div>

            {/* 출력 위치 */}
            <div className="row mt-4">
                <div className="col">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>이름</th>
                                <th>속성</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map(pokemon => (
                                <tr key={pokemon.no}>
                                    <td>{pokemon.no}</td>
                                    <td>{pokemon.name}</td>
                                    <td>{pokemon.type}</td>
                                    <td><FaRegEdit className="text-warning ms-1" />
                                    </td>
                                    <td><FaXmark className="text-danger ms-1" onClick={e => deletePokemon(pokemon)} />
                                    </td>
                                    <td></td>
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
                            <h5 className="modal-title">제목</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label">이름</label>
                                    <input type="text" name="name" className="form-control" 
                                    value={pokemon.name} onChange={changePokemon}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label className="form-label">속성</label>
                                    <input type="text" name="type" className="form-control" 
                                    vlaue={pokemon.type} onChange={changePokemon}/>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeModal}>닫기</button>
                            <button className="btn btn-success">저장</button>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default Pokemon;