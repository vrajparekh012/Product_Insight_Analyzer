import React, { useState } from "react";
import axios from "axios";

function Upload({ setData }) {

  const [file, setFile] = useState(null);

  const uploadFile = async () => {

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("http://127.0.0.1:8000/analyze", formData);

    setData(res.data);
  };

  return (
    <div>
      <h2>Upload Product Review Dataset</h2>

      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />

      <button onClick={uploadFile}>Analyze Dataset</button>
    </div>
  );
}

export default Upload;