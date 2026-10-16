import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import './page-fade.css'

interface Props {
  children: ReactNode
}

export default function PageFade({ children }: Props) {
  const { pathname } = useLocation()

  return <div key={pathname} className="page-fade">{children}</div>
}
