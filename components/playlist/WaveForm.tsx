import React, { useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({ url }) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        // Initialisation de Wavesurfer
        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current as unknown as HTMLElement,
            waveColor: 'violet',
            progressColor: 'violet',
            cursorColor: 'transparent',
            height: 50,
        });

        // Charger l'audio
        if (url) {
            wavesurfer.current.load(url);
        }

        // Cleanup en quittant
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [url]);

    return <div ref={waveformRef} />;
};

export default Waveform;
