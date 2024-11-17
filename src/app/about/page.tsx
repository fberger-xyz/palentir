import PageWrapper from '@/components/common/PageWrapper'
import { APP_METADATA } from '@/config/app.config'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: `about | ${APP_METADATA.SITE_NAME}`,
}

export default function Page() {
    return (
        <PageWrapper>
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-8">
                <p className="text-sm">{APP_METADATA.SITE_DESCRIPTION}</p>
            </div>
        </PageWrapper>
    )
}
