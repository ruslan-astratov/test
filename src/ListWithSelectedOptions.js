import React from "react"

const ListWithSelectedOptions = ({selectedOptions})=> {


    const style = {
        position: "absolute",
        top: "100%",
        left: "60%"
    }

    return (
        <div style={style}>
            <h2>Список выбранных нами опций:</h2>
            <ul>
                {selectedOptions.map((option, idx)  => {
                    return <li key={idx}>{option}</li>
                } )}
            </ul>
        </div>

    )

}

export default ListWithSelectedOptions