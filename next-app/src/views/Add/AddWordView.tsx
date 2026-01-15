import React, { useState, useEffect } from 'react';
import { DictionaryDB } from '../../services/db.service';
import { showToast, TextSizeManager, HapticManager } from '../../utils/utils';

interface AddWordViewProps {
    onBack: () => void;
    editId?: string | null;
}

const AddWordView: React.FC<AddWordViewProps> = ({ onBack, editId }) => {
    const [formData, setFormData] = useState({
        swe: '',
        arb: '',
        type: '',
        sweDef: '',
        arbDef: '',
        exSwe: '',
        exArb: ''
    });

    useEffect(() => {
        if (editId) {
            loadWordForEdit(editId);
        }
    }, [editId]);

    const loadWordForEdit = async (id: string) => {
        const word = await DictionaryDB.getWordById(id);
        if (word) {
            setFormData({
                swe: word[2] || '',
                arb: word[3] || '',
                type: word[1] || '',
                arbDef: word[4] || '',
                sweDef: word[5] || '',
                exSwe: word[7] || '',
                exArb: word[8] || ''
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        HapticManager.medium();

        const id = editId || 'local_' + Date.now();
        const wordObj = {
            id: id,
            swe: formData.swe,
            arb: formData.arb,
            type: formData.type,
            sweDef: formData.sweDef,
            arbDef: formData.arbDef,
            exSwe: formData.exSwe,
            exArb: formData.exArb,
            raw: [
                id, formData.type, formData.swe, formData.arb,
                formData.arbDef, formData.sweDef, '', formData.exSwe, formData.exArb, '', ''
            ]
        };

        const success = await DictionaryDB.saveWord(wordObj);
        if (success) {
            showToast('Sparat! / تم الحفظ!');
            setTimeout(onBack, 1000);
        }
    };

    return (
        <div className="add-word-container" style={{ padding: '20px', paddingBottom: '20px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{editId ? 'Redigera ord / تعديل كلمة' : 'Lägg till ord / إضافة كلمة'}</h2>
            </header>

            <form onSubmit={handleSubmit} className="add-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Svenska *</label>
                    <input
                        type="text" id="swe" required
                        value={formData.swe} onChange={handleChange}
                        placeholder="T.ex. Bok"
                        style={styles.input}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Arabiska *</label>
                    <input
                        type="text" id="arb" required
                        value={formData.arb} onChange={handleChange}
                        placeholder="مثلاً: كتاب" dir="rtl"
                        style={styles.input}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Ordklass</label>
                    <select id="type" value={formData.type} onChange={handleChange} style={styles.input}>
                        <option value="">Välj ordklass</option>
                        <option value="Substantiv">Substantiv</option>
                        <option value="Verb">Verb</option>
                        <option value="Adjektiv">Adjektiv</option>
                        <option value="Adverb">Adverb</option>
                        <option value="Preposition">Preposition</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Exempel (Svenska)</label>
                    <input
                        type="text" id="exSwe"
                        value={formData.exSwe} onChange={handleChange}
                        placeholder="Mening..."
                        style={styles.input}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>Exempel (Arabiska)</label>
                    <input
                        type="text" id="exArb"
                        value={formData.exArb} onChange={handleChange}
                        placeholder="ترجمة..." dir="rtl"
                        style={styles.input}
                    />
                </div>

                {/* Live Preview */}
                <div className="live-preview" style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>Förhandsvisning</div>
                    <div className="card compact-card" style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '15px', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, color: 'white' }}>{formData.swe || '...'}</h3>
                            <span className="badge" style={{ fontSize: '0.7rem' }}>{formData.type || 'N/A'}</span>
                        </div>
                        <p dir="rtl" style={{ margin: '10px 0 0 0', color: '#fbbf24', fontSize: '1.2rem' }}>{formData.arb || '...'}</p>
                    </div>
                </div>

                <button type="submit" className="submit-btn" style={{
                    marginTop: '20px', padding: '15px', borderRadius: '12px', background: '#3b82f6',
                    border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem'
                }}>
                    Spara / حفظ
                </button>
            </form>
        </div>
    );
};

const styles = {
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(0,0,0,0.3)',
        color: 'white',
        fontSize: '1rem',
        boxSizing: 'border-box' as 'border-box'
    }
};

export default AddWordView;
