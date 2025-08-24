import { describe, it, expect } from 'vitest'
import { noop } from '../utils'

describe('Utils', () => {
  describe('noop', () => {
    it('何も実行しない関数が正常に動作する', () => {
      expect(() => noop()).not.toThrow()
      expect(noop()).toBeUndefined()
    })

    it('noopが関数として呼び出せる', () => {
      expect(typeof noop).toBe('function')
    })
  })
})
