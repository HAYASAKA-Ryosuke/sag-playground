import { useState, useRef, useEffect } from 'react';
import './App.css';
import Editor from '@monaco-editor/react';
import init, { evaluate } from '../pkg/sag';

function App() {
  const editorRef = useRef(null);
  const [codeOutput, setCodeOutput] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  init();

  const run = () => {
    // @ts-ignore
    const code = editorRef.current?.getValue();
    try {
      const result = evaluate(code);
      const output = result.split('__Result__')[0].split('__ConsoleOutput__')[1];
      setCodeOutput(output);
    } catch (e: any) {
      setCodeOutput(e.toString());
    }
  };

  const handleEditorDidMount = (editor: any, _: any) => {
    editorRef.current = editor;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Sag Playground</h2>
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded shadow"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <div className="flex flex-col gap-8">
          <button
            className="self-start bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={run}
          >
            Run
          </button>
          <div className="flex-1 border border-gray-700 rounded overflow-hidden">
            <Editor
              height="50vh"
              theme={darkMode ? "vs-dark" : "vs-light"}
              defaultValue='"Hello World!!" -> print'
              onMount={handleEditorDidMount}
            />
          </div>
          <div className="flex-1 p-4 bg-gray-800 text-white rounded shadow text-left">
            <pre><code>{codeOutput}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
