'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Home = dynamic(() => import('../components/Home'), { ssr: false })

export default function Page() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // or a loading spinner
  }

  return <Home />
}