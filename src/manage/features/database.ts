import {runCommandAPI} from '@/api/manage.ts'
import {ManageCommandEnum} from '@/model/enum.ts'
import type {Section} from '@/manage/ui.ts'

export const database = (): Section => ({
    key: 'database',
    title: 'Database',
    actions: [
        {
            label: 'Backup to cloud',
            confirm: 'Sure to backup database? This will override cloud database',
            success: 'Database backup submitted',
            run: () => runCommandAPI(ManageCommandEnum.BACKUP),
        },
        {
            label: 'Restore from cloud',
            confirm: 'Sure to restore database? This will override local database',
            success: 'Database restore submitted',
            run: () => runCommandAPI(ManageCommandEnum.RESTORE),
        },
        {
            label: 'Rebuild search index',
            confirm: 'Sure to rebuild the search index?',
            success: 'Search index rebuilt',
            run: () => runCommandAPI(ManageCommandEnum.REBUILD_SEARCH_INDEX),
        },
    ],
})
