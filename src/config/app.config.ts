import { AppThemes, IconIds } from '@/enums'

export const APP_METADATA = {
    SITE_AUTHOR: 'fberger',
    SITE_NAME: 'palentir',
    SITE_DESCRIPTION: 'Description to be added',
    SITE_URL: 'https://palentir.fberger.xyz',
    SOCIALS: {
        X: 'fberger_xyz',
        TELEGRAM: 'fberger_xyz',
        LINKEDIN: 'francis-berger-a2404094',
    },
}

export const APP_THEMES: Partial<Record<AppThemes, { index: number; iconId: IconIds }>> = {
    [AppThemes.LIGHT]: { index: 0, iconId: IconIds.THEME_LIGHT },
    [AppThemes.DARK]: { index: 1, iconId: IconIds.THEME_DARK },
}
