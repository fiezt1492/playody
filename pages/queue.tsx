// @flow
import * as React from 'react'
import { useAudioCtx } from '@/lib/contexts/AudioContext'
import { TrackCard } from '@/components/TrackCard'
import MainLayout from '@/components/MainLayout'
import Head from 'next/head'
import UnderlineTypo from '@/components/UnderlineTypo'
const Queue = () => {
    const { isPause, queue, playingIndex, setPlayingIndex } = useAudioCtx()

    function handleClickSong(index: number) {
        if (index <= 0 || index >= queue.length || index === playingIndex) return
        setPlayingIndex(index)
    }

    return (<>
            <Head>
                <title>
                    {playingIndex === null ? 'Queue' : `${queue?.[playingIndex]?.name} - ${queue[playingIndex].artists.join(', ')}`}
                </title>
            </Head>
            <div className='tw-flex tw-flex-col tw-items-center tw-h-full'>
                <div className={'tw-flex tw-flex-col tw-w-full tw-space-y-2'}>
                    {!isPause && playingIndex !== null && <>
                        <UnderlineTypo>
                            Now Playing
                        </UnderlineTypo>
                        <div>
                            <TrackCard
                                title={'Now playing'}
                                key={'Now playing'}
                                track={queue[playingIndex]}
                            />
                        </div>
                    </>}
                    <UnderlineTypo>
                        {!isPause && playingIndex !== null ? 'Waiting in queue' : 'Queue'}
                    </UnderlineTypo>
                    {queue.length ?
                        queue.filter((v, i) => !isPause ? i !== playingIndex : true).map((v, i) => (
                            <TrackCard key={`queued_track_${v.id}_${i}`} track={v} onClick={() => handleClickSong(i)} />
                        )) :
                        <p className={'tw-text-center tw-w-full tw-my-4 tw-text-xl'}>
                            Queue is empty
                        </p>
                    }
                </div>
            </div>
        </>
    )
}

Queue.getLayout = (page: React.ReactElement) => {
    return <MainLayout>{page}</MainLayout>
}

Queue.title = "Queue"

export default Queue
