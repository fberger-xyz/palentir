import PageWrapper from '@/components/common/PageWrapper'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { APP_METADATA } from '@/config/app.config'
import { Metadata } from 'next'
dayjs.extend(weekOfYear)

export const metadata: Metadata = {
    title: `Aave | ${APP_METADATA.SITE_NAME}`,
}

export default async function Page() {
    return <PageWrapper className="gap-5">WIP</PageWrapper>
}
