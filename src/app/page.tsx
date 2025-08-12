'use client'
import dynamic from 'next/dynamic'

// react-konvaを使用しているコンポーネントはdynamic importを利用する
const StageComponent = dynamic(() => import('../components/StageComponent'), {
  ssr: false
})

export default function CanvasPage() {
  return (
    <StageComponent />
  )
}