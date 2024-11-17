import { ReactNode } from 'react'
import { ETFs, IconIds } from '@/enums'
import dayjs from 'dayjs'
import numeral from 'numeral'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import IconWrapper from '@/components/common/IconWrapper'
import LinkWrapper from '@/components/common/LinkWrapper'
import { cleanFlow, cn, farsidePage, getConfig, monthName } from '@/utils'
import TextWithTickerColor from '@/components/farside/ColorWrapper'
import { Flows } from '@prisma/client'
import Link from 'next/link'
import CopyOrDownloadDataModal from './CopyOrDownloadDataModal'
import { ETFsTickers, FarsideFlows } from '@/interfaces'
dayjs.extend(weekOfYear)

function TableRow(props: { activateHover?: boolean; date: ReactNode; tickers: ReactNode[]; total: ReactNode; rank: ReactNode; className?: string }) {
    return (
        <div className={cn('flex items-center sm:gap-1 px-1 md:px-2', { 'hover:bg-light-hover leading-3': props.activateHover }, props.className)}>
            <div className="flex w-[95px] justify-start overflow-hidden md:w-32">{props.date}</div>
            {...props.tickers}
            <div className="flex w-20 justify-end overflow-hidden md:w-24">{props.total}</div>
            <div className="flex w-12 justify-end overflow-hidden md:w-24">{props.rank}</div>
        </div>
    )
}

export default function FlowsTable({ etf, data, tickers }: { etf: ETFs; data: FarsideFlows[]; tickers: ETFsTickers[] }) {
    // apply rank for days
    const daysSortedByTotal = [...data].sort((curr, next) => cleanFlow(next.total) - cleanFlow(curr.total))
    for (let sortedDayIndex = 0; sortedDayIndex < daysSortedByTotal.length; sortedDayIndex++) {
        const dayIndex = data.findIndex((day) => day.xata_id === daysSortedByTotal[sortedDayIndex].xata_id)
        if (dayIndex >= 0) data[dayIndex].rank = sortedDayIndex + 1
    }

    // group by month / week
    const farsideDataGroupedBy: {
        rank: number
        index: number
        totalPeriod: number
        months: {
            year: number
            index: number
            totalPeriod: number
            rank: number
            weeks: { index: number; totalPeriod: number; days: Flows[] }[]
        }[]
    }[] = []
    for (let dayIndex = 0; dayIndex < data.length; dayIndex++) {
        // year
        const dayYear = dayjs(data[dayIndex].day).year()
        let yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        if (yearIndex < 0) {
            farsideDataGroupedBy.unshift({ rank: 0, index: dayjs(data[dayIndex].day).year(), months: [], totalPeriod: 0 })
            yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === dayYear)
        }

        // month
        const dayMonth = dayjs(data[dayIndex].day).month()
        let monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        if (monthIndex < 0) {
            farsideDataGroupedBy[yearIndex].months.unshift({ year: dayYear, index: dayMonth, weeks: [], rank: 0, totalPeriod: 0 })
            monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === dayMonth)
        }

        // week
        const dayWeek = dayjs(data[dayIndex].day).week()
        let weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        if (weekIndex < 0) {
            farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.unshift({ index: dayWeek, days: [], totalPeriod: 0 })
            weekIndex = farsideDataGroupedBy[yearIndex].months[monthIndex].weeks.findIndex((week) => week.index === dayWeek)
        }

        // store
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].days.unshift(data[dayIndex])
        farsideDataGroupedBy[yearIndex].months[monthIndex].weeks[weekIndex].totalPeriod += Number(data[dayIndex].total)
        farsideDataGroupedBy[yearIndex].months[monthIndex].totalPeriod += Number(data[dayIndex].total)
        farsideDataGroupedBy[yearIndex].totalPeriod += Number(data[dayIndex].total)
    }

    // apply ranks for month
    const monthsSortedByTotal = farsideDataGroupedBy
        .map((year) => year.months)
        .flat()
        .sort((curr, next) => next.totalPeriod - curr.totalPeriod)
    for (let sortedMonthIndex = 0; sortedMonthIndex < monthsSortedByTotal.length; sortedMonthIndex++) {
        const yearIndex = farsideDataGroupedBy.findIndex((year) => year.index === monthsSortedByTotal[sortedMonthIndex].year)
        const monthIndex = farsideDataGroupedBy[yearIndex].months.findIndex((month) => month.index === monthsSortedByTotal[sortedMonthIndex].index)
        if (yearIndex >= 0 && monthIndex >= 0) farsideDataGroupedBy[yearIndex].months[monthIndex].rank = sortedMonthIndex + 1
    }

    // html
    return (
        <div className="flex w-full flex-col text-xs lg:text-sm">
            {/* context */}
            <div className="mb-1 flex w-full justify-center text-base text-primary md:mb-2">
                <p>{etf} ETFs Flows $m USD</p>
            </div>

            {/* headers */}
            <TableRow
                className="border-x border-t border-inactive bg-light-hover"
                date={<p>Date</p>}
                tickers={tickers
                    .filter((curr) => getConfig(etf, curr))
                    .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)
                    .map((ticker) => (
                        <LinkWrapper
                            href={getConfig(etf, ticker).url}
                            key={ticker}
                            className="group flex h-9 w-12 -rotate-45 items-center justify-center overflow-hidden hover:rotate-0 sm:rotate-0 md:w-16"
                            target="_blank"
                        >
                            <TextWithTickerColor className="p-0.5 group-hover:hidden" etf={etf} ticker={ticker}>
                                {ticker}
                            </TextWithTickerColor>
                            <IconWrapper icon={IconIds.IC_BASELINE_OPEN_IN_NEW} className="hidden h-4 w-4 text-primary group-hover:flex" />
                        </LinkWrapper>
                    ))}
                total={
                    <>
                        <p className="hidden text-nowrap md:flex">∑ Flows</p>
                        <p className="pr-2 md:hidden">∑</p>
                    </>
                }
                rank={
                    <>
                        <p className="hidden text-nowrap md:flex">Rank</p>
                        <IconWrapper icon={IconIds.RANK} className="h-5 w-5 md:hidden" />
                    </>
                }
            />

            {/* rows */}
            <div className="flex h-[420px] w-full flex-col overflow-y-scroll border border-inactive md:h-[calc(100vh-280px)]">
                {/* for each year */}
                {farsideDataGroupedBy.map((year, yearIndex) => (
                    <div key={`${yearIndex}-${year.index}`} className="flex flex-col py-1">
                        <TableRow
                            date={<p className="text-primary">{year.index}</p>}
                            tickers={tickers.map(() => (
                                <div className="flex w-12 md:w-16" />
                            ))}
                            total={<p className="text-inactive">{numeral(year.totalPeriod).format('0,0')}</p>}
                            rank={null}
                        />

                        {/* for each month */}
                        {year.months.map((month, monthIndex) => (
                            <div key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}`} className="flex flex-col py-1">
                                <TableRow
                                    className="border-t border-light-hover pt-1"
                                    date={
                                        <p className="w-fit text-primary">
                                            {monthName(month.index).slice(0, 3)} {String(year.index).slice(2)}
                                        </p>
                                    }
                                    tickers={tickers.map(() => (
                                        <div className="flex w-12 items-center justify-center overflow-hidden text-inactive md:w-16" />
                                    ))}
                                    total={<p className="text-inactive">{numeral(month.totalPeriod).format('0,0')}</p>}
                                    rank={null}
                                />

                                {/* for each week */}
                                {month.weeks.map((week, weekIndex) => (
                                    <div
                                        key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}`}
                                        className="flex flex-col sm:gap-0.5"
                                    >
                                        {week.days.length && dayjs(week.days[0].day).format('ddd') === 'Fri' && (
                                            <TableRow
                                                className="border-b border-dashed border-light-hover"
                                                date={<p className="w-fit text-inactive">Week {week.index}</p>}
                                                tickers={tickers.map((ticker, tickerIndex) => (
                                                    <div key={`${ticker}-${tickerIndex}`} className="flex w-12 md:w-16" />
                                                ))}
                                                total={<p className="text-inactive">{numeral(week.totalPeriod).format('0,0')}</p>}
                                                rank={null}
                                            />
                                        )}

                                        {/* for each day */}
                                        {week.days.map((day, dayIndex) => (
                                            <TableRow
                                                activateHover={true}
                                                key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.day}`}
                                                date={
                                                    <>
                                                        <p className="text-nowrap md:hidden">{dayjs(day.day).format('ddd DD')}</p>
                                                        <p className="hidden text-nowrap md:flex">{dayjs(day.day).format('ddd DD MMM')}</p>
                                                    </>
                                                }
                                                tickers={tickers
                                                    .filter((curr) => getConfig(etf, curr))
                                                    .sort((curr, next) => getConfig(etf, curr).index - getConfig(etf, next).index)
                                                    .map((ticker) => (
                                                        <div
                                                            key={`${yearIndex}-${year.index}-${monthIndex}-${month.index}-${weekIndex}-${week.index}-${dayIndex}-${day.day}-${ticker}`}
                                                            className="flex w-12 items-center justify-center overflow-hidden text-light-hover md:w-16"
                                                        >
                                                            {day[ticker as keyof typeof day] ? (
                                                                <TextWithTickerColor etf={etf} className="p-0.5 group-hover:hidden" ticker={ticker}>
                                                                    {numeral(day[ticker as keyof typeof day]).format('0,0')}
                                                                </TextWithTickerColor>
                                                            ) : (
                                                                <p className="p-0.5 text-inactive group-hover:hidden">.</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                total={
                                                    <p
                                                        className={cn('text-nowrap', {
                                                            'text-green-500': Number(day.total) > 0,
                                                            'text-red-500': Number(day.total) < 0,
                                                        })}
                                                    >
                                                        {numeral(day.total).format('0,0')}
                                                    </p>
                                                }
                                                rank={<p className="italic text-inactive">{day.rank}</p>}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* legend */}
            <div className="mt-1 flex w-full items-center justify-between">
                <LinkWrapper href={farsidePage(etf)} className="flex gap-1 text-inactive hover:text-primary" target="_blank">
                    <p className="truncate text-xs">Data: farside.co.uk, a few min. ago</p>
                </LinkWrapper>
                <div className="flex gap-2">
                    <Link
                        href={etf === ETFs.BTC ? '/?copy-or-download=true' : '/eth?copy-or-download=true'}
                        className="flex items-center gap-1 text-inactive hover:text-primary"
                    >
                        <p className="text-xs">Copy</p>
                        <IconWrapper icon={IconIds.CARBON_COPY} className="w-4" />
                    </Link>
                    <Link
                        href={etf === ETFs.BTC ? '/?copy-or-download=true' : '/eth?copy-or-download=true'}
                        className="flex items-center gap-1 text-inactive hover:text-primary"
                    >
                        <p className="text-xs">CSV</p>
                        <IconWrapper icon={IconIds.CARBON_DOWNLOAD} className="w-4" />
                    </Link>
                    <CopyOrDownloadDataModal />
                </div>
            </div>
        </div>
    )
}
