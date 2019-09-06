import { cloneElement } from 'react'

export default ({ children, renderer = <div /> }) => {
  return (
    <>
      {cloneElement(renderer, {
        children,
        className: `center-container ${renderer.props.className || ''}`,
      })}
      <style jsx global>
        {`
          .center-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }
        `}
      </style>
    </>
  )
}
