import Trend from './Trend'
import styles from './Trends.module.scss'
import { useEffect, useState } from 'react'
import type { TrendListItem } from '@newsmap/types'
import { getTrendsList } from '@/api/trends'


const Trends = () => {
    const [trends, setTrends] = useState<TrendListItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        getTrendsList(10)
            .then((res) => setTrends(res.data))
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false)) 
    }, [])

    return (
        <div className={styles.trends}>
            {isLoading && <div>Загрузка</div>}
            {!isLoading && trends.map((trend) => 
                <Trend key={trend.id} trend={trend} />
            )}
        </div>

    )
}

export default Trends