'use client'

import { toastStyle } from '@/config/toasts.config'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '../../common/Button'
import { useState } from 'react'
import { cn, copyToClipboard } from '@/utils'
import { APP_METADATA } from '@/config/app.config'
import { HyperliquidAccount } from '@/interfaces/hyperliquid.interface'

// Excludes accounts with less than 10k USDC account value and less than 1M USDC trading volume. ROI = PNL / max(100, starting account value + maximum net deposits) for the time window.
export function HyperliquidFetchAccounts() {
    const MINIMUM_PNL = 0
    const ACCOUNTS_TO_WATCH = 100
    const [displayAll, setDisplayAll] = useState(false)
    const mode = `Hyperliquid first ${ACCOUNTS_TO_WATCH} accounts with pnl(allTime)+pnl(perpAllTime) >=${MINIMUM_PNL}, sorted by perpAllTimeRoi`
    const query = useQuery({
        queryKey: [mode],
        queryFn: async () => {
            const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
            const response = await fetch(`${root}/api/hyperliquid/leaderboard`, { cache: 'no-store' })
            if (!response.ok) throw new Error((await response.json()).error)
            const json = (await response.json()) as {
                data: { leaderboardRows: HyperliquidAccount[] & { sumAllTime: 0; allTimeRoi: 0; perpAllTimeRoi: 0 } }
            }
            console.log({ json })
            toast.success(mode, { style: toastStyle })
            return json.data.leaderboardRows
                .map((account) => {
                    const allTime = account.windowPerformances.find((perf) => perf[0] === 'allTime')
                    const perpAllTime = account.windowPerformances.find((perf) => perf[0] === 'perpAllTime')
                    let sumAllTime = 0
                    let allTimeRoi = 0
                    let perpAllTimeRoi = 0
                    if (allTime?.length === 2 && allTime[1].pnl) {
                        sumAllTime += Number(allTime[1].pnl)
                        allTimeRoi = Number(allTime[1].roi)
                    }
                    if (perpAllTime?.length === 2 && perpAllTime[1].pnl) {
                        sumAllTime += Number(perpAllTime[1].pnl)
                        perpAllTimeRoi = Number(perpAllTime[1].roi)
                    }
                    return { ...account, sumAllTime, allTimeRoi, perpAllTimeRoi }
                })
                .sort((curr, next) => next.perpAllTimeRoi - curr.perpAllTimeRoi)
                .slice(0, ACCOUNTS_TO_WATCH)
        },
        retry: false,
        refetchOnWindowFocus: false,
    })

    return (
        <div className="flex w-full flex-col gap-2 rounded-md border border-inactive p-2 text-sm">
            <div className="flex w-full justify-between">
                <div className="flex w-full flex-col">
                    <p className="font-bold text-primary">{mode}</p>
                    {/* <p>NB: </p> */}
                </div>
                <Button onClickFn={async () => await query.refetch()} disabled={query.isLoading} text="Refetch" />
            </div>
            {query.isLoading || query.isFetching ? (
                <p>Loading query...</p>
            ) : query.error ? (
                <p className="text-red-500">Error: {query.error.message}</p>
            ) : query.data ? (
                <>
                    <pre
                        className={cn('relative overflow-auto bg-light-hover p-2 text-xs flex flex-col gap-3', {
                            'h-fit': displayAll,
                            'h-40': !displayAll,
                        })}
                    >
                        <div className="absolute right-1 top-1 flex w-full justify-end gap-2">
                            <Button onClickFn={() => copyToClipboard(JSON.stringify(query.data))} text="Copy" />
                            <Button onClickFn={() => setDisplayAll(!displayAll)} text={displayAll ? 'Hide' : 'Show'} />
                        </div>
                        {Array.isArray(query.data) && <p className="text-secondary">response: {query.data.length} entries</p>}
                        {JSON.stringify(query.data, null, 2)}
                    </pre>
                </>
            ) : (
                <p>Edge case</p>
            )}
        </div>
    )
}
