import React, { memo, useEffect, useState } from "react"
import styles from "./styles/layout.module.scss"
import { Maximize, ArrowLeft, Info as InfoIcon, Minimize } from "react-feather"
import Emoji from "./emoji"
import { useDispatch, useSelector } from "react-redux"
import NightModeToggle from "./nightModeToggle"
import { setMode, toggleInfo, toggleTheme, setFullscreen } from "./store"
import Timer from "./timer"
import RemainingCells from "./remainingCells"
import GameOver from "./gameOver"
import Info from "./info"
import Sound from "./sound"

function Layout({ render }) {
  const { mode } = useSelector((state) => state.cells)
  const fullscreen = useSelector((state) => state.fullscreen)
  const dispatch = useDispatch()

  const [horizontalScrollBarHeight, setHorizontalScrollBarHeight] = useState(0)
  const [verticalScrollBarWidth, setVerticalScrollBarWidth] = useState(0)

  useEffect(() => {
    const listener = window.document.addEventListener(
      "fullscreenchange",
      () => {
        if (window.document.fullscreenElement) {
          dispatch(setFullscreen(true))
        } else {
          dispatch(setFullscreen(false))
        }
      }
    )

    return () =>
      window.document.removeEventListener("fullscreenchange", listener)
  }, [])

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
          </div>
        </nav>
        {render(setHorizontalScrollBarHeight, setVerticalScrollBarWidth)}
        <footer
          className={styles.footer}
          style={{
            bottom: `${horizontalScrollBarHeight}px`,
            width: `calc(100% - ${verticalScrollBarWidth}px)`,
          }}
        >
          {mode === "playing" ? (
            <ArrowLeft
              color="var(--icons-foreground)"
              style={{ opacity: 0.8, cursor: "pointer" }}
              onClick={() => dispatch(setMode("options"))}
            />
          ) : (
            <InfoIcon
              color="var(--icons-foreground)"
              style={{ opacity: 0.8, cursor: "pointer" }}
              size={20}
              strokeWidth={3}
              onClick={() => dispatch(toggleInfo())}
            />
          )}
          {mode === "playing" ? <Timer /> : null}
          {typeof window !== "undefined" ? (
            fullscreen ? (
              <Minimize
                color="var(--icons-foreground)"
                style={{ opacity: 0.8, cursor: "pointer" }}
                size={20}
                strokeWidth={3}
                onClick={() => {
                  window.document.exitFullscreen()
                }}
              />
            ) : (
              <Maximize
                color="var(--icons-foreground)"
                style={{ opacity: 0.8, cursor: "pointer" }}
                size={20}
                strokeWidth={3}
                onClick={() => {
                  window.document.documentElement.requestFullscreen()
                }}
              />
            )
          ) : null}
        </footer>
        <GameOver />
        <Info />
      </div>
    </div>
  )
}

export default memo(Layout)
