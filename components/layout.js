import React, { useState } from "react"
import styles from "./styles/layout.module.scss"
import { Maximize, ArrowLeft, Info as InfoIcon } from "react-feather"
import Emoji from "./emoji"
import { useDispatch, useSelector } from "react-redux"
import NightModeToggle from "./nightModeToggle"
import { setMode, toggleInfo, toggleTheme } from "./store"
import Timer from "./timer"
import RemainingCells from "./remainingCells"
import GameOver from "./gameOver"
import Info from "./info"
import Sound from "./sound"

// const getScrollBarHeight = debounce(function getScrollBarWidth() {
//   if (typeof window !== "undefined") {
//     var inner = document.createElement("p")
//     inner.style.width = "100%"
//     inner.style.height = "200px"

//     var outer = document.createElement("div")
//     outer.style.position = "absolute"
//     outer.style.top = "0px"
//     outer.style.left = "0px"
//     outer.style.visibility = "hidden"
//     outer.style.width = "200px"
//     outer.style.height = "150px"
//     outer.style.overflow = "hidden"
//     outer.appendChild(inner)

//     document.body.appendChild(outer)
//     var w1 = inner.offsetWidth
//     outer.style.overflow = "scroll"
//     var w2 = inner.offsetWidth
//     if (w1 == w2) w2 = outer.clientWidth

//     document.body.removeChild(outer)

//     console.log(w1 - w2)
//     return w1 - w2
//   }
// }, 500)

function Layout({ render }) {
  const { mode } = useSelector((state) => state.cells)
  const dispatch = useDispatch()

  const [horizontalScrollBarHeight, setHorizontalScrollBarHeight] = useState(0)
  const [verticalScrollBarWidth, setVerticalScrollBarWidth] = useState(0)

  return (
    <div
      className={styles.container}
      style={{ height: mode === "options" ? "100vh" : undefined }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <nav
          style={{
            justifyContent: mode === "playing" ? "space-between" : "flex-end",
            width: `calc(100% - ${verticalScrollBarWidth}px)`,
          }}
          className={styles.nav}
        >
          {mode === "playing" ? (
            <>
              <RemainingCells />
              <Emoji />
            </>
          ) : null}

          <div className={styles.navOptions}>
            <NightModeToggle
              lightColor="#000"
              darkColor="#fff"
              onClick={() => {
                dispatch(toggleTheme())
              }}
            />
            <Sound />
          </div>
        </nav>
        {/* {children} */}
        {render(setHorizontalScrollBarHeight, setVerticalScrollBarWidth)}
        <footer
          className={styles.footer}
          // style={{ bottom: `${getScrollBarWidth()}px` }}
          style={{
            bottom: `${horizontalScrollBarHeight}px`,
            width: `calc(100% - ${verticalScrollBarWidth}px)`,
          }}
        >
          {mode === "playing" ? (
            <ArrowLeft
              color="var(--icons-foreground)"
              style={{ opacity: 0.8 }}
              onClick={() => dispatch(setMode("options"))}
            />
          ) : (
            <InfoIcon
              color="var(--icons-foreground)"
              style={{ opacity: 0.8 }}
              size={20}
              strokeWidth={3}
              onClick={() => dispatch(toggleInfo())}
            />
          )}
          {mode === "playing" ? (
            <>
              <Timer />
            </>
          ) : null}
          <Maximize
            color="var(--icons-foreground)"
            style={{ opacity: 0.8 }}
            size={20}
            strokeWidth={3}
          />
        </footer>
        <GameOver />
        <Info />
      </div>
    </div>
  )
}

export default Layout
