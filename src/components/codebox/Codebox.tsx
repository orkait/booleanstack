import CodeMirrorComponent from "@uiw/react-codemirror";
import type { BasicSetupOptions } from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";

import React from "react";

export const LangList = {
    javascript: "javascript",
    html: "html",
    css: "css",
    json: "json",
    python: "python",
    xml: "xml",
    sql: "sql",
    java: "java",
    rust: "rust",
    cpp: "cpp",
    php: "php",
};

export type LangListType = keyof typeof LangList;


declare type Extension = {
    extension: Extension;
} | readonly Extension[];

type codeMirrorProps = {
    data: string;
    readOnly?: boolean;
    textChangeHandler: (value: string) => void;
    className?: string;
    language?: LangListType;
    basicSetup?: BasicSetupOptions,
    extensions?: Extension[] | undefined,
    otherProps?: any,
    codeMode?: boolean,
    hasRoundedBorder?: boolean,
}

const classes = {
    codemirror: `shadow text-[16px] bg-transparent border-[1px] p-3 rounded-b-md rounded-tr-md min-h-[calc(100vh_-_200px)]`
}

const Codebox: React.FC<codeMirrorProps> = (props) => {
    const { data, readOnly, textChangeHandler, className, language, basicSetup, codeMode, otherProps } = props;

    return (
        <CodeMirrorComponent
            className={`${classes.codemirror} ${className}`}
            style={{
                outline: "none",
            }}
            basicSetup={{
                lineNumbers: true,
                autocompletion: true,
                highlightActiveLineGutter: false,
                highlightSpecialChars: false,
                foldGutter: false,
                closeBrackets: true,
                tabSize: 4,
                highlightActiveLine: true,
                highlightSelectionMatches: false,
                ...basicSetup
            }}
            readOnly={readOnly || false}
            indentWithTab={true}
            suppressHydrationWarning={true}
            autoFocus={true}
            extensions={[EditorView.lineWrapping, python()]}
            minHeight="calc(100vh - 200px)"
            value={data}
            theme={"dark"}
            onChange={(value: any) => {
                textChangeHandler(value);
            }}
            {...otherProps}
        />
    );
};

export default Codebox;
