import React from 'react'
import { base_api_url } from '../../config/config';
import Image from 'next/image';

const AdvertisementCard = async() => {
    const res = await fetch(`${base_api_url}/api/all/ads`, {
        next: {
            revalidate: 1,
        },
    });
    const { ads } = await res.json();

    const reversedAds = ads.reverse();

    return (
        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8 bg-white mx-2 my-3">
            {reversedAds && reversedAds.length > 0 && (
                <div className="w-full h-[200px] relative">
                    {reversedAds[1].mediaType === 'image' ? (
                        <Image
                            className="w-full h-[200px]"
                            layout="fill"
                            src={reversedAds[1].mediaUrl}
                            alt="2nd"
                        />
                    ) : reversedAds[1].mediaType === 'video' ? (
                        <video
                            className="w-full h-[200px] object-cover"
                            autoPlay
                            loop
                            muted
                            src={reversedAds[1].mediaUrl}
                            alt="2nd"
                        />
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            )}
        </main>
    );
}

export default AdvertisementCard