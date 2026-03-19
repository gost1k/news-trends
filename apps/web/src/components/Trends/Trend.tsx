import type { TrendListItem } from "@newsmap/types";
import styles from './Trend.module.scss'

const Trend = ({ trend }: {trend: TrendListItem}) => {
    return (
        <div className={styles.trend}>
            <h3>{trend.title}</h3>
            <div className={styles.row}>
                <div>{trend.summary}</div>
                <div>{trend.articleCount}</div>
            </div>
 
        </div>
    )
}

export default Trend