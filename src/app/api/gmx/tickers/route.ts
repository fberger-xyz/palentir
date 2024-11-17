import { extractErrorMessage } from '@/utils'
import { NextResponse } from 'next/server'

export async function GET() {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2 * 60000) // 60 seconds timeout
    const url = 'https://arbitrum-api.gmxinfra2.io/prices/tickers'
    try {
        const response = await fetch(url, { method: 'GET', signal: controller.signal })
        clearTimeout(timeoutId)
        if (!response.ok) return NextResponse.json({ data: null, error: `Error fetching ${url}` }, { status: response.status })
        const json = await response.json()
        return NextResponse.json({ data: json, error: '' }, { status: 200 })
    } catch (error) {
        console.error('Fetch Error:', error)
        return NextResponse.json({ data: null, error: extractErrorMessage(error) }, { status: 200 })
    }
}
