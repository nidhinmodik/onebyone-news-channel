import React from 'react';
import { base_api_url } from '../../config/config';
import Image from 'next/image';



const AdvertisementBox = async () => {

    console.log(`${base_api_url}`);

    const res = await fetch(`${base_api_url}/api/all/ads`, {
        next: {
            revalidate: 0,
        },
    });
    const { ads } = await res.json();

    const reversedAds = ads.reverse();

    return (
        <main className="py-6 px-4 sm:p-6 md:py-10 md:px-8 bg-white mx-2 my-3">
            {reversedAds && reversedAds.length > 0 && (
                <div className="w-full h-[200px] relative">
                    {reversedAds[0].mediaType === 'image' ? (
                        <Image
                            className="object-cover w-full h-full"
                            layout="fill"
                            src={reversedAds[0].mediaUrl.replace('http://', 'https://')}
                            alt="1st"
                        />
                    ) : reversedAds[0].mediaType === 'video' ? (
                        <video
                            className="object-cover w-full h-full"
                            autoPlay
                            loop
                            muted
                            src={reversedAds[0].mediaUrl.replace('http://', 'https://')}
                            alt="1st"
                        />
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            )}
        </main>

    );
}


export default AdvertisementBox