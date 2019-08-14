const A = ({ name }) => (
  <>
    <span className="link">这是A页面</span>
    <style jsx>
      {`
        .link {
          color: red;
        }
      `}
    </style>

    <style jsx global>
      {`
        .link {
          color: blue;
        }
      `}
    </style>
  </>
)

export default A
