import React from "react";

function Input(props) {
    return (
        <input
            className={props.className}
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            accept={props.accept} />
    )
}

export default Input