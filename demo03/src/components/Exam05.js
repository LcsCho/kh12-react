import { useEffect, useState } from "react";

const Exam05 = ()=>{
    const [java, setJava] = useState(0);
    const [db, setDb] = useState(0);
    const [sb, setSb] = useState(0);
    const [tot, setTot] = useState(0);
    const [avg, setAvg] = useState(0);

    useEffect(()=>{
        setTot(java + db + sb);
    }, [java, db, sb]);
    useEffect(()=>{
        setAvg(tot/3);
    }, [tot]);
    return (
        <>
        <h1>성적계산기</h1>
        자바: <input type="number" onChange={e=>setJava(parseInt(e.target.value))}/><br/>
        데이터베이스: <input type="number" onChange={e=>setDb(parseInt(e.target.value))}/><br/>
        스프링부트: <input type="number" onChange={e=>setSb(parseInt(e.target.value))}/>
        
        <hr/>
        총점 = {tot}점, 평균 = {avg}점
        </>
    );
};

export default Exam05;