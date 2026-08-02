import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import ComplaintsPage from '../pages/ComplaintsPage'

const mockStore = configureStore([])

describe('ComplaintsPage', () => {
  it('renders loading state', () => {
    const store = mockStore({
      auth: { role: 'ROLE_CITIZEN' },
      complaints: { list: [], loading: true, error: null }
    })
    // Mock the dispatch hook inside component by using the mock store dispatch
    store.dispatch = vi.fn()

    render(
      <Provider store={store}>
        <ComplaintsPage />
      </Provider>
    )

    expect(screen.getByText('Loading complaints...')).toBeInTheDocument()
  })

  it('renders complaints correctly', () => {
    const store = mockStore({
      auth: { role: 'ROLE_CITIZEN' },
      complaints: {
        list: [
          { id: 1, title: 'Road Pothole', category: 'Infrastructure', status: 'SUBMITTED', priority: 'HIGH', createdAt: new Date().toISOString() }
        ],
        loading: false,
        error: null
      }
    })
    store.dispatch = vi.fn()

    render(
      <Provider store={store}>
        <ComplaintsPage />
      </Provider>
    )

    expect(screen.getByText('Road Pothole')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure')).toBeInTheDocument()
    expect(screen.getByText('SUBMITTED')).toBeInTheDocument()
  })
})
