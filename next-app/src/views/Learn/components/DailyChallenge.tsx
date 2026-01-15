import React from 'react';

interface DailyChallengeProps {
    onOpen: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ onOpen }) => {
    return (
        <div className="daily-challenge compact" id="dailyChallenge" onClick={onOpen}>
            <div className="challenge-header">
                <div className="challenge-icon">🎯</div>
                <div className="challenge-info">
                    <div className="challenge-title">
                        <span className="sv-text">Dagens Utmaning</span><span className="ar-text">تحدي اليوم</span>
                    </div>
                    <div className="challenge-desc" id="challengeDesc">
                        <span className="sv-text">Slutför 3 lektioner!</span>
                        <span className="ar-text">أكمل 3 دروس!</span>
                    </div>
                </div>
                <div className="challenge-reward">
                    <div className="reward-value">+50</div>
                    <div className="reward-label">XP</div>
                </div>
            </div>
        </div>
    );
};

export default DailyChallenge;
