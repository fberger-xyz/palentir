import { extractErrorMessage } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'ethers'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')
    if (!address || !isAddress(address)) return NextResponse.json({ error: 'address is required and must be a valid evm address' }, { status: 400 })
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds timeout
    const url = 'https://api-ui.hyperliquid.xyz/explorer'
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                type: 'userDetails',
                user: address,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
            cache: 'no-store',
        })
        clearTimeout(timeoutId)
        if (!response.ok) {
            // console.log(response.json())
            return NextResponse.json({ data: null, error: `Error fetching ${url}` }, { status: response.status })
        }
        const json = await response.json()
        return NextResponse.json({ data: json, error: '' }, { status: 200 })
    } catch (error) {
        console.error('Fetch Error:', error)
        return NextResponse.json({ data: null, error: extractErrorMessage(error) }, { status: 200 })
    }
}
