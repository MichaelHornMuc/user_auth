import React, { Fragment, useState, useRef } from 'react'

const PasskeyInput = () => {
  const [allDigits, setAllDigits] = useState([])
  const [passkey, setPasskey] = useState('')
  const inputRef = useRef([])
  // for()
  // }

  const handleChange = (e, index) => {
   const values = e.target.value
   if (!/^\d$/.test(values)) return 
  
  const newDigits = [...allDigits]
  newDigits[index] = values
  setAllDigits(newDigits)

  if (index < 5) {
    console.log(inputRef)
    inputRef.current[index + 1].focus()
  }
  }

  

  const handleSubmit = (e) => {
    e.preventDefault()
    const pass = allDigits.join('')
    setPasskey(pass)
  }

  const handleKeydown = (e, index) => {
    if(e.key === 'Backspace' && index >= 0) {
      const newDigits = [...allDigits]
      newDigits[index] = ''
      setAllDigits(newDigits)
      inputRef.current[index - 1].focus()
    }
  }

  console.log(passkey)

  return (
    <Fragment>
      <h2 className='text-center'>Passkey</h2>

      <form
        className='d-flex justify-content-center align-items-center'
        id='passkey_inputs'
        onSubmit={handleSubmit}>
        <label htmlFor='passkey_input' className='form-label'>
          Enter your one-time passkey{' '}
        </label>
        {/* <ul className='d-flex justify-content-center list-unstyled'> */}
          {Array.from({ length: 6 }).map((_, index) => (
            // <li key={index}>
              <input
                key={index}
                type='text'
                name='passkey_input'
                id='passkey'
                style={{ width: '20px' }}
                value={allDigits[index] || ''}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeydown(e, index)}
                ref={el => inputRef.current[index] = el}
              />
            // </li>
          ))}
        {/* </ul> */}
        <button type='submit' className='btn btn-primary '>
          Submit
        </button>
      </form>
    </Fragment>
  )
}

export default PasskeyInput
