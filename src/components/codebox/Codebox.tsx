import CodeMirrorComponent, { oneDark, oneDarkTheme } from "@uiw/react-codemirror";
import type { BasicSetupOptions, Extension, ReactCodeMirrorProps } from "@uiw/react-codemirror"
import { EditorView } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import React, { useEffect, useState } from "react";
import type { EditorThemeType } from "@src/types/type";

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
    theme?: EditorThemeType,
    style?: React.CSSProperties
}

const classes = {
    codemirror: `bg-transparent border-[1px] p-1`
}

const Codebox: React.FC<codeMirrorProps> = (props) => {
    const { data, readOnly, textChangeHandler, className, language, basicSetup, codeMode, otherProps, theme, style } = props;

    return (
        <CodeMirrorComponent
            className={`${classes.codemirror} ${className}`}
            style={{
                outline: "none",
                ...style
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
            height="100%"
            value={data}
            theme={theme}
            onChange={(value: any) => {
                textChangeHandler(value);
            }}
            onFocus={() => {
                // window lock scroll
                document.body.style.overflow = "hidden";
            }}
            {...otherProps}
        />
    );
};

export default Codebox;
