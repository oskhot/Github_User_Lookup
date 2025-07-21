import React, { useState, useCallback } from "react";
// import { useCallback } from "react/cjs/react.production.min";
import "./styles.css";

function App() {
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  const [isForked, setIsForked] = useState(false);

  const Github = `https://api.github.com/users/${userName}/repos`;

  const dataFetch = useCallback(async () => {
    try {
      const res = await fetch(Github);
      if (!res.ok) {
        throw new Error(`HTTP error! status ${res.status}`);
      }
      const values = await res.json();
      console.log(values);
      setData(filterDataOnSize(values));
      setErrMessage("");
    } catch (err) {
      // console.error("Error fetching data:", err.message);
      setErrMessage(`Invalid URL:  ${err.message}`);
      setData([]);
    }
  }, [Github]);

  const handleOnChange = (e) => {
    setUserName(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("clicked submit");
    dataFetch();
  };

  const filterDataOnSize = (values) => {
    const dataArray = Array.isArray(values) ? values : Object.values(values);
    const sortVal = dataArray.sort((a, b) => b.size - a.size);

    return sortVal;
  };

  const handleCheckboxChange = () => {
    setIsForked(!isForked);
  };



  const filteredData = data.filter((item) => isForked || !item.fork);

  return (
    <div className="App">
      <form onSubmit={handleOnSubmit}>
        <div className="input">
          <label htmlFor="username">Github username: </label>
          <input
            id="username"
            type="text"
            value={userName}
            onChange={handleOnChange}
          />
          <label htmlFor="fork">Include forks: </label>
          <input
            id="fork"
            type="checkbox"
            checked={isForked}
            onChange={handleCheckboxChange}
          />
          <button type="submit" disabled={!userName}>
            Submit
          </button>
        </div>
      </form>
      <section>
        {!errMessage && (
          <header>
            <div className="col">Name</div>
            <div className="col">Language</div>
            <div className="col">Description</div>
            <div className="col">Size</div>
            <div className="col">Fork</div>
          </header>
        )}

        {filteredData.map((list) => (
          <div key={list.id}>
            <div className="col">{list.name}</div>
            <div className="col">{list.language}</div>
            <div className="col">{list.description}</div>
            <div className="col">{list.size}</div>
            <div className="col">{list.fork ? "Yes" : "No"}</div>
          </div>
        ))}
      </section>
      <div className="error">{errMessage}</div>
    </div>
  );
}

export default App;
