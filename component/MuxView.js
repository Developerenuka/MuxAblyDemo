import React, { useEffect, useRef } from 'react';
import mux from 'mux-embed';
import UploadPage from './upload-page';
import UploadForm from './upload-form';
const MuxView = () => {
    const videoRef = useRef(null);


    useEffect(() => {
        if (videoRef.current) {
            const initTime = Date.now();
            mux.monitor(videoRef.current, {
                debug: false,
                data: {
                    env_key: 'fg0dfu8ov71neaniproshqup5', // required
                    // Metadata fields
                    player_name: 'Main Player', // any arbitrary string you want to use to identify this player
                    player_init_time: initTime,
                    // ...
                }
            });
        }
    }, [videoRef]);
    return (
        <UploadPage>
            <UploadForm />
        </UploadPage>
        // <video
        //     controls
        //     ref={videoRef}
        //     src="https://muxed.s3.amazonaws.com/ink.mp4"
        //     style={{ width: '100%', maxWidth: '100%' }}
        // />
    );
}

export default MuxView;
