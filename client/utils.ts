import { useEffect, useState } from "react"

export function given<T,R>(val: T|null|undefined, fn: (v: T) => R): R|null|undefined {
    if (val != null) {
        return fn(val)
    } else {
        return val as null|undefined
    }
}

export function usePromise<T>(fn: () => Promise<T>, dependencies: readonly unknown[]) {
    const [result, setResult] = useState<T|undefined>(undefined)
    const [error, setError] = useState(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        fn()
            .then(res => setResult(res))
            .catch(err => setError(err))
            .finally(() => setLoading(false))
    }, dependencies)

    return [result, error, loading] as const
}