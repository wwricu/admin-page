import {databaseAPI} from '@/api/manage.ts'
import {DatabaseActionEnum} from '@/model/enum.ts'
import type {Section} from '@/manage/ui.ts'

export const database = (): Section => ({
    key: 'database',
    title: 'Database',
    actions: [
        {
            label: 'Backup to cloud',
            confirm: 'Sure to backup database? This will override cloud database',
            success: 'Database backup successfully',
            run: () => databaseAPI(DatabaseActionEnum.BACKUP),
        },
        {
            label: 'Restore from cloud',
            confirm: 'Sure to restore database? This will override local database',
            success: 'Database restore successfully',
            run: () => databaseAPI(DatabaseActionEnum.RESTORE),
        },
        {
            label: 'Download to local',
            confirm: 'Download database to local?',
            run: () => { window.open('/api/manage/database') },
        },
    ],
})
