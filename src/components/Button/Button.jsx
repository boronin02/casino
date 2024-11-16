import React from "react";

function Button(props) {
    return (
        <button
            onClick={props.onClick}
            className={props.className}>
            <img src={props.img} alt="" />
            {props.text}
        </button>
    )
}

export default Button