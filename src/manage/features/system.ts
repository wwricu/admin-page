import {runCommandAPI} from '@/api/manage.ts'
import {ManageCommandEnum} from '@/model/enum.ts'
import type {Section} from '@/manage/ui.ts'

export const system = (): Section => ({
    key: 'system',
    title: 'System',
    actions: [
        {
            label: 'Backup database',
            confirm: 'Sure to backup database? This will override cloud database',
            success: 'Database backup submitted',
            run: () => runCommandAPI(ManageCommandEnum.BACKUP),
        },
        {
            label: 'Reset database',
            confirm: 'Sure to reset database? Re-downloads the cloud backup and restarts the service.',
            success: 'Database reset submitted',
            run: () => runCommandAPI(ManageCommandEnum.RESTORE),
        },
        {
            label: 'Rebuild search index',
            confirm: 'Sure to rebuild the search index?',
            success: 'Search index rebuilt',
            run: () => runCommandAPI(ManageCommandEnum.REBUILD_SEARCH_INDEX),
        },
        {
            label: 'Restart service',
            confirm: 'Sure to restart the service?',
            success: 'Service restart submitted',
            run: () => runCommandAPI(ManageCommandEnum.RESTART),
        },
    ],
})