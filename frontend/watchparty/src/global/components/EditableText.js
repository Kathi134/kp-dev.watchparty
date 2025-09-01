import { useEffect, useState } from "react"

export default function EditableText({children, onSave, inputFieldClassName}) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(children)

    useEffect(() => {
        setValue(children)
    }, [children])

    const handleLoseFocus = () => {
        setIsEditing(!isEditing)
        onSave(value);
    }

    return (<>
        {isEditing
            ? <input type="text" autoFocus={isEditing} className={inputFieldClassName + " decent-input"}
                value={value} onChange={(e) => setValue(e.target.value)} 
                onKeyDown={(e) => {if(e.key === "Enter") handleLoseFocus(e)}}
                onBlur={handleLoseFocus}
                />
            : <span className="hoverable" onDoubleClick={() => setIsEditing(!isEditing)}>{value}</span>
        }
    </>)
}