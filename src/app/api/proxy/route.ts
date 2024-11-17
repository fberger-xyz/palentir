import { extractErrorMessage } from '@/utils'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60 seconds timeout
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { Accept: 'text/html; charset=utf-8' },
            signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (!response.ok) return NextResponse.json({ error: 'Error fetching content' }, { status: response.status })
        const htmlContent = await response.text()
        return new NextResponse(htmlContent, {
            headers: { 'Content-Type': 'text/html' },
        })
    } catch (error) {
        console.error('Fetch Error:', error)
        return NextResponse.json({ error: 'Error fetching content', details: extractErrorMessage(error) }, { status: 500 })
    }
}
