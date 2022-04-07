import React, { useRef, useCallback } from "react"
import { useOutsideClick } from "./Common"


const Wallet = ({ open, close, children }) => {

  const ref = useRef()
  const containerRef = useRef()

  useOutsideClick(ref,containerRef, close)

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      close()
    }
  }, [close])

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction);

    return () => {
      document.removeEventListener("keydown", escFunction);
    };
  }, [escFunction])

  return (
    <>
      {open && (
        <div
        ref={containerRef}
          className={`fixed flex justify-center items-center h-screen w-screen bg-white bg-opacity-40 z-50`}
        >
          <div className="border border-themegray rounded-3xl bg-themeblue text-white lg:w-2/5 md:w-2/3 w-4/5" ref={ref}>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Wallet
