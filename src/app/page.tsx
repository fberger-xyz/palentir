import PageWrapper from '@/components/common/PageWrapper'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { APP_METADATA } from '@/config/app.config'
import { Metadata } from 'next'
dayjs.extend(weekOfYear)

export const metadata: Metadata = {
    title: `home | ${APP_METADATA.SITE_NAME}`,
}

export default async function Page() {
    return (
        <PageWrapper className="gap-5">
            <p>GMX: WIP</p>
            <p>Hyperliquid: WIP</p>
            <p>Aave: WIP</p>
        </PageWrapper>
    )
}
