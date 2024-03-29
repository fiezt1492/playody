import MainLayout from '@/components/MainLayout'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'
import { TrackCard } from '@/components/TrackCard'
import UnderlineTypo from '@/components/UnderlineTypo'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import useSearch from '@/lib/hooks/useSearch'
import { Track } from '@/typings'
import { Database } from '@/typings/supabase'
import { Stack } from '@chakra-ui/react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const tailwindColors = [
    'tw-bg-gray-500',
    'tw-bg-red-500',
    'tw-bg-yellow-500',
    'tw-bg-green-500',
    'tw-bg-blue-500',
    'tw-bg-indigo-500',
    'tw-bg-purple-500',
    'tw-bg-pink-500',
    'tw-bg-teal-500',
    'tw-bg-lime-500',
    'tw-bg-sky-500',
    'tw-bg-cyan-500',
    'tw-bg-violet-500',
    'tw-bg-fuchsia-500',
    'tw-bg-rose-500',
    'tw-bg-emerald-500',
    'tw-bg-amber-500',
]

const Search = ({
    genres,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {
        handleDoubleClick,
        handleOnQuery,
        query,
        searchResults,
        addToQueue,
        searching,
    } = useSearch()

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * max)
    }

    function getTailwindColor(i: number) {
        return tailwindColors[
            i >= tailwindColors.length ? getRandomInt(tailwindColors.length) : i
        ]
    }

    return (
        <>
            <NavBar>
                <SearchBar query={query} onChange={handleOnQuery} />
            </NavBar>
            <div className="tw-flex tw-flex-col tw-items-center">
                <Stack key={'search_results'} direction={'column'} w={'full'}>
                    {searchResults.length <= 0 && (
                        <p
                            className={
                                'tw-text-center tw-w-full tw-my-4 tw-text-xl'
                            }
                        >
                            {searching ? 'Searching...' : 'No result found'}
                        </p>
                    )}
                    {searchResults.map((v) => (
                        <TrackCard
                            key={`search_result_${v.id}`}
                            title={'Double click to add the song to queue'}
                            track={v}
                            onClickCover={() => addToQueue(v)}
                            onClick={(e) => handleDoubleClick(e, v)}
                        />
                    ))}
                </Stack>
                {genres !== null && <UnderlineTypo>Genres</UnderlineTypo>}
                <div className={'tw-flex tw-flex-wrap tw-gap-2 tw-w-full'}>
                    {genres !== null &&
                        genres.map((v, i) => (
                            <NextLink
                                className={'tw-flex-1'}
                                key={`genre_${i}_${v}`}
                                href={`/search?q=${encodeURIComponent(v)}`}
                            >
                                <div
                                    className={`${getTailwindColor(
                                        i
                                    )} hover:tw-shadow-md hover:tw-shadow-white/20 hover:tw-brightness-150 tw-cursor-pointer active:tw-brightness-50 tw-font-bold tw-p-2 tw-rounded-md tw-min-w-[128px] lg:tw-min-w-[256px] lg:tw-min-w-[360px] tw-min-h-[64px]`}
                                >
                                    {v}
                                </div>
                            </NextLink>
                        ))}
                </div>
            </div>
        </>
    )
}

Search.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

Search.title = 'Search'

export default Search

export const getServerSideProps = (async (ctx) => {
    const supabaseClient = createServerSupabaseClient<Database>(ctx)

    const genres = await supabaseClient.rpc('list_genres')

    const typicalGenres = ['rock', 'r&b', 'metal', 'heavy', 'country']

    let returnData = [...typicalGenres]

    if (genres.data) returnData = [...returnData, ...genres.data]

    return {
        props: {
            genres: returnData,
        },
    }
}) satisfies GetServerSideProps<{
    genres: string[] | null
}>
