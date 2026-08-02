import { describe, it, expect } from 'vitest'
import analyticsReducer, { fetchAnalytics } from '../store/analyticsSlice'

describe('analyticsSlice', () => {
  const initialState = {
    data: null,
    loading: false,
    error: null,
  }

  it('should return the initial state', () => {
    expect(analyticsReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle fetchAnalytics.pending', () => {
    const state = analyticsReducer(initialState, fetchAnalytics.pending())
    expect(state.loading).toBe(true)
    expect(state.error).toBe(null)
  })

  it('should handle fetchAnalytics.fulfilled', () => {
    const payload = { totalUsers: 100, totalComplaints: 50 }
    const state = analyticsReducer(
      { ...initialState, loading: true },
      fetchAnalytics.fulfilled(payload)
    )
    expect(state.loading).toBe(false)
    expect(state.data).toEqual(payload)
  })

  it('should handle fetchAnalytics.rejected', () => {
    const state = analyticsReducer(
      { ...initialState, loading: true },
      { type: fetchAnalytics.rejected.type, payload: 'Error occurred' }
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Error occurred')
  })
})
