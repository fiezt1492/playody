import React, { useEffect, useRef, useState } from 'react'
import { Box, Button, Input, Link } from '@chakra-ui/react'
import MainLayout from '@/components/MainLayout'
import { Track, Profile } from '@/typings'
import PostCard from '@/components/PostCard'
import { useInViewport } from 'react-in-viewport'
import { NavBar } from '@/components/NavBar'
import SearchBar from '@/components/SearchBar'

const Home = () => {
    const [page, setPage] = useState(1)
    const [isEnded, setIsEnded] = useState(false)
    const [posts, setPosts] = useState<(Track & { profiles: Profile | null })[]>([])
    const [loading, setLoading] = useState(false)
    const loadBoxRef = useRef(null)
    const [filter, setFilter] = useState('')
    const {
        inViewport,
    } = useInViewport(
        loadBoxRef,
        undefined,
        { disconnectOnLeave: false },
        undefined,
    )

    async function loadPosts() {
        try {
            setLoading(true)
            const res = await fetch(`/api/track/list?page=${page}`).then(r => r.json())

            if (res.error) {
                throw res.error
            }

            if (res.data.length) {
                setPosts(a => [...a, ...res.data])
            } else {
                throw 'List empty'
            }
        } catch (e: any) {
            console.error(e)
            setIsEnded(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isEnded) loadPosts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect(() => {
        if (!isEnded && inViewport) setPage(p => p + 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inViewport])

    return (
        <>
            <NavBar>
                <SearchBar
                    query={filter}
                    placeholder={"Search for a post"}
                    onChange={(e) => {
                        e.preventDefault()
                        setFilter(e.target.value.toLowerCase())
                    }}/>
            </NavBar>
            <div className={'tw-flex tw-flex-col tw-space-y-2'}>
                {posts.length > 0 && posts.filter(v => filter ? v.name.toLowerCase().includes(filter) || v.genres?.join(",").toLowerCase().includes(filter) || v.artists.join(",").toLowerCase().includes(filter) || v.profiles?.full_name?.toLowerCase().includes(filter) : true).map((v, i) => (
                    <div key={`track_${i}_${v.id}`}>
                        <PostCard track={v} />
                    </div>
                ))}
                <Button ref={loadBoxRef} isLoading={loading} display={isEnded ? 'none' : 'flex'} onClick={() => {
                    setPage(p => p + 1)
                }}>
                    Load more
                </Button>
            </div>
        </>
    )
}

Home.getLayout = (page: React.ReactElement) => {
    return <MainLayout navbar={false}>{page}</MainLayout>
}

Home.title = 'Home'

export default Home
