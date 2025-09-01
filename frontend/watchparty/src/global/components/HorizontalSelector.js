import "./horizontal-selector.css"
import { useState } from "react";

export default function HorizontalSelector({ options, onChange, className, selected }) {
//   const [selected, setSelected] = useState(options[0]);

  const handleClick = (option) => {
    if (onChange) onChange(option);
  };

  return (
    <div id="horizontal-selector" className={className}>
      {options.map((option) => (
        <div className={`option ${className} ${option === selected ? 'selected' : ''}`}
          key={option}
          onClick={() => handleClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};
