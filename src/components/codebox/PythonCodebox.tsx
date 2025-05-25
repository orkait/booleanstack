import { useState, useCallback, useRef, useEffect } from 'react';
import Codebox from "./Codebox.tsx";
import { ENV } from '@env';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ResizeIcon from '@src/icons/ResizeIcon.tsx';
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";

interface PythonCodeBlockProps {
    initialCode?: string;
    className?: string;
    showLineNumbers?: boolean;
    readOnly?: boolean;
}

const PythonCodeBlock: React.FC<PythonCodeBlockProps> = ({
    initialCode = "print([x for x in range(10)])",
    className = "h-full",
    showLineNumbers = true,
    readOnly = false
}) => {
    const [code, setCode] = useState<string>(initialCode);
    const [output, setOutput] = useState<string>("No output yet...");
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showError, setShowError] = useState<boolean>(false);
    const [variables, setVariables] = useState<Record<string, any>>({});
    const [leftWidth, setLeftWidth] = useState<number>(60); // Percentage
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [editorTheme, setEditorTheme] = useState<string>("dark");
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Initial theme setup
        const initialTheme = document.body.getAttribute('data-theme') as 'light' | 'dark' || 'light';
        setCurrentTheme(initialTheme);

        // Listen for theme changes
        const handleThemeChange = (e: CustomEvent) => {
            setCurrentTheme(e.detail.theme);
        };

        window.addEventListener('theme-change', handleThemeChange as EventListener);

        return () => {
            window.removeEventListener('theme-change', handleThemeChange as EventListener);
        };
    }, []);

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

        fetch(ENV.PYTHON_CODE_RUNNER_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: cleanedCode }),
        })
            .then(response => response.json())
            .then(result => {
                setOutput(result.output || "Code executed successfully (no output)");

                if (result.variables && Object.keys(result.variables).length > 0) {
                    setVariables(result.variables);
                }
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

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Constrain between 30% and 80%
        const constrainedWidth = Math.min(Math.max(newLeftWidth, 30), 80);
        setLeftWidth(constrainedWidth);
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <PanelGroup direction="horizontal" className='min-h-fit'>
            <Panel defaultSize={70} minSize={0} className='h-full min-h-full'>
                <Codebox
                    style={{
                        height: '100%',
                        width: '100%'
                    }}
                    data={code}
                    textChangeHandler={handleCodeChange}
                    readOnly={readOnly}
                    className="rounded-md mt-0 bg-red-500"
                    codeMode={true}
                    language="python"
                    basicSetup={{
                        lineNumbers: showLineNumbers,
                    }}
                    theme={currentTheme === 'dark' ? githubDark : githubLight}
                />
            </Panel>
            <PanelResizeHandle
                className='flex items-center justify-center opacity-50'
            >
                <ResizeIcon
                    type="drag"
                    data-direction="vertical"
                    width={20}
                    height={20}
                />
            </PanelResizeHandle>
            <Panel defaultSize={30} minSize={0}>
                <PanelGroup direction="vertical">
                    <Panel>
                        <div className="flex flex-col flex-1 h-full relative">
                            <label className="text-lg font-semibold">Output:</label>
                            <div className="flex-1 overflow-auto border-white border-[1px] p-4 rounded-lg bg-base-200 font-mono text-sm whitespace-pre-wrap">
                                <div className="flex flex-col gap-2">
                                    {showError ? error : output}
                                </div>
                            </div>
                            <div className='absolute right-0 top-0'>
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className="btn btn-secondary btn-xs mr-2"
                                >
                                    {isRunning ? "Running..." : "Run Code"}
                                </button>
                            </div>
                        </div>
                    </Panel>
                    <PanelResizeHandle
                        className='flex m-auto my-1'
                    >
                        <ResizeIcon
                            type="drag"
                            data-direction="vertical"
                            width={20}
                            height={20}
                        />
                    </PanelResizeHandle>
                    <Panel>
                        <div className="flex flex-col h-full mt-0">
                            <label className="text-lg font-semibold">Variables:</label>
                            <div className="flex-1 overflow-auto border-white border-[1px] p-4 rounded-lg bg-base-200 font-mono text-sm whitespace-pre-wrap">
                                <div className="flex flex-col gap-2">
                                    {Object.entries(variables).map(([key, value]) => (
                                        <div key={key}>{key}: {value}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Panel>
                </PanelGroup>
            </Panel>
        </PanelGroup>
    );
};

export default PythonCodeBlock;