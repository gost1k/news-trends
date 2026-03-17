import React from "react"
import styles from "./Main.module.scss"
import Header from "./Header"

const layout = ({ Children }: { Children: React.ReactNode }) => {
    return (
        <div className={styles.layout}>
            <Header>
                Какой-то текст внутри header
            </Header>
            <main>
                {Children}
            </main>
            <footer>Footer</footer>
        </div>
    )
}

export default layout;