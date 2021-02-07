import React from "react"
import styles from "./styles/button.module.scss"

function Button({ onClick, children, style }) {
  return (
    <button className={styles.button} onClick={onClick} style={{ ...style }}>
      {children}
    </button>
  )
}

export default Button
