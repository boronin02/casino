import React from "react"

function Heading(props) {
    if (props.level === 'h1') {
        return (
            <h1 className={props.className}>{props.text}</h1>
        )
    }

    if (props.level === 'h2') {
        return (
            <h2 className={props.className}>{props.text}</h2>
        )
    }

    if (props.level === 'h3') {
        return (
            <h3 className={props.className}>{props.text}</h3>
        )
    }
}

export default Heading