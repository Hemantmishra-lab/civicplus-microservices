import { describe, it, expect, vi } from 'vitest'
import notificationReducer, { fetchNotifications, addNotification } from '../store/notificationSlice'

describe('notificationSlice', () => {
  const initialState = {
    list: [],
    loading: false,
    error: null,
  }

  it('should return the initial state', () => {
    expect(notificationReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle addNotification', () => {
    const newNotification = { id: 1, message: 'Test message' }
    const state = notificationReducer(initialState, addNotification(newNotification))
    expect(state.list).toHaveLength(1)
    expect(state.list[0]).toEqual(newNotification)
  })

  it('should handle fetchNotifications.pending', () => {
    const state = notificationReducer(initialState, fetchNotifications.pending())
    expect(state.loading).toBe(true)
    expect(state.error).toBe(null)
  })

  it('should handle fetchNotifications.fulfilled', () => {
    const payload = [{ id: 1, message: 'Fetched message' }]
    const state = notificationReducer(
      { ...initialState, loading: true },
      fetchNotifications.fulfilled(payload)
    )
    expect(state.loading).toBe(false)
    expect(state.list).toEqual(payload)
  })

  it('should handle fetchNotifications.rejected', () => {
    const state = notificationReducer(
      { ...initialState, loading: true },
      { type: fetchNotifications.rejected.type, payload: 'Error occurred' }
    )
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Error occurred')
  })
})
