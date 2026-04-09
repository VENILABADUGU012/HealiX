import { useEffect, useState } from 'react'

function useAsyncData(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
    // Intentionally controlled by caller dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher, ...deps])

  return { data, loading, error, refetch }
}

export default useAsyncData
