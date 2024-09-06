import React from 'react'
import { base_api_url } from '../../config/config';
import Image from 'next/image';

const AdvertisementCard4 = async() => {
    const res = await fetch(`${base_api_url}/api/all/ads`, {
        next: {
            revalidate: 4,
        },
    });
    const { ads } = await res.json();

    const reversedAds = ads.reverse();

    return (
        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8 bg-white mx-2 my-3">
            {reversedAds && reversedAds.length > 0 && (
                <div className="w-full h-[200px] relative">
                    {reversedAds[4].mediaType === 'image' ? (
                        <Image
                            className="w-full h-[200px]"
                            layout="fill"
                            src={reversedAds[4].mediaUrl.replace('http://', 'https://')}
                            alt="5th"
                        />
                    ) : reversedAds[4].mediaType === 'video' ? (
                        <video
                            className="w-full h-[200px] object-cover"
                            autoPlay
                            loop
                            muted
                            src={reversedAds[4].mediaUrl.replace('http://', 'https://')}
                            alt="5th"
                        />
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            )}
        </main>
    );
}

export default AdvertisementCard4