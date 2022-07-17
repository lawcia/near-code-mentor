import React from "react";

export const FormField = ({ id, labelText, type = "text", extra = {} }) => {
    return <div className="mb-3">
        <Label htmlFor={id} textContent={labelText} />
        {type === "editor" ? <Editor id={id} /> : <Input id={id} type={type} extra={extra} />}
    </div>
}

export const Label = ({ htmlFor, textContent }) => {
    return <label htmlFor={htmlFor} className="form-label">{textContent}</label>
}

export const Input = ({id, type, extra: { options, onChange }}) => {
    const className = "form-control"
    if (type === "select") {
        return <select id={id} className={className} onChange={onChange}>
            {options?.map((item) => {
                return <option key={item.value} value={item.value}>{item.textContent}</option>
            })}
        </select>
    }

    if (type === "textarea") {
        return <textarea className={className} id={id} rows="4" maxLength="2000" onChange={onChange} required/>
    }

    return <input type={type} className={className} id={id} onChange={onChange} required/>
}

export const Editor = ({ id }) => {
    return <div id={id}></div>
}

export const setEditorSettings = (settings) => {
    settings?.forEach(({ id, language, code }) => {
        const editor = ace.edit(id);
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode(`ace/mode/${language}`);
        editor.setReadOnly(true);
        editor.setValue(code)
    })
}

export const gatherEditorSettings = (submissions) => {
    return submissions.map(({ id, submission: { code, language }}) => ({
        id,
        language: language || "text",
        code
    }))
}

export const VIEWS = {
    ASK_QUESTION: "ASK_QUESTION",
    REVIEW_QUESTION: "REVIEW_QUESTION",
    VIEW_MY_SUBMISSIONS: "VIEW_MY_SUBMISSIONS",
    DEFAULT: ""
}