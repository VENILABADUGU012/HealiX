import { Component } from 'react'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Something went wrong</h2>
            <p className="mt-2 text-sm text-slate-600">Please refresh the app to continue.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default AppErrorBoundary
