import { useEffect, useLayoutEffect } from 'react'
// import {canvas} from './handwriting.canvas'
import { useRef, useState } from 'react'
import axios from 'axios'
import './canvas.scss'

function useWindowSize () {
  const [size, setSize] = useState([0, 0])
  useLayoutEffect(() => {
    function updateSize () {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => { window.removeEventListener('resize', updateSize) }
  }, [])
  return size
}

export const Canvas = () => {
  const [lineWidth, changeLineWidth] = useState(10)
  const [canvasWidth, changeCanvasWidth] = useState(0)
  const [canvasHeight, changeCanvasHeight] = useState(0)
  const [currentlyDrawing, changeCurrentlyDrawing] = useState(false)
  const [handwritingX, changeHandwritingX] = useState<number[]>([])
  const [handwritingY, changeHandwritingY] = useState<number[]>([])
  const [trace, changeTrace] = useState<number[][][]>([])
  const [step, changeStep] = useState<string[]>([])
  const [redoStep, changeRedoStep] = useState<string[]>([])
  const [redoTrace, changeRedoTrace] = useState<number[][][]>([])
  const [userWroteItCorrectly, changeUserWroteItCorrectly] = useState(false)
  const [realWidth, changeRealWidth] = useState(0)
  const [width] = useWindowSize()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current != null) {
      const context = canvasRef.current.getContext('2d')
      context!.lineCap = 'round'
      context!.lineJoin = 'round'
      const observer = new ResizeObserver(entries => {
        changeCanvasWidth(entries[0].contentRect.width)
        changeCanvasHeight(entries[0].contentRect.height)
      })
      observer.observe(canvasRef.current)
    }
  }, [])

  useEffect(() => {
    // const context = canvasRef.current.getContext('2d')
    // context!.lineCap = "round";
    // context!.lineJoin = "round";
    // const observer = new ResizeObserver(entries => {
    //     changeCanvasWidth(entries[0].contentRect.width)
    //     changeCanvasHeight(entries[0].contentRect.height)
    // })
    // observer.observe(canvasRef.current)
    // canvasRef.current.width = 600
    if (width < 400) {
      changeRealWidth(300)
    } else if (width < 800) {
      changeRealWidth(400)
    } else {
      changeRealWidth(600)
    }
  }, [width])
  // console.log(realWidth)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (canvasRef.current != null) {
      const context = canvasRef.current.getContext('2d')!
      context.lineWidth = lineWidth
      changeCurrentlyDrawing(true)
      context.beginPath()
      const rect = canvasRef.current.getBoundingClientRect()
      console.log(rect.left)
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.moveTo(x, y)
      changeHandwritingX([x])
      changeHandwritingY([y])
    }
  }

  const mouseMove = (e: React.MouseEvent) => {
    if (currentlyDrawing && canvasRef.current != null) {
      const rect = canvasRef.current.getBoundingClientRect()
      const context = canvasRef.current.getContext('2d')!
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.lineTo(x, y)
      context.stroke()
      changeHandwritingX([...handwritingX, x])
      changeHandwritingY([...handwritingY, y])
    }
  }

  const mouseUp = function () {
    if (canvasRef.current != null) {
      const w: number[][] = []
      w.push(handwritingX)
      w.push(handwritingY)
      w.push([])
      changeTrace([...trace, w])
      changeCurrentlyDrawing(false)
      step.push(canvasRef.current.toDataURL())
    }
  }

  const touchStart = function (e: React.TouchEvent<HTMLCanvasElement>) {
    if (canvasRef.current != null) {
      const context = canvasRef.current.getContext('2d')!
      context.lineWidth = lineWidth
      const de = document.documentElement
      const box = canvasRef.current.getBoundingClientRect()
      const top = box.top + window.pageYOffset - de.clientTop
      const left = box.left + window.pageXOffset - de.clientLeft
      const touch = e.changedTouches[0]
      const touchX = touch.pageX - left
      const touchY = touch.pageY - top
      changeHandwritingX([touchX])
      changeHandwritingY([touchY])
      context.beginPath()
      context.moveTo(touchX, touchY)
    }
  }

  const touchMove = function (e: React.TouchEvent<HTMLCanvasElement>) {
    if (canvasRef.current != null) {
      const context = canvasRef.current.getContext('2d')!
      const touch = e.targetTouches[0]
      const de = document.documentElement
      const box = canvasRef.current.getBoundingClientRect()
      const top = box.top + window.pageYOffset - de.clientTop
      const left = box.left + window.pageXOffset - de.clientLeft
      const x = touch.pageX - left
      const y = touch.pageY - top
      changeHandwritingX([...handwritingX, x])
      changeHandwritingY([...handwritingY, y])
      context.lineTo(x, y)
      context.stroke()
    }
  }

  const touchEnd = function (e: React.TouchEvent<HTMLCanvasElement>) {
    if (canvasRef.current != null) {
      const w: number[][] = []
      w.push(handwritingX)
      w.push(handwritingY)
      w.push([])
      changeTrace([...trace, w])
      step.push(canvasRef.current.toDataURL())
    }
  }

  const loadFromUrl = (url: string, context: CanvasRenderingContext2D) => {
    const imageObj = new Image()
    imageObj.onload = function () {
      context.clearRect(0, 0, canvasWidth, canvasHeight)
      context.drawImage(imageObj, 0, 0)
    }
    imageObj.src = url
  }

  const undo = function () {
    if (canvasRef.current != null) {
      const context = canvasRef.current.getContext('2d')!
      if (step.length <= 0) return
      else if (step.length === 1) {
        const stepCopy = [...step]
        const lastStepElement = stepCopy.pop()
        changeStep(stepCopy)
        changeRedoStep([...redoStep, lastStepElement!])
        const traceCopy = [...trace]
        const lastTraceElement = traceCopy.pop()
        changeTrace(traceCopy)
        changeRedoTrace([...redoTrace, lastTraceElement!])
        context.clearRect(0, 0, canvasWidth, canvasHeight)
      } else {
        const stepCopy = [...step]
        const lastStepElement = stepCopy.pop()
        changeStep(stepCopy)
        changeRedoStep([...redoStep, lastStepElement!])
        const traceCopy = [...trace]
        const lastTraceElement = traceCopy.pop()
        changeTrace(traceCopy)
        changeRedoTrace([...redoTrace, lastTraceElement!])
        loadFromUrl(step.slice(-1)[0], context)
      }
    }
  }

  const redo = function () {
    if (canvasRef.current != null) {
      if (redoStep.length <= 0) return
      const redoStepCopy = [...redoStep]
      const redoStepLastElement = redoStepCopy.pop()
      changeRedoStep(redoStepCopy)
      changeStep([...step, redoStepLastElement!])

      const redoTraceCopy = [...redoTrace]
      const redoTraceLastElement = redoTraceCopy.pop()
      changeRedoTrace(redoTraceCopy)
      changeTrace([...trace, redoTraceLastElement!])
      loadFromUrl(step.slice(-1)[0], canvasRef.current.getContext('2d')!)
    }
  }

  const erase = () => {
    if (canvasRef.current != null) {
      canvasRef.current.getContext('2d')!.clearRect(0, 0, canvasWidth, canvasHeight)
      changeStep([])
      changeRedoStep([])
      changeRedoTrace([])
      changeTrace([])
    }
  }

  const recognize = function () {
    const data = {
      options: 'enable_pre_space',
      requests: [{
        writing_guide: {
          writing_area_width: canvasWidth,
          writing_area_height: canvasHeight
        },
        ink: trace,
        language: 'ja'
      }]
    }
    const Axios = axios.create()
    Axios.post('https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8', data)
      .then(res => {
        console.log(res)
        const results = res.data[1][0][1].slice(0, 3)
        // feature to check what they wanted to input and make length be same
        // if (!!options.numOfWords) {
        //     results = results.filter(function(result) {
        //         return (result.length == options.numOfWords);
        //     });
        // }
        if (results.includes('梓')) {
          changeUserWroteItCorrectly(true)
        }
      })
  }

  return (
        <div>
            <canvas
                id="can"
                className='writing-canvas'
                style={{ border: '2px solid', cursor: 'crosshair' }}
                height={realWidth}
                width={realWidth}
                onMouseDown={handleMouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp}
                onTouchStart={touchStart}
                onTouchMove={touchMove}
                onTouchEnd={touchEnd}
                ref={canvasRef}
            />
            <p className='test'>test</p>
        </div>

  )
}
