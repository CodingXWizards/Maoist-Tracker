import { useAppSelector } from '@/redux/hooks';
import { LucideLoader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Loader = () => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const { loadingText } = useAppSelector(state => state.info);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleLoadingAnimation = () => {
        if (loadingText) {
            setIsVisible(true);
            if (loaderRef.current)
                loaderRef.current.style.animation = "appear 300ms ease-in-out";
        }
        else {
            if (loaderRef.current)
                loaderRef.current.style.animation = "disappear 300ms ease-in-out";
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }

    }

    useEffect(() => {
        handleLoadingAnimation();
    }, [loadingText]);

    return (
        isVisible && <div className='absolute h-screen w-screen z-[999] bg-black bg-opacity-20 backdrop-blur flex items-center justify-center' >
            <div ref={loaderRef} className='bg-slate-100 max-w-[400px] min-w-[300px] p-3 py-6 shadow-xl rounded-2xl flex flex-col text-center items-center justify-center gap-y-3' >
                <p>{loadingText}</p>
                <LucideLoader2 className='animate-spin' />
            </div >
        </div>
    );
};