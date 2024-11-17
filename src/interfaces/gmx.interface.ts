export interface GMXPeriodAccountStatObject {
    id: string
    closedCount: number
    cumsumCollateral: string
    cumsumSize: string
    losses: number
    maxCapital: string
    realizedPriceImpact: string
    sumMaxSize: string
    netCapital: string
    realizedFees: string
    realizedPnl: string
    volume: string
    wins: number
    startUnrealizedPnl: string
    startUnrealizedFees: string
    startUnrealizedPriceImpact: string
    __typename: string
}

export interface GMXPosition {
    id: string
    account: string
    market: string
    collateralToken: string
    isLong: boolean
    realizedFees: string
    unrealizedFees: string
    maxSize: string
    realizedPriceImpact: string
    unrealizedPriceImpact: string
    unrealizedPnl: string
    realizedPnl: string
    sizeInTokens: string
    sizeInUsd: string
    entryPrice: string
    collateralAmount: string
    snapshotTimestamp: null
    isSnapshot: boolean
    __typename: string
}

export interface GMXTicker {
    tokenAddress: string
    tokenSymbol: string
    minPrice: string
    maxPrice: string
    updatedAt: number
    timestamp: number
}
