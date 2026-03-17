import React from "react"
import styles from "./Header.module.scss"

const header = ({ children }: { children: React.ReactNode }) => {
    return (
        <div id={styles.header}>
            <div className={styles.logo}>Logo</div>
            <div className={styles.main}>{children}</div>
            <div className={styles.menu}>Menu</div>
        </div>
    )
}

export default header;