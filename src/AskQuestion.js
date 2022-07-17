import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { FormField, VIEWS } from "./helpers";
import { submitCode } from "./near/helpers";

const AskQuestion = ({ view, setView }) => {
    const [ language, setLanguage ] = useState("javascript");
    const [ question, setQuestion ] = useState("");
    const [ editor, setEditor] = useState(null);
    const editorId = "editor"

    useEffect(() => {
        if (view === VIEWS.ASK_QUESTION) {
            const initEditor = ace.edit("editor");
            initEditor.setTheme("ace/theme/monokai");
            initEditor.session.setMode(`ace/mode/${language}`);
            setEditor(initEditor);
        }
    }, [view])

    if (view !== VIEWS.ASK_QUESTION) {
        return null
    }

    const options = [{
        value: "javascript",
        textContent: "JavaScript"
    },
    {
        value: "rust",
        textContent: "Rust"
    },
    {
        value: "python",
        textContent: "Python"
    },
    {
        value: "java",
        textContent: "Java"
    }
    ]

    const handleSelect = (e) => {
        const value = e.target.value;
        setLanguage(value);
        editor.session.setMode(`ace/mode/${value}`);

    }

    const handleTextChange = (e) => {
        setQuestion(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const code = editor.getValue();
        if (!language || !code || !question) {
            toast.info("Please enter your code")
            return
        }
        submitCode({
            language,
            code,
            question
        }).then(() => {
            toast.success("Wow so easy!");
            setView(VIEWS.DEFAULT);
        }).catch((e) => {
            console.error(e)
            toast.error("Something went wrong! Please try again later")

        })
    }

    return <div>
        <form onSubmit={handleSubmit}>
            <FormField id="language" type="select" labelText="Enter the programming language" extra={{
                options,
                onChange: handleSelect
            }} />
            <FormField id="question" type="textarea" labelText="Please explain the problem, and what you'd like help with" extra={{
                onChange: handleTextChange
            }}/>
            <FormField id={editorId} type="editor" labelText="Enter your code" />
            <button className="btn btn-success" type="submit">Submit</button>
            <hr />
            <small>Each submission costs 1 NEAR</small>
        </form>
    </div>
};

export default AskQuestion;