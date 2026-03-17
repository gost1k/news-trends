const Trend = (
    { trend }: 
    { trend: { 
        id: number; 
        title: string; 
        description: 
        string; image: string; 
        link: string 
    } 
}) => {
    return (
        <div>
            <div>{trend.title}</div>
            <div>{trend.description}</div>
        </div>
    )
}

export default Trend