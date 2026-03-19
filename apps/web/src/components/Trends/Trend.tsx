import type { TrendListItem } from "@newsmap/types";

const Trend = ({ trend }: {trend: TrendListItem}) => {
    return (
        <div>
            <div>{trend.title}</div>
            <div>{trend.summary}</div>
        </div>
    )
}

export default Trend