import PageWrapper from '@/components/common/PageWrapper'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { APP_METADATA } from '@/config/app.config'
import { Metadata } from 'next'
import { GmxFetchPositions } from '@/components/protocols/gmx/GmxFetchPositions'
import { GmxFetchAccounts } from '@/components/protocols/gmx/GmxFetchAccounts'
import { GmxFetchTickers } from '@/components/protocols/gmx/GmxFetchTickers'
dayjs.extend(weekOfYear)

export const metadata: Metadata = {
    title: `GMX | ${APP_METADATA.SITE_NAME}`,
}

export default async function Page() {
    return (
        <PageWrapper className="gap-5">
            <div className="flex flex-col">
                <p>https://gmx-docs.io/docs/category/api/</p>
                <p>https://app.gmx.io/#/leaderboard</p>
                <p>https://app.gmx.io/#/accounts/[address]?network=arbitrum&v=2</p>
            </div>
            <GmxFetchAccounts />
            <GmxFetchPositions />
            <GmxFetchTickers />
        </PageWrapper>
    )
}
