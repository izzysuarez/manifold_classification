import React, { useState } from 'react';
import './InputField.css';
import schemeChecks from './SchemeChecks.js'; 

// make an import statement that brings in the viz component
import PolygonViz from './RegularPolygon';

function InputField() {
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('hello');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event) => {
    event.preventDefault();
    // added a secondary condition that the input value is not blank.
    if (checkInputValidity(inputValue) && inputValue!=="") {
      const inputArray = schemeChecks.convertStringToArray(inputValue)
      console.log(inputArray)
      console.log(schemeChecks.isProper(inputArray))
      if (schemeChecks.isProper(inputArray)){
        setDisplayValue(inputArray);
        setInputValue('');
      } else{
         setDisplayValue('Not a proper scheme')
         console.log("not a proper scheme")
         setInputValue('')
      }
     } else {
      setDisplayValue('Input must contain only lowercase letters or apostrophes');
      setInputValue('')
    }
  };

  const checkInputValidity = (inputString) => {
    const regex = /^[a-z']+$/
    let prevCharIsApostrophe = false;
    if (inputString[0] === "'"){
        return false
    }
    for (let i = 0; i < inputString.length; i++) {
      if (inputString[i] === "'" && (prevCharIsApostrophe || inputString[i+1] === "'")) {
        return false;
      }
      if (!regex.test(inputString[i])) {
        return false;
      }
      prevCharIsApostrophe = inputString[i] === "'";
    }
  
    return true;
  };
  

  return (
    <div className="InputField">
      <h2>Input Field</h2>
      <form onSubmit={handleInputSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </form>
      {displayValue && <h2>{displayValue}</h2>}
      {displayValue && <PolygonViz />}

    </div>
  );
}

export default InputField;
