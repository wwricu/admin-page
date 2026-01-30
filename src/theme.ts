import {useEffect, useState} from 'react'
import {theme} from 'antd'

const { defaultAlgorithm, darkAlgorithm } = theme

const lightTheme = {
    algorithm: defaultAlgorithm,
    token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
    },
    components: {
        Button: {
            colorPrimary: '#722ed1',
        },
        Layout: {
            headerBg: '#ffffff',
            headerHeight: '3',
            headerPadding: '0 5px'
        },
    },
}

const darkTheme = {
    algorithm: darkAlgorithm,
    components: {
        Layout: {
            headerHeight: '3',
            headerPadding: '0 5px'
        },
    },
}

export default function useAutoTheme() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const query = window.matchMedia('(prefers-color-scheme: dark)')
        const update = () => setIsDark(query.matches)

        update()
        query.addEventListener('change', update)
        return () => query.removeEventListener('change', update)
    }, [])

    return isDark ? darkTheme : lightTheme
}
