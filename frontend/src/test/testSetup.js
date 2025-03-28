import { afterEach } from 'vitest'
import { clearnup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  clearnup()
})
