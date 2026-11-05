import {lazy, Suspense} from 'react'
import {Spin} from 'antd'
import {getValueAPI, runCommandAPI} from '@/api/manage.ts'
import {ConfigKeyEnum, ManageCommandEnum} from '@/model/enum.ts'
import type {Action, Section, Ui} from '@/manage/ui.ts'

// Lazy so that opening /management does not download the CKEditor bundle.
const LazyAboutEditor = lazy(() => import('@/components/AboutEditor'))

const textAction = (ui: Ui, label: string, placeholder: string, read: ConfigKeyEnum, command: ManageCommandEnum): Action => ({
    label,
    run: async () => ui.dialog({
        title: label,
        input: {placeholder},
        value: (await getValueAPI(read)) ?? '',
        onSubmit: (value) => runCommandAPI(command, value),
    }),
})

export const site = (ui: Ui): Section => ({
    key: 'site',
    title: 'Site',
    actions: [
        {
            label: 'About content',
            run: async () => ui.dialog({
                title: 'About Page',
                width: 800,
                value: (await getValueAPI(ConfigKeyEnum.ABOUT_CONTENT)) ?? '',
                body: (value, onChange) => (
                    <Suspense fallback={<Spin style={{display: 'block', margin: '48px auto'}}/>}>
                        <LazyAboutEditor content={value} setContent={onChange}/>
                    </Suspense>
                ),
                onSubmit: (value) => runCommandAPI(ManageCommandEnum.SET_ABOUT, value),
            }),
        },
        textAction(ui, 'Title', 'Shown as the site name', ConfigKeyEnum.SITE_TITLE, ManageCommandEnum.SET_SITE_TITLE),
        textAction(ui, 'Tagline', 'Shown under the site name', ConfigKeyEnum.SITE_TAGLINE, ManageCommandEnum.SET_SITE_TAGLINE),
    ],
})
