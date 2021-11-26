import { useState } from "react";

export default function useVisualMode(initial) {
    const [mode, setMode] = useState(initial);
    const [history, setHistory] = useState([initial]);
    
  // move to the next component and save the previous state to history
    const transition = (newMode, replace = false) => {
      if (replace) {
        history.pop()
        setHistory(history);
      }
      setHistory((prev) => [...prev, newMode]);
      setMode(newMode);
    };

  // go back to the previous component saved
    const back = () => {
      if (history.length > 1) {
        history.pop();
      }
      if (history.length > 0) {
        setMode(history[history.length - 1]);
      }
    };

    return { mode, transition, back };
};