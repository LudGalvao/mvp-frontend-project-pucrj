document.addEventListener('DOMContentLoaded', () => {
    const generateExerciseBtn = document.getElementById('generateExerciseBtn');
    const exerciseDisplay = document.getElementById('exerciseDisplay');
    const introContent = document.getElementById('intro-content');
    const exerciseTitle = document.getElementById('exerciseTitle');
    let currentExerciseId = null;

    // Renderiza o ícone de relógio
    const clockIcon = document.getElementById('clockIcon');
    if (clockIcon) {
        clockIcon.innerHTML = svgClock();
    }

    function renderStepList(passo) {
        if (!passo) return '<span>Passo a passo não disponível.</span>';
        // Divide por linhas que começam com número ou por quebras de linha
        const steps = passo.split(/\n|(?=\d+\.)/).map(s => s.trim()).filter(Boolean);
        if (steps.length === 1) return `<li>${steps[0]}</li>`;
        return steps.map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`).join('');
    }

    async function renderExercise(exercise) {
        currentExerciseId = exercise.id;
        if (exerciseTitle) exerciseTitle.innerHTML = `<h2 class='exercise-title'>${exercise.nome}</h2>`;
        exerciseDisplay.innerHTML = `
            <p><strong>Descrição:</strong> ${exercise.descricao}</p>
            <p><strong>Vantagens:</strong> ${exercise.vantagens}</p>
            <div class="step-section">
                <span class="step-title"><span class="step-icon">${svgPencil()}</span> Como fazer:</span>
                <ol class="step-list">${renderStepList(exercise.passo_a_passo)}</ol>
            </div>
        `;
        // Botão fora do card
        const outerBtn = document.getElementById('concluir-btn-outer-wrapper');
        if (outerBtn) {
            outerBtn.innerHTML = `<button id="concluirExerciseBtn"><span class="btn-icon">${svgCheck()}</span>Concluir exercício e gerar outro</button>`;
            document.getElementById('concluirExerciseBtn').onclick = concluirExercise;
        }
    }

    async function concluirExercise() {
        if (!currentExerciseId) return;
        exerciseDisplay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">Concluindo exercício e gerando outro...</div>
            </div>
        `;
        document.getElementById('concluir-btn-outer-wrapper').innerHTML = '';
        try {
            const response = await fetch(`http://localhost:8000/exercicios/concluir/${currentExerciseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao concluir exercício.');
            }
            const data = await response.json();
            const novoId = data.novo_exercicio_gerado;
            const novoExercicioResp = await fetch(`http://localhost:8000/exercicios/${novoId}`);
            const novoExercicio = await novoExercicioResp.json();
            await renderExercise(novoExercicio);
            exerciseTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            exerciseDisplay.innerHTML = `<p class="text-center text-danger">Erro: ${error.message}.</p>`;
        }
    }

    generateExerciseBtn.addEventListener('click', async () => {
        if (introContent) introContent.style.display = 'none';
        if (exerciseTitle) exerciseTitle.innerHTML = '';
        exerciseDisplay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <div class="loading-text">Gerando exercício, aguarde...</div>
            </div>
        `;
        document.getElementById('concluir-btn-outer-wrapper').innerHTML = '';
        try {
            const response = await fetch('http://localhost:8000/exercicios/automatico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Erro ao gerar exercício.');
            }
            const exercise = await response.json();
            await renderExercise(exercise);
            exerciseTitle.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            exerciseDisplay.innerHTML = `<p class="text-center text-danger">Erro: ${error.message}. Verifique se o backend está rodando em http://localhost:8000.</p>`;
        }
    });

    // SVGs inline para ícones
    function svgCheck() {
        return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="#fff"/><path d="M7 13.5L11 17L17 9.5" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }
    function svgPencil() {
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="17.25" width="18" height="3.25" rx="1.5" fill="#c6f6d5"/><path d="M16.5 6.5L17.5 7.5C18.3284 8.32843 18.3284 9.67157 17.5 10.5L10 18H7V15L14.5 7.5C15.3284 6.67157 16.1716 6.67157 17 7.5Z" stroke="#22c55e" stroke-width="1.5" fill="#fff"/></svg>`;
    }

    function svgClock() {
        return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" fill="#fff" stroke="#111" stroke-width="3"/>
            <circle cx="24" cy="24" r="18" fill="#fff" stroke="#111" stroke-width="2"/>
            <path d="M24 14V24L32 28" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    }
}); 