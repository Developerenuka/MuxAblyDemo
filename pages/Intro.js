import React, {useState} from 'react';
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'


const Intro = () => {
    const router = useRouter()
    const [name, setName] = useState("");
    const handleSubmit=()=>{

        router.push(`/streaming/${name}`)

    }
    return (
        <div className={styles.nameWrapper}>
            <h2 className='mb-4'>MUX and ABLY</h2>
            <label className={styles.fieldLabel}>What is your name?</label>
            <input name="name" className={styles.fieldInput} value={name} onChange={(e)=> setName(e.target.value)} />
            <button className={styles.primaryButton} disabled={name.length===0} onClick={()=> handleSubmit()}>Submit</button>
        </div>
    );
}

export default Intro;
