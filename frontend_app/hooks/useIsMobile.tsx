import { useEffect, useState } from 'react'


const useIsMobile = (mobileSize: number) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < mobileSize)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])


    return isMobile
}

export default useIsMobile