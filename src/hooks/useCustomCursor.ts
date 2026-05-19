import { useEffect } from 'react'

/**
 * Activates a custom gold cursor on pointer-fine (desktop) devices.
 * Reads/updates two DOM elements (#cursor and #cursor-ring) imperatively
 * for maximum performance (avoids React re-renders on every mousemove).
 */
export function useCustomCursor() {
  useEffect(() => {
    const isPointerFine = window.matchMedia('(pointer: fine)').matches
    if (!isPointerFine) return

    const cursor = document.getElementById('cursor')
    const ring   = document.getElementById('cursor-ring')
    if (!cursor || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = `${mx}px`
      cursor.style.top  = `${my}px`
    }

    const loop = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      ring.style.left = `${rx}px`
      ring.style.top  = `${ry}px`
      rafId = requestAnimationFrame(loop)
    }

    const onEnter = () => {
      cursor.style.width  = '16px'
      cursor.style.height = '16px'
      ring.style.width    = '50px'
      ring.style.height   = '50px'
    }
    const onLeave = () => {
      cursor.style.width  = '10px'
      cursor.style.height = '10px'
      ring.style.width    = '36px'
      ring.style.height   = '36px'
    }

    const interactables = document.querySelectorAll<Element>(
      'a, button, .crystal-card, .product-card',
    )
    interactables.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    document.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(loop)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      interactables.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}
