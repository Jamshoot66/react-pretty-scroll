import React from "react";
import "./App.css";
import PrettyScroll from "react-pretty-scroll";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PrettyScroll isVertical width={"500px"} height={"500px"} isDraggable>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#F00",
              width: 300,
              height: 1000,
            }}
          >
            SOME
          </div>
        </PrettyScroll>
      </header>
    </div>
  );
}

export default App;
