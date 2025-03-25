import React, {useState} from 'react'



const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = (passwordInput) => {
    setShowPassword(!showPassword)

    if(passwordInput) {
      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
    }
  }
  return { showPassword, togglePasswordVisibility}
}

export default usePasswordToggle

