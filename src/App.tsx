import { useState, useRef } from 'react';
import './App.css';
import Editor from "@monaco-editor/react";
import init, { evaluate } from '../pkg/sag';

function App() {
  const editorRef = useRef(null);
  const [codeOutput, setCodeOutput] = useState("");

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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        run();
      }
    );
  };

  return (
    <div className={`min-h-screen bg-gray-900 text-white`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Sag Playground</h2>
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
              theme="vs-dark"
              defaultValue='"Hello World!!" -> print'
              onMount={handleEditorDidMount}
	      options={{
		lineNumbers: "on",
	      }}
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
