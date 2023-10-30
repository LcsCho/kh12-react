import { useState } from 'react';

const Exam04 = () => {
  const [text, setText] = useState('');
  const maxBytes = 1000;

  const handleChange = (event) => {
    const inputText = event.target.value;
    const byteCount = new TextEncoder().encode(inputText).length;
    
    if (byteCount <= maxBytes) {
      setText(inputText);
    }
  };

  return (
    <>
      <h1>과제</h1>
      <h2>(Q) 주말에 뭐하세요?</h2>
      <textarea value={text} onChange={handleChange} />
      <p>{new TextEncoder().encode(text).length} / {maxBytes} bytes</p>
    </>
  );
};

export default Exam04;
