import React from "react";

function Button(props) {
    return (
        <button
            onClick={props.onClick}
            className="button__account-balance">
            <span style={{ flex: 1, textAlign: "center" }}>{props.text}</span> {/* Текст выравниваем по центру */}
            {props.img && <img src={props.img} alt="" />}
        </button>

    )
}

export default Button