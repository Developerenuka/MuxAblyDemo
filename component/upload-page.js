export default function UploadPage({ children }) {
  return (
    <>
      <div className="wrapper">
        <div className="children">{children}</div>
      </div>
      <style jsx>{`
        .about-mux {
          padding: 0 1rem 1.5rem 1rem;
          max-width: 600px;
        }
        .about-mux {
          line-height: 1.4rem;
        }
        .children {
          text-align: center;
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </>
  )
}