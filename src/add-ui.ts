import { DictionaryDB } from './db';
import { TextSizeManager } from './utils';
/**
 * UI Logic for the Add Word section
 */
export function initAddUI() {
    console.log('[AddUI] Initializing...');
    
    applyTheme();
    setupForm();
    initLivePreview();
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

}

function setupForm() {
    const form = document.getElementById('addWordForm') as HTMLFormElement;
    if (!form) return;

    // Check for edit mode
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('edit');

    if (editId) {
        loadWordForEdit(editId);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = editId || 'local_' + Date.now();
        const wordObj = {
            id: id,
            swe: (document.getElementById('swe') as HTMLInputElement).value,
            arb: (document.getElementById('arb') as HTMLInputElement).value,
            type: (document.getElementById('type') as HTMLSelectElement).value,
            sweDef: (document.getElementById('sweDef') as HTMLTextAreaElement).value,
            arbDef: (document.getElementById('arbDef') as HTMLTextAreaElement).value,
            exSwe: (document.getElementById('exSwe') as HTMLInputElement).value,
            exArb: (document.getElementById('exArb') as HTMLInputElement).value,
            raw: null as any
        };

        // Format into the 11-column array format used by the app if needed
        wordObj.raw = [
            id, wordObj.type, wordObj.swe, wordObj.arb, 
            wordObj.arbDef, wordObj.sweDef, '', wordObj.exSwe, wordObj.exArb, '', ''
        ];

        const success = await DictionaryDB.saveWord(wordObj);
        if (success) {
            import('./utils').then(u => {
                u.showToast('Sparat! / تم الحفظ!');
                setTimeout(() => window.location.href = 'index.html', 1500);
            });
        }
    });
}

async function loadWordForEdit(id: string) {
    const word = await DictionaryDB.getWordById(id);
    if (!word) return;

    // Word is in row format [id, type, swe, arb, arbExt, sweDef, forms, exSwe, exArb, ...]
    (document.getElementById('swe') as HTMLInputElement).value = word[2] || '';
    (document.getElementById('arb') as HTMLInputElement).value = word[3] || '';
    (document.getElementById('type') as HTMLSelectElement).value = word[1] || '';
    (document.getElementById('arbDef') as HTMLTextAreaElement).value = word[4] || '';
    (document.getElementById('sweDef') as HTMLTextAreaElement).value = word[5] || '';
    (document.getElementById('exSwe') as HTMLInputElement).value = word[7] || '';
    (document.getElementById('exArb') as HTMLInputElement).value = word[8] || '';
    
    // Sync preview after load
    const event = new Event('input');
    document.getElementById('swe')?.dispatchEvent(event);
    document.getElementById('arb')?.dispatchEvent(event);
    document.getElementById('type')?.dispatchEvent(new Event('change'));
}

function initLivePreview() {
    const sweInput = document.getElementById('swe') as HTMLInputElement;
    const arbInput = document.getElementById('arb') as HTMLInputElement;
    const typeSelect = document.getElementById('type') as HTMLSelectElement;
    
    const previewSwe = document.getElementById('previewSwe');
    const previewArb = document.getElementById('previewArb');
    const previewType = document.getElementById('previewType');
    
    if (!sweInput || !previewSwe) return;

    const updatePreview = () => {
        const sweVal = sweInput.value || '...';
        const arbVal = arbInput.value || '...';
        const typeVal = typeSelect.value || 'N/A';
        
        if (previewArb) {
            previewArb.textContent = arbVal;
            TextSizeManager.apply(previewArb as HTMLElement, arbVal);
        }
        if (previewType) previewType.textContent = typeVal;
        
        TextSizeManager.apply(previewSwe as HTMLElement, sweVal);
    };

    sweInput.addEventListener('input', updatePreview);
    arbInput.addEventListener('input', updatePreview);
    typeSelect.addEventListener('change', updatePreview);
}
