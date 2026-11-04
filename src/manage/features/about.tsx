import {lazy, Suspense} from 'react'
import {Spin} from 'antd'
import {getConfigAPI, setConfigAPI} from '@/api/manage.ts'
import {ConfigKeyEnum} from '@/model/enum.ts'
import type {Section, Ui} from '@/manage/ui.ts'

// Lazy so that opening /management does not download the CKEditor bundle.
const LazyAboutEditor = lazy(() => import('@/components/AboutEditor'))

export const about = (ui: Ui): Section => ({
    key: 'about',
    title: 'About Page',
    actions: [{
        label: 'Edit',
        run: async () => ui.dialog({
            title: 'About Page',
            width: 800,
            value: (await getConfigAPI(ConfigKeyEnum.ABOUT_CONTENT)) ?? '',
            body: (value, onChange) => (
                <Suspense fallback={<Spin style={{display: 'block', margin: '48px auto'}}/>}>
                    <LazyAboutEditor content={value} setContent={onChange}/>
                </Suspense>
            ),
            onSubmit: (value) => setConfigAPI({key: ConfigKeyEnum.ABOUT_CONTENT, value}),
        }),
    }],
})
