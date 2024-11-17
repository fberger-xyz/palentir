'use client'

import { toastStyle } from '@/config/toasts.config'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import Button from '../../common/Button'
import { useState } from 'react'
import { cn, copyToClipboard, shortenAddress } from '@/utils'
import { APP_METADATA } from '@/config/app.config'
import { HyperliquidExplorer } from '@/interfaces'

export function HyperliquidFetchUserExplorer() {
    const USER = '0xd6e1a6f7bb47aca69aaa511210227d40926ff256'
    const [displayAll, setDisplayAll] = useState(false)
    const mode = `Hyperliquid user ${shortenAddress(USER)} explorer`
    const query = useQuery({
        queryKey: [mode],
        queryFn: async () => {
            const root = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : APP_METADATA.SITE_URL
            const response = await fetch(`${root}/api/hyperliquid/explorer?address=${USER}`, { cache: 'no-store' })
            if (!response.ok) throw new Error((await response.json()).error)
            const json = (await response.json()) as { data: HyperliquidExplorer }
            console.log({ json })
            toast.success(mode, { style: toastStyle })
            return json.data.txs
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
