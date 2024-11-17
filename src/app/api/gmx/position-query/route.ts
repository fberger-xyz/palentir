import { createGmxClient } from '@/graphql/gmx.client'
import { GMXPosition } from '@/interfaces'
import { extractErrorMessage } from '@/utils'
import { gql } from 'graphql-request'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        // initialize client
        const client = createGmxClient()

        // perform request
        const { positions } = await client.request<{ positions: GMXPosition[] }>(
            gql`
                query PositionQuery($requiredMaxCapital: BigInt, $isSnapshot: Boolean, $snapshotTimestamp: Int) {
                    positions(
                        limit: 100000
                        where: {
                            isSnapshot_eq: $isSnapshot
                            snapshotTimestamp_eq: $snapshotTimestamp
                            accountStat: { maxCapital_gt: $requiredMaxCapital }
                        }
                    ) {
                        id
                        account
                        market
                        collateralToken
                        isLong
                        realizedFees
                        unrealizedFees
                        maxSize
                        realizedPriceImpact
                        unrealizedPriceImpact
                        unrealizedPnl
                        realizedPnl
                        sizeInTokens
                        sizeInUsd
                        entryPrice
                        collateralAmount
                        snapshotTimestamp
                        isSnapshot
                        __typename
                    }
                }
            `,
            {
                isSnapshot: false,
                requiredMaxCapital: '50000000000000000000000000000000',
            },
        )

        // send data
        return NextResponse.json({ data: positions, error: '' }, { status: 200 })
    } catch (error) {
        // notify error
        return NextResponse.json({ data: null, error: extractErrorMessage(error) }, { status: 200 })
    }
}
