import {useEffect, useState} from 'react'
import {theme} from 'antd'

const { defaultAlgorithm, darkAlgorithm } = theme

const components = {
    Button: {colorPrimary: '#722ed1'},
    Layout: {headerHeight: 48, headerPadding: '0 5px'},
}

const lightTheme = {
    algorithm: defaultAlgorithm,
    token: {colorPrimary: '#1677ff', borderRadius: 6},
    components: {...components, Layout: {...components.Layout, headerBg: '#ffffff'}},
}

const darkTheme = {
    algorithm: darkAlgorithm,
    token: {borderRadius: 6},
    components,
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
