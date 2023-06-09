// @flow
import * as React from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useAppStates } from '@/lib/contexts/AppContext'
import LogoSvg from '@/components/LogoSvg'
import { useEffect, useState } from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import NextLink from 'next/link'
import { PlayodyTitle } from '@/components/PlayodyTitle'

type Props = {
    children: React.ReactNode
};

export default function GetReady(props: Props) {
    const user = useUser()
    const { profile } = useAppStates()
    const { myPlaylists } = useAppStates()
    const [allow, setAllow] = useState(false)

    useEffect(() => {
        if (allow) return
        if (localStorage.getItem('ready_pass')) {
            setAllow(localStorage.getItem('ready_pass') == 'true')
        }
        if (!(!user || !profile || myPlaylists === null))
            setAllow(true)
    }, [user, profile, myPlaylists])

    if (allow)
        return <>
            {props.children}
        </>

    return <div className={'tw-h-screen tw-w-full tw-flex tw-justify-center tw-items-center tw-flex-col tw-space-y-2'}>
        {(!user || !profile || myPlaylists === null) &&
            <div className={'tw-flex tw-flex-col tw-justify-center tw-items-center tw-space-y-2'}>
                <LogoSvg w={128} h={128} />
                <PlayodyTitle />
                <div className={'tw-h-1 tw-rounded-full tw-bg-white/20 tw-w-full'}>

                </div>
                <Button colorScheme={'pink'} w={'full'} as={NextLink} href={'/login'}>
                    Login for the full experience
                </Button>
                <Button w={'full'} onClick={() => {
                    localStorage.setItem('ready_pass', 'true')
                    setAllow(true)
                }}>
                    Continue
                </Button>
            </div>}
    </div>
}