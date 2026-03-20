export const parseLimitParam = (value: string | string[] | undefined, fallback: number): number => {
    const raw = Array.isArray(value) ? value[0] : value
    if (raw === undefined || raw === '') return fallback
    const n = Number.parseInt(raw, 10)
    if (!Number.isFinite(n) || n < 1) return fallback
    return Math.min(n, 100)
}