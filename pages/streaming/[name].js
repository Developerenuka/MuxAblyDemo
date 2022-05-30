import React from 'react';
import dynamic from 'next/dynamic'
import MuxView from '../../component/MuxView';
import { useRouter } from 'next/router';

const AblyView = dynamic(() => import('../../component/AblyView'), { ssr: false });

const Streaming = (props) => {
    const router=useRouter()
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-8'>
                    <MuxView />
                </div>
                <div className='col-4'>
                    <AblyView name={router.query.name} />
                    
                </div>
            </div>
        </div>

        
    );
}

export default Streaming;
