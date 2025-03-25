import { Fragment } from 'react'

const ErrorOrSuccess = ({ successMessage, errorMessage}) => {
  return (
    <Fragment>
      <div className='container'>
        {successMessage ? (
          <Fragment>{successMessage}</Fragment>
        ) : (
          <Fragment>{errorMessage}</Fragment>
        )}
      </div>
    </Fragment>
  )
}

export default ErrorOrSuccess