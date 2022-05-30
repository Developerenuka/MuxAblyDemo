import { useEffect, useRef, useState } from 'react'
import styles from '../styles/Streaming.module.css'
import * as UpChunk from '@mux/upchunk'
import useSwr from 'swr'
import VideoPlayer from './video-player'
import ErrorMessage from './error-message'
// import Spinner from './spinner'
// import ErrorMessage from './error-message'

const fetcher = (url) => {
    return fetch(url).then((res) => res.json())
}

const UploadForm = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [isPreparing, setIsPreparing] = useState(false)
    const [uploadId, setUploadId] = useState(null)
    const [progress, setProgress] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [showVideo, setShowVideo] = useState(false)
    const [assetId, setAssetId] = useState("")
    const [src, setSrc] = useState("")
    const [poster, setPoster] = useState("")
    const inputRef = useRef(null)

    const { data, error } = useSwr(
        () => (isPreparing ? `/api/upload/${uploadId}` : null),
        fetcher,
        { refreshInterval: 5000 }
    )

    const upload = data && data.upload

    useEffect(() => {
        if (upload && upload.asset_id) {
            setAssetId(upload.asset_id)
        }
    }, [upload])

    if (error) return <ErrorMessage message="Error fetching api" />
    if (data && data.error) return <ErrorMessage message={data.error} />

    const res = useSwr(
        () => (assetId ? `/api/asset/${assetId}` : null),
        fetcher,
        { refreshInterval: 5000 }
    )
    const asset = res.data && res.data.asset

    useEffect(() => {
        if (asset && asset.playback_id && asset.status === 'ready') {
            setSrc(`https://stream.mux.com/${asset.playback_id}.m3u8`)
            setPoster(`https://image.mux.com/${asset.playback_id}/thumbnail.png`)
            setShowVideo(true);
            setIsPreparing(false);
            setIsUploading(false)
        }
    }, [asset])

    if (res.error) {
        <ErrorMessage message="Error fetching api" />
    }

    if (res.data && res.data.error) {
        <ErrorMessage message={res.data.error} />
    }

    if (asset && asset.status === 'errored') {
        const message = asset.errors && asset.errors.messages[0];
        let errorMsg = `Error creating this asset: ${message}`;
        <ErrorMessage message={errorMsg} />
    }
    // url will be retured to UpChunk.createUpload endpoint
    const createUpload = async () => {
        try {
            return fetch('/api/upload/upload', {
                method: 'POST',
            })
                .then((res) => res.json())
                .then(({ id, url }) => {
                    setUploadId(id)
                    return url
                })
        } catch (e) {
            console.error('Error in createUpload', e)
            setErrorMessage('Error creating upload')
        }
    }

    // on click button this function will be called
    const startUpload = (evt) => {
        setIsUploading(true)
        const upload = UpChunk.createUpload({
            endpoint: createUpload, //this will call upload function and get endpoint from it
            file: inputRef.current.files[0],
        })

        upload.on('error', (err) => {
            setErrorMessage(err.detail)
        })

        upload.on('progress', (progress) => {
            setProgress(Math.floor(progress.detail))
        })

        upload.on('success', () => {
            setIsPreparing(true) //this will enable useSwr
        })
    }
    if (errorMessage) return <ErrorMessage message={errorMessage} />


    return (
        <>
            <div className="container">
                {!showVideo ?
                    isUploading ? (
                        <>
                            {isPreparing ? (
                                <div>Preparing..</div>
                            ) : (
                                <div>Uploading...{progress ? `${progress}%` : ''}</div>
                            )}
                            {/* <Spinner /> */}
                        </>
                    ) : (
                        <label>
                            <button className={styles.primaryButton} type="button" onClick={() => inputRef.current.click()}>
                                Select a video file
                            </button>
                            <input type="file" onChange={startUpload} ref={inputRef} />
                        </label>
                    )
                    :
                    <VideoPlayer src={src} poster={poster} />
                }
            </div>
            <style jsx>{`
        input {
          display: none;
        }
      `}</style>
        </>
    )
}

export default UploadForm