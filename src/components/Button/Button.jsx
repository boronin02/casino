import React from "react";

function Button(props) {
    return (
        <button
            onClick={props.onClick}
            className={props.className}>
            <span style={{ flex: 1, textAlign: "center" }}>{props.text}</span>
            {props.img && <img src={props.img} alt="" />}
        </button>

    )
}

export default Button