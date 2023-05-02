import React, { useRef, useEffect } from 'react'
import Snap from 'snapsvg-cjs-ts'
import './KanjiStrokes.scss'

const styles = `
.stroke_order_diagram--outer_container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
.stroke_order_diagram--guide_line {
  fill: none;
  stroke: #ddd;
  stroke-width: 3;
  stroke-linecap: square;
  stroke-linejoin: square;
  stroke-dasharray:8, 8;
}
.stroke_order_diagram--bounding_box {
  fill: none;
  stroke: #ddd;
  stroke-width: 4;
  stroke-linecap: square;
  stroke-linejoin: square;
}
.stroke_order_diagram--current_path {
  fill: none;
  stroke: #000;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.stroke_order_diagram--existing_path {
  fill: none;
  stroke: #aaa;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin:round;
}
.stroke_order_diagram--path_start {
  fill: rgba(255, 0, 0, 0.7);
  stroke:none
}`

const circleWidth = 8

const createCss = function () {
  const css = document.createElement('style')
  css.innerHTML = styles
  return css
}

interface StrokeOrderDiagramProps {
  svgDocument: SVGElement
}

export const StrokeOrderDiagram = ({ svgDocument }: StrokeOrderDiagramProps) => {
  const canvasRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas != null) {
      canvas.innerHTML = ''
      canvas.appendChild(createCss())
      const s = Snap(canvas)
      const diagramSize = 200
      const coordRe = '(?:\\d+(?:\\.\\d+)?)'
      const strokeRe = new RegExp('^[LMT]\\s*(' + coordRe + ')[,\\s](' + coordRe + ')', 'i')
      const f = Snap(svgDocument)
      const allPaths = f.selectAll('path')
      const drawnPaths: Snap.Element[] = []
      // @ts-expect-error
      const canvasWidth = (allPaths.length * diagramSize) / 2
      const canvasHeight = diagramSize / 2

      const frameSize = diagramSize / 2
      // @ts-expect-error
      const frameOffsetMatrix = new Snap.Matrix()
      frameOffsetMatrix.translate((-frameSize / 16) + 2, (-frameSize / 16) + 2)

      // Set drawing area
      s.node.style.width = canvasWidth + 'px'
      s.node.style.height = canvasHeight + 'px'
      s.node.setAttribute('viewBox', '0 0 ' + (canvasWidth + 200) + ' ' + canvasHeight)
      const topAndBottomBorderWith = canvasWidth * 10
      // Draw global guides
      const boundingBoxTop = s.line(1, 1, topAndBottomBorderWith, 1)
      const boundingBoxLeft = s.line(1, 1, 1, canvasHeight - 1)
      const boundingBoxBottom = s.line(1, canvasHeight - 1, topAndBottomBorderWith, canvasHeight - 1)
      const horizontalGuide = s.line(0, canvasHeight / 2, canvasWidth, canvasHeight / 2)
      boundingBoxTop.attr({ class: 'stroke_order_diagram--bounding_box' })
      boundingBoxLeft.attr({ class: 'stroke_order_diagram--bounding_box' })
      boundingBoxBottom.attr({ class: 'stroke_order_diagram--bounding_box' })
      horizontalGuide.attr({ class: 'stroke_order_diagram--guide_line' })

      // Draw strokes
      let pathNumber = 1
      allPaths.forEach(function (currentPath: Snap.Element) {
        // @ts-expect-error
        const moveFrameMatrix = new Snap.Matrix()
        moveFrameMatrix.translate((frameSize * (pathNumber - 1)) - 4, -4)

        // Draw frame guides
        const verticalGuide = s.line((frameSize * pathNumber) - (frameSize / 2), 1, (frameSize * pathNumber) - (frameSize / 2), canvasHeight - 1)
        const frameBoxRight = s.line((frameSize * pathNumber) - 1, 1, (frameSize * pathNumber) - 1, canvasHeight - 1)
        verticalGuide.attr({ class: 'stroke_order_diagram--guide_line' })
        frameBoxRight.attr({ class: 'stroke_order_diagram--bounding_box' })

        // Draw previous strokes
        drawnPaths.forEach(function (existingPath) {
          const localPath = existingPath.clone()
          localPath.transform(moveFrameMatrix)
          localPath.attr({ class: 'stroke_order_diagram--existing_path' })
          s.append(localPath)
        })

        // Draw current stroke
        currentPath.transform(frameOffsetMatrix)
        currentPath.transform(moveFrameMatrix)
        currentPath.attr({ class: 'stroke_order_diagram--current_path' })
        s.append(currentPath)

        // Draw stroke start
        const match = strokeRe.exec(currentPath.node.getAttribute('d')!)
        const pathStartX = match![1]
        const pathStartY = match![2]
        const strokeStart = s.circle(parseInt(pathStartX), parseInt(pathStartY), circleWidth)
        strokeStart.attr({ class: 'stroke_order_diagram--path_start' })
        strokeStart.transform(moveFrameMatrix)

        pathNumber++
        drawnPaths.push(currentPath.clone())
      })
    }
  }, [svgDocument])

  return <svg ref={canvasRef} />
}

export function initDiagram (response: SVGElement) {
  const el = document.createElement('svg')
  // @ts-expect-error
  new strokeOrderDiagram(el as SVGElement, response)
  return el
}

export function getDomFromString (string: string) {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = string
  return wrapper.getElementsByTagName('svg')[0]
}

const baseUrl = 'https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/'

function getCodePoint (kanji: string) {
  return kanji && kanji.codePointAt(0)!.toString(16).padStart(5, '0')
}

function getURL (kanji: string) {
  return `${baseUrl}${getCodePoint(kanji)}.svg`
}

export async function getKanji (kanji: string, kanjiDiagramsList: HTMLElement[], changeKanjiDiagramsList: (list: HTMLElement[]) => void) {
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      // window.history.pushState("", "", `?kanji=${kanji}`);
      const diagram = initDiagram(getDomFromString(this.response))
      changeKanjiDiagramsList([...kanjiDiagramsList, diagram])
    }
  }
  xhttp.open('GET', getURL(kanji), true)
  xhttp.send()
}
