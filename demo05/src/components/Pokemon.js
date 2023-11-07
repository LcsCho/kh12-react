import {useState, useEffect, useRef} from "react";
import axios from "axios";

import {LiaEdit} from "react-icons/lia";
import {AiFillDelete, AiOutlinePlus} from "react-icons/ai";
import { Modal } from "bootstrap";

const Pokemon = (props)=>{
    const [pokemonList, setPokemonList] = useState([]);

    //서버에서 pokemon list를 불러와서 state에 설정하는 코드
    const loadPokemon = ()=>{
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/pokemon/`,
            method:"get"
        })
        .then(response=>{
            //console.log(response);
            setPokemonList(response.data);
        })
        .catch(err=>{});
    };

    useEffect(()=>{
        loadPokemon();
    }, []);

    //포켓몬스터 삭제
    //- 이제는 state에서 삭제하는 것이 아니라 서버에 통신을 보낸 뒤 목록을 갱신하면 된다
    const deletePokemon = (pokemon) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if(choice === false) return;

        //axios({옵션}).then(성공시 실행할 함수).catch(실패시 실행할 함수);
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/pokemon/${pokemon.no}`,
            method:"delete"
        })
        .then(response=>{
            loadPokemon();//목록 갱신
        })
        .catch(err=>{});
    };

    //modal 관련된 처리
    const bsModal = useRef();
    const openModal = ()=>{
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    const closeModal = ()=>{
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();

        clearPokemon();
    };

    //등록과 관련된 state
    const [pokemon, setPokemon] = useState({name:"" , type:""});
    const changePokemon = (e)=>{
        setPokemon({
            ...pokemon,
            [e.target.name] : e.target.value
        });
    };
    const clearPokemon = ()=>{
        setPokemon({name:"", type:""});
    };

    //axios로 서버에 등록 요청을 보낸 뒤 등록이 성공하면 목록을 갱신하도록 처리
    const savePokemon = ()=>{
        //입력값 검사 후 차단 코드 추가

        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/pokemon/`,
            method:"post",
            data:pokemon
        })
        .then(response=>{//성공했다면
            loadPokemon();//목록을 갱신하고
            closeModal();//모달을 닫아라
        })
        .catch(err=>{});    
    };

    //포켓몬스터 수정 창 열기
    //- target은 수정 버튼을 누른 행의 포켓몬스터 정보
    //- target의 정보를 pookemon으로 카피 후 모달 열기
    const editPokemon = (target)=>{
        setPokemon({...target});
        openModal();
    };

    //포켓몬스터 수정 처리
    const updatePokemon = ()=>{
        //검사 후 차단 처리

        const {no, name, type} = pokemon;
        axios({
            url:`${process.env.REACT_APP_REST_API_URL}/pokemon/${no}`,
            method:"put",
            data:{
                name : name, 
                type : type
            }
        })
        .then(response=>{
            loadPokemon();
            closeModal();
        })
        .catch(err=>{});
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
                                <th>번호</th>
                                <th>이름</th>
                                <th>속성</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pokemonList.map(pokemon=>(
                                <tr key={pokemon.no}>
                                    <td>{pokemon.no}</td>
                                    <td>{pokemon.name}</td>
                                    <td>{pokemon.type}</td>
                                    <td>
                                        {/* 아이콘 자리 */}
                                        <LiaEdit className="text-warning"
                                            onClick={e=>editPokemon(pokemon)}/>
                                        <AiFillDelete className="text-danger" 
                                            onClick={e=>deletePokemon(pokemon)}/>                                        
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
                            {pokemon.no === undefined ? 
                                '신규 몬스터 등록' : `${pokemon.no}번 몬스터 수정`}
                        </h5>
                        <button type="button" className="border-0 bg-transparent" 
                                                                                    onClick={closeModal}>
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

                        <div className="row mt-4">
                            <div className="col">
                                <label className="form-label">속성</label>
                                <input type="text" name="type" className="form-control"
                                        value={pokemon.type} onChange={changePokemon}/>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={closeModal}>닫기</button>
                        {pokemon.no === undefined ? 
                            <button className="btn btn-success" onClick={savePokemon}>저장</button>
                            : 
                            <button className="btn btn-success" onClick={updatePokemon}>수정</button>
                        }
                        
                    </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Pokemon;