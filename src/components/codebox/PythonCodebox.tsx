import { useState, useCallback } from 'react';
import Codebox from "./Codebox.tsx";

interface PythonExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
    variables?: Record<string, any>;
}

interface PythonCodeBlockProps {
    initialCode?: string;
    className?: string;
    showLineNumbers?: boolean;
    readOnly?: boolean;
}

const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({
    initialCode = "",
    className = "",
    showLineNumbers = true,
    readOnly = false
}) => {
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<string>("No output yet...");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);

    const cleanCode = useCallback((str: string = ""): string => {
        if (!str || str.trim().length === 0) return "";

        const lines = str.split("\n");

        // Find minimum indentation (excluding empty lines)
        let minIndent = Infinity;
        const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

        if (nonEmptyLines.length === 0) return "";

        for (const line of nonEmptyLines) {
            const indent = line.length - line.trimStart().length;
            minIndent = Math.min(minIndent, indent);
        }

        // Remove common indentation
        const cleanedLines = lines.map((line) => {
            if (line.trim().length === 0) return "";
            return line.slice(minIndent);
        });

        // Remove leading and trailing empty lines
        while (cleanedLines.length > 0 && cleanedLines[0].trim().length === 0) {
            cleanedLines.shift();
        }
        while (
            cleanedLines.length > 0 &&
            cleanedLines[cleanedLines.length - 1].trim().length === 0
        ) {
            cleanedLines.pop();
        }

        return cleanedLines.join("\n");
    }, []); 

    const displayError = useCallback((message: string) => {
        setError(message);
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 5000);
    }, []);

    const handleCodeChange = useCallback((value: string) => {
        setCode(value);
    }, []);

    const runCode = useCallback(async () => {
        const cleanedCode = cleanCode(code);

        if (!cleanedCode) {
            displayError("Please enter some Python code to run");
            return;
        }

        setIsRunning(true);
        setOutput("Executing code...");

        fetch("http://127.0.0.1:8787/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: cleanedCode }),
        })
            .then(response => response.json())
            .then(result => {
                const output = result.output || "Code executed successfully (no output)";
                let displayOutput = output;
                if (result.variables && Object.keys(result.variables).length > 0) {
                    displayOutput += "\n\nVariables:\n" + JSON.stringify(result.variables, null, 2);
                }
                setOutput(displayOutput);
            })
            .catch(err => {
                console.warn("Fetch error:", err.message);
                setOutput(`Error: ${err.message}`);
            });
        setIsRunning(false);

    }, [code, cleanCode, displayError]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            runCode();
        }
    }, [runCode]);

    return (
        <div className={`flex gap-4 ${className} mx-10 my-4`}>
            <div className="min-w-[900px] max-w-[1200px] w-full mx-auto flex flex-col gap-2">
                <label className="text-lg font-semibold">Python Code:</label>

                <div onKeyDown={handleKeyDown}>
                    <Codebox
                        data={code}
                        textChangeHandler={handleCodeChange}
                        readOnly={readOnly}
                        className="rounded-md"
                        codeMode={true}
                        language="python"
                        basicSetup={{
                            lineNumbers: showLineNumbers,
                        }}
                    />
                </div>

                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="btn btn-primary"
                >
                    {isRunning ? "Running..." : "Run Code"}
                </button>
            </div>

            <div className="w-[600px] mx-auto flex flex-col gap-2">
                <label className="text-lg font-semibold">Output:</label>
                <div className="w-full h-[400px] p-4 border border-base-300 rounded-lg bg-base-200 font-mono text-sm whitespace-pre-wrap overflow-auto">
                    {showError ? error : output}
                </div>
            </div>
        </div>
    );
};

export default PythonCodeBlock;