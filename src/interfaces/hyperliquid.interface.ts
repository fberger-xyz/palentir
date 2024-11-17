// leaderboard
export interface HyperliquidAccount {
    ethAddress: string
    accountValue: string
    windowPerformances: [
        string,
        {
            pnl: string
            roi: string
            vlm: string
        },
    ][]
    prize: number
    displayName: null
}

// explorer
export interface HyperliquidExplorer {
    type: string
    txs: HyperliquidTx[]
}

export interface HyperliquidTx {
    time: number
    user: string
    action: {
        type: string
        childVaultAddresses?: string[]
        assets?: number[]
        vaultAddress?: string
        isDeposit?: boolean
        usd?: number
    }
    block: number
    hash: string
    error: null
}

// tokens
export interface HyperliquidInfo {
    universe: Universe[]
    tokens: Token[]
}

export interface Token {
    name: string
    szdecimals: number
    weidecimals: number
    index: number
    tokenid: string
    iscanonical: boolean
    evmcontract: null
    fullname: null | string
}

export interface Universe {
    tokens: number[]
    name: string
    index: number
    iscanonical: boolean
}
