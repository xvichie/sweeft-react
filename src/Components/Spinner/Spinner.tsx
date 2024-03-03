import React from 'react'

function Spinner() {
  return (
    // just a simple spinner that spins.
    <div className="flex justify-center items-center p-4 my-4">
      <div className="w-12 h-12 border-t-4 border-b-4 border-main-purple rounded-full animate-spin"></div>
    </div>
  )
}

export default Spinner