import PageWrapper from '@/components/common/PageWrapper'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { APP_METADATA } from '@/config/app.config'
import { Metadata } from 'next'
import { HyperliquidFetchAccounts } from '@/components/protocols/hyperliquid/HyperliquidFetchAccounts'
import { HyperliquidFetchUserExplorer } from '@/components/protocols/hyperliquid/HyperliquidFetchUserExplorer'
import { HyperliquidTokens } from '@/components/protocols/hyperliquid/HyperliquidTokens'
dayjs.extend(weekOfYear)

export const metadata: Metadata = {
    title: `Hyperliquid | ${APP_METADATA.SITE_NAME}`,
}

export default async function Page() {
    return (
        <PageWrapper className="gap-5">
            <div className="flex flex-col">
                <p>https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api</p>
                <p>https://app.hyperliquid.xyz/leaderboard</p>
                <p>https://app.hyperliquid.xyz/explorer/address/[address]</p>
                <p>https://hyperliquid.chrisling.dev/leaderboard/[address]</p>
                <p>breakdown holdings/perps https://hypurrscan.io/address/0xd6e1a6f7bb47aca69aaa511210227d40926ff256</p>
                <p>above API https://api.hypurrscan.io/ui/</p>
                <p>https://www.hyperscanner.app/address/0xd6e1a6f7bb47aca69aaa511210227d40926ff256</p>
                <p>https://hexdocs.pm/hyperliquid/Hyperliquid.Api.Explorer.html#module-usage</p>
            </div>
            <HyperliquidFetchAccounts />
            <HyperliquidFetchUserExplorer />
            <HyperliquidTokens />
        </PageWrapper>
    )
}
