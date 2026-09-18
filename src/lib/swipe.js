import { useRef } from "react"

export function useSwipe({ onPrev, onNext, enabled = true }) {
  const startX = useRef(null)
  const swiped = useRef(false)

  const finish = (clientX) => {
    if (!enabled || startX.current == null) return
    const dx = clientX - startX.current
    if (Math.abs(dx) > 40) {
      swiped.current = true
      if (dx > 0) onPrev()
      else onNext()
    }
    startX.current = null
  }

  return {
    swiped,
    handlers: {
      onTouchStart: (event) => {
        if (!enabled) return
        startX.current = event.touches[0].clientX
        swiped.current = false
      },
      onTouchMove: (event) => {
        if (!enabled || startX.current == null) return
        if (Math.abs(event.touches[0].clientX - startX.current) > 12) swiped.current = true
      },
      onTouchEnd: (event) => finish(event.changedTouches[0].clientX),
      onMouseDown: (event) => {
        if (!enabled) return
        startX.current = event.clientX
        swiped.current = false
      },
      onMouseUp: (event) => finish(event.clientX),
      onMouseLeave: () => {
        startX.current = null
      },
    },
  }
}
