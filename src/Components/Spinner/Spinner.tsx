import React from 'react'

function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-12 h-12 border-t-4 border-b-4 border-main-purple rounded-full animate-spin"></div>
    </div>
  )
}

export default Spinner