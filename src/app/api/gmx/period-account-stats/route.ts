import { createGmxClient } from '@/graphql/gmx.client'
import { GMXPeriodAccountStatObject } from '@/interfaces'
import { extractErrorMessage } from '@/utils'
import { gql } from 'graphql-request'
import { NextResponse } from 'next/server'

// https://studio.apollographql.com/sandbox/explorer
export async function GET() {
    try {
        // initialize client
        const client = createGmxClient()

        // perform request
        const { all } = await client.request<{ all: GMXPeriodAccountStatObject[]; account: GMXPeriodAccountStatObject[] }>(
            gql`
                query PeriodAccountStats($requiredMaxCapital: String, $from: Int, $to: Int, $account: String) {
                    all: periodAccountStats(limit: 100000, where: { maxCapital_gte: $requiredMaxCapital, from: $from, to: $to }) {
                        id
                        closedCount
                        cumsumCollateral
                        cumsumSize
                        losses
                        maxCapital
                        realizedPriceImpact
                        sumMaxSize
                        netCapital
                        realizedFees
                        realizedPnl
                        volume
                        wins
                        startUnrealizedPnl
                        startUnrealizedFees
                        startUnrealizedPriceImpact
                        __typename
                    }
                    account: periodAccountStats(limit: 1, where: { id_eq: $account, from: $from, to: $to }) {
                        id
                        closedCount
                        cumsumCollateral
                        cumsumSize
                        losses
                        maxCapital
                        realizedPriceImpact
                        sumMaxSize
                        netCapital
                        realizedFees
                        realizedPnl
                        volume
                        wins
                        startUnrealizedPnl
                        startUnrealizedFees
                        startUnrealizedPriceImpact
                        __typename
                    }
                }
            `,
            {
                requiredMaxCapital: '500000000000000000000000000000000',
                from: 0,
            },
        )

        // send data
        return NextResponse.json({ data: all, error: '' }, { status: 200 })
    } catch (error) {
        // notify error
        return NextResponse.json({ data: null, error: extractErrorMessage(error) }, { status: 200 })
    }
}
