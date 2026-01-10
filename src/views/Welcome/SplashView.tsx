import React, { useState, useEffect } from 'react';
import { AppConfig } from '../../config';
import { DictionaryDB } from '../../services/db.service';
// @ts-ignore
import DBWorker from '../../workers/init-db.worker?worker';
import '../../../assets/css/welcome.css';

interface SplashViewProps {
    onComplete: (data: any[][]) => void;
}

const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Ansluter... / جاري الاتصال...');
    const [tip, setTip] = useState<string>(AppConfig.LOADING_TIPS[0]);

    useEffect(() => {
        // Rotate Tips
        const tipInterval = setInterval(() => {
            const nextTip = AppConfig.LOADING_TIPS[Math.floor(Math.random() * AppConfig.LOADING_TIPS.length)];
            setTip(nextTip);
        }, 4000);

        // Data Initialization Logic
        const initData = async () => {
            try {
                await DictionaryDB.init();
                
                // Check if data is already cached and valid
                const hasDataReady = localStorage.getItem('snabbaLexin_dataReady') === 'true';
                const storedVersion = localStorage.getItem('snabbaLexin_version');

                if (hasDataReady && storedVersion === AppConfig.DATA_VERSION) {
                    const cachedData = await DictionaryDB.getAllWords();
                    if (cachedData && cachedData.length > 0) {
                        setProgress(100);
                        setStatus('Klar! / تم!');
                        setTimeout(() => onComplete(cachedData), 500);
                        return;
                    }
                }

                // If not cached, start worker
                startWorker();
            } catch (e) {
                console.error('Splash Init failed', e);
                setStatus('Fel vid start / خطأ في البدء');
            }
        };

        const startWorker = () => {
            const worker = new DBWorker();
            
            worker.onmessage = async (e: MessageEvent) => {
                const { type, value, status: workerStatus, error } = e.data;
                
                if (type === 'progress') {
                    setProgress(value);
                    if (workerStatus) setStatus(workerStatus);
                } else if (type === 'complete') {
                    localStorage.setItem('snabbaLexin_dataReady', 'true');
                    localStorage.setItem('snabbaLexin_version', AppConfig.DATA_VERSION);
                    
                    // Fetch the data we just saved to provide to the app
                    const freshData = await DictionaryDB.getAllWords();
                    setProgress(100);
                    setStatus('Klar! / تم!');
                    setTimeout(() => onComplete(freshData), 500);
                    worker.terminate();
                } else if (type === 'error') {
                    console.error('Worker error:', error);
                    setStatus('Fel vid data / خطأ في البيانات');
                    worker.terminate();
                }
            };
            
            worker.postMessage({ type: 'init', url: AppConfig.DATA_PATH.root });
        };

        initData();

        return () => clearInterval(tipInterval);
    }, [onComplete]);

    return (
        <div className="splash-screen">
            <div className="splash-particles">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="particle"></div>)}
            </div>

            <div className="splash-waves">
                <div className="wave wave-1"></div>
                <div className="wave wave-2"></div>
                <div className="wave wave-3"></div>
            </div>

            <div className="splash-content" style={{ zIndex: 10 }}>
                <div className="splash-logo-container">
                    <div className="splash-logo-glow"></div>
                    <div className="splash-logo" style={{ fontSize: '4rem' }}>📚</div>
                </div>

                <h1 className="splash-title">SnabbaLexin</h1>
                <p className="splash-subtitle">
                    <span>Svensk-Arabiskt Lexikon</span><br />
                    <span>القاموس السويدي العربي</span>
                </p>

                <div className="splash-stats">
                    <span>📖 +34,000 ord / كلمة</span>
                </div>

                <div className="splash-progress-container" style={{ width: '80%', margin: '2rem auto' }}>
                    <div className="splash-loader" style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div 
                            className="splash-loader-bar" 
                            style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s ease' }}
                        ></div>
                    </div>
                    <div className="splash-progress-text" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', color: '#aaa' }}>
                        <span>{status}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>

                <div className="splash-tip" style={{ fontStyle: 'italic', color: '#fbbf24', marginTop: '2rem' }}>
                    {tip}
                </div>
            </div>
        </div>
    );
};

export default SplashView;
