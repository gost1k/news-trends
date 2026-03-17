import Trend from './Trend'
import styles from './Trends.module.scss'

const Trends = () => {
    const trends = [
        {
            id: 1,
            title: "Тренд 1",
            description: "Описание тренда 1",
            image: "https://via.placeholder.com/150",
            link: "https://www.google.com",
        },
        {
            id: 2,
            title: "Тренд 2",
            description: "Описание тренда 2",
            image: "https://via.placeholder.com/150",
            link: "https://www.google.com",
        },
        {
            id: 3,
            title: "Тренд 3",
            description: "Описание тренда 3",
            image: "https://via.placeholder.com/150",
            link: "https://www.google.com",
        },
        {
            id: 4,
            title: "Тренд 4",
            description: "Описание тренда 4",
            image: "https://via.placeholder.com/150",
            link: "https://www.google.com",
        },
    ]
    return (
        <div className={styles.trends}>
            {trends.map((trend) => 
                <Trend key={trend.id} trend={trend} />
            )}
        </div>

    )
}

export default Trends