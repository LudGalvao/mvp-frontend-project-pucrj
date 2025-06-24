document.addEventListener('DOMContentLoaded', () => {
    const generateExerciseBtn = document.getElementById('generateExerciseBtn');
    const exerciseDisplay = document.getElementById('exerciseDisplay');
    const introContent = document.getElementById('intro-content');
    const exerciseTitle = document.getElementById('exerciseTitle');
    const heroSection = document.getElementById('heroSection');
    const heroCompactTitle = document.getElementById('hero-compact-title');
    const exerciseSection = document.getElementById('exerciseSection');
    const exerciseCard = document.getElementById('exerciseCard');
    const actionContainer = document.getElementById('actionContainer');
    const statsSection = document.getElementById('statsSection');
    const closeExerciseBtn = document.getElementById('closeExerciseBtn');
    const historicoBtn = document.getElementById('historicoBtn');
    const historySection = document.getElementById('historySection');
    const closeHistoryBtn = document.getElementById('closeHistoryBtn');
    const historyContent = document.getElementById('historyContent');
    let currentExerciseId = null;

    // Inicializar relógio
    initializeClock();
    
    // Event listener para botão de fechar exercício
    if (closeExerciseBtn) {
        closeExerciseBtn.addEventListener('click', closeExercise);
    }

    // Event listeners para histórico
    if (historicoBtn) {
        historicoBtn.addEventListener('click', showHistory);
    }

    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', closeHistory);
    }

    // Renderiza o ícone de relógio (removido pois agora usamos Bootstrap Icons)
    // const clockIcon = document.getElementById('clockIcon');
    // if (clockIcon) {
    //     clockIcon.innerHTML = svgClock();
    // }

    // Função para inicializar e atualizar o relógio
    function initializeClock() {
        const clockElement = document.getElementById('currentTime');
        if (clockElement) {
            updateClock();
            setInterval(updateClock, 1000);
        }
    }

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const clockElement = document.getElementById('currentTime');
        if (clockElement) {
            clockElement.textContent = timeString;
        }
    }

    function renderStepList(passo) {
        if (!passo) return '<li class="text-muted">Passo a passo não disponível.</li>';
        // Divide por linhas que começam com número ou por quebras de linha
        const steps = passo.split(/\n|(?=\d+\.)/).map(s => s.trim()).filter(Boolean);
        if (steps.length === 1) return `<li>${steps[0]}</li>`;
        return steps.map(s => `<li>${s.replace(/^\d+\.\s*/, '')}</li>`).join('');
    }

    function renderStepListModern(passo) {
        if (!passo) return '<div class="no-steps">Passo a passo não disponível.</div>';
        
        // Divide por linhas que começam com número ou por quebras de linha
        const steps = passo.split(/\n|(?=\d+\.)/).map(s => s.trim()).filter(Boolean);
        
        if (steps.length === 1) {
            return `<div class="step-item-modern">
                <div class="step-number">1</div>
                <div class="step-text">${steps[0]}</div>
            </div>`;
        }
        
        return steps.map((step, index) => `
            <div class="step-item-modern">
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step.replace(/^\d+\.\s*/, '')}</div>
            </div>
        `).join('');
    }

    function showMainLoading() {
        // Criar overlay de loading que cobre toda a tela
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'main-loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="main-loading-container">
                <div class="loading-content">
                    <div class="ai-loading-animation">
                        <div class="ai-brain">
                            <i class="bi bi-cpu-fill"></i>
                        </div>
                        <div class="loading-waves">
                            <div class="wave wave-1"></div>
                            <div class="wave wave-2"></div>
                            <div class="wave wave-3"></div>
                        </div>
                    </div>
                    <h3 class="loading-title">Gerando seu exercício personalizado</h3>
                    <p class="loading-description">Nossa IA está criando um treino único para você...</p>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <span class="progress-text">Processando com inteligência artificial</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Animar a entrada do loading
        setTimeout(() => {
            loadingOverlay.classList.add('visible');
        }, 10);
        
        return loadingOverlay;
    }

    function hideMainLoading() {
        const loadingOverlay = document.getElementById('main-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 500);
        }
    }

    function activateExerciseMode() {
        // Ativar overlay do exercício
        exerciseSection.classList.add('active');
        
        // Esconder seção de estatísticas (opcional, pois o overlay as cobre)
        if (statsSection) {
            statsSection.classList.add('hidden');
        }
        
        // Hero section permanece como está - exercício aparece como overlay
    }
    
    function closeExercise() {
        // Fechar overlay do exercício
        exerciseSection.classList.remove('active');
        
        // Mostrar estatísticas novamente
        if (statsSection) {
            statsSection.classList.remove('hidden');
        }
        
        // Reset exercise card states
        if (exerciseTitle) {
            exerciseTitle.classList.remove('visible');
        }
        if (exerciseCard) {
            exerciseCard.classList.remove('visible');
        }
        if (actionContainer) {
            actionContainer.classList.remove('visible');
        }
        
        // Reset exercise content
        setTimeout(() => {
            if (exerciseDisplay) {
                exerciseDisplay.innerHTML = `
                    <div class="placeholder-content">
                        <div class="placeholder-icon">
                            <i class="bi bi-rocket-takeoff-fill"></i>
                        </div>
                        <h4>Pronto para começar?</h4>
                        <p class="text-muted">Clique no botão acima para gerar seu primeiro exercício personalizado</p>
                    </div>
                `;
            }
            if (exerciseTitle) {
                exerciseTitle.innerHTML = '';
            }
        }, 300);
        
        currentExerciseId = null;
    }

    function showExerciseContent() {
        // Mostrar título do exercício
        setTimeout(() => {
            if (exerciseTitle) {
                exerciseTitle.classList.add('visible');
            }
        }, 600);
        
        // Mostrar card do exercício
        setTimeout(() => {
            if (exerciseCard) {
                exerciseCard.classList.add('visible');
            }
        }, 800);
        
        // Mostrar container de ação
        setTimeout(() => {
            if (actionContainer) {
                actionContainer.classList.add('visible');
            }
        }, 1200);
    }

    async function renderExercise(exercise) {
        currentExerciseId = exercise.id;
        
        // Ativar modo exercício se ainda não estiver ativo
        if (!exerciseSection.classList.contains('active')) {
            activateExerciseMode();
        }
        
        // Atualizar título do exercício
        if (exerciseTitle) {
            exerciseTitle.innerHTML = `
                <h2 class="exercise-title-custom">
                    <i class="bi bi-trophy-fill me-3"></i>
                    ${exercise.nome}
                </h2>
            `;
        }
        
        // Renderizar conteúdo do exercício com design premium
        exerciseDisplay.innerHTML = `
            <div class="exercise-header-modern">
                <div class="exercise-type-badge">
                    <div class="badge-glow"></div>
                    <i class="bi bi-stars"></i>
                    <span>Exercício Personalizado</span>
                </div>
            </div>
            
            <div class="exercise-details-modern">
                <div class="detail-card description-card">
                    <div class="detail-card-header">
                        <div class="detail-icon description-icon">
                            <i class="bi bi-card-text"></i>
                        </div>
                        <h4>Descrição</h4>
                    </div>
                    <div class="detail-card-content">
                        <p>${exercise.descricao}</p>
                    </div>
                </div>
                
                <div class="detail-card benefits-card">
                    <div class="detail-card-header">
                        <div class="detail-icon benefits-icon">
                            <i class="bi bi-heart-pulse"></i>
                        </div>
                        <h4>Benefícios</h4>
                    </div>
                    <div class="detail-card-content">
                        <p>${exercise.vantagens}</p>
                    </div>
                </div>
                
                <div class="detail-card steps-card">
                    <div class="detail-card-header">
                        <div class="detail-icon steps-icon">
                            <i class="bi bi-list-ol"></i>
                        </div>
                        <h4>Como executar</h4>
                    </div>
                    <div class="detail-card-content">
                        <div class="steps-list-modern">${renderStepListModern(exercise.passo_a_passo)}</div>
                    </div>
                </div>
            </div>
        `;
        
        // Botão de concluir com novo design
        const outerBtn = document.getElementById('concluir-btn-outer-wrapper');
        if (outerBtn) {
            outerBtn.innerHTML = `
                <button id="concluirExerciseBtn" class="btn-conclude">
                    <div class="btn-icon">
                        <i class="bi bi-check2-circle"></i>
                    </div>
                    <span>Concluir exercício e gerar outro</span>
                    <div class="btn-arrow">
                        <i class="bi bi-arrow-right-circle-fill"></i>
                    </div>
                </button>
            `;
            document.getElementById('concluirExerciseBtn').onclick = concluirExercise;
        }

        // Mostrar conteúdo do exercício com animações
        showExerciseContent();

        // Scroll suave para o exercício após um delay para permitir as animações
        setTimeout(() => {
            exerciseTitle.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
            });
        }, 1000);
    }

    async function concluirExercise() {
        if (!currentExerciseId) return;
        
        // Mostrar loading compacto para conclusão
        const compactLoading = `
            <div class="compact-loading">
                <div class="compact-spinner">
                    <div class="spinner-ring"></div>
                    <i class="bi bi-arrow-repeat spin-icon"></i>
                </div>
                <h4>Finalizando exercício...</h4>
                <p>Gerando próximo treino personalizado</p>
            </div>
        `;
        
        // Reset das classes de visibilidade
        if (exerciseTitle) exerciseTitle.classList.remove('visible');
        if (exerciseCard) exerciseCard.classList.remove('visible');
        if (actionContainer) actionContainer.classList.remove('visible');
        
        exerciseDisplay.innerHTML = compactLoading;
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
            
        } catch (error) {
            exerciseDisplay.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <h4>Ops! Algo deu errado</h4>
                    <p class="error-message">${error.message}</p>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }

    generateExerciseBtn.addEventListener('click', async () => {
        // Mostrar loading principal
        const loadingOverlay = showMainLoading();
        
        // Desabilitar botão
        generateExerciseBtn.disabled = true;
        generateExerciseBtn.innerHTML = `
            <i class="bi bi-hourglass-split me-2"></i>
            Gerando...
        `;
        
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
            
            // Aguardar um pouco para mostrar o loading (mínimo 2 segundos para boa UX)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Esconder loading
            hideMainLoading();
            
            // Ativar modo exercício
            activateExerciseMode();
            
            // Limpar título
            if (exerciseTitle) {
                exerciseTitle.innerHTML = '';
                exerciseTitle.classList.remove('visible');
            }
            
            // Reset das classes de visibilidade
            if (exerciseCard) exerciseCard.classList.remove('visible');
            if (actionContainer) actionContainer.classList.remove('visible');
            
            await renderExercise(exercise);
            
        } catch (error) {
            // Esconder loading
            hideMainLoading();
            
            // Reabilitar botão
            generateExerciseBtn.disabled = false;
            generateExerciseBtn.innerHTML = `
                <i class="bi bi-magic me-2"></i>
                Gerar Meu Exercício
                <span class="btn-shine"></span>
            `;
            
            // Mostrar erro no card de exercício
            exerciseDisplay.innerHTML = `
                <div class="error-container">
                    <div class="error-icon">
                        <i class="bi bi-exclamation-triangle"></i>
                    </div>
                    <h4>Não foi possível gerar o exercício</h4>
                    <p class="error-message">${error.message}</p>
                    <div class="error-details">
                        <small class="text-muted">
                            Verifique se o backend está rodando em 
                            <code>http://localhost:8000</code>
                        </small>
                    </div>
                    <button class="btn btn-primary mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    });

    // ===== FUNÇÕES DE HISTÓRICO =====
    async function showHistory() {
        // Ativar seção de histórico
        historySection.classList.add('active');
        
        // Resetar conteúdo
        historyContent.innerHTML = `
            <div class="loading-history">
                <div class="text-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Carregando...</span>
                    </div>
                    <p>Carregando histórico...</p>
                </div>
            </div>
        `;
        
        try {
            const response = await fetch('http://localhost:8000/historico/exercicios/detalhado');
            if (!response.ok) {
                throw new Error('Erro ao carregar histórico');
            }
            
            const historyData = await response.json();
            renderHistory(historyData);
            
        } catch (error) {
            historyContent.innerHTML = `
                <div class="no-history">
                    <div class="no-history-icon">
                        <i class="bi bi-exclamation-triangle"></i>
                    </div>
                    <h4>Erro ao carregar histórico</h4>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-3" onclick="showHistory()">
                        <i class="bi bi-arrow-clockwise me-2"></i>
                        Tentar novamente
                    </button>
                </div>
            `;
        }
    }

    function closeHistory() {
        historySection.classList.remove('active');
    }

    function renderHistory(historyData) {
        if (!historyData || historyData.length === 0) {
            historyContent.innerHTML = `
                <div class="no-history">
                    <div class="no-history-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <h4>Nenhum exercício no histórico</h4>
                    <p>Comece gerando seu primeiro exercício personalizado!</p>
                </div>
            `;
            return;
        }

        // Filtrar apenas exercícios que têm histórico
        const exercisesWithHistory = historyData.filter(exercise => exercise.total_concluido > 0);
        
        if (exercisesWithHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="no-history">
                    <div class="no-history-icon">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <h4>Nenhum exercício concluído</h4>
                    <p>Complete alguns exercícios para ver seu histórico aqui!</p>
                </div>
            `;
            return;
        }

        const historyHtml = exercisesWithHistory.map(exercise => `
            <div class="exercise-history-card">
                <div class="exercise-header">
                    <h3 class="exercise-name">${exercise.nome}</h3>
                    <span class="exercise-count">${exercise.total_concluido}x realizados</span>
                </div>
                <p class="exercise-description">${exercise.descricao}</p>
                <div class="history-timeline">
                    ${exercise.historico.map(hist => `
                        <div class="timeline-item">
                            <div class="timeline-icon">
                                <i class="bi bi-check-circle-fill"></i>
                            </div>
                            <div class="timeline-content">
                                <div class="timeline-date">
                                    ${hist.data_conclusao ? formatDate(hist.data_conclusao) : 'Em andamento'}
                                </div>
                                <div class="timeline-status">
                                    ${hist.data_conclusao ? 'Exercício concluído' : 'Exercício iniciado'}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        historyContent.innerHTML = historyHtml;
    }

    function formatDate(dateString) {
        const date = new Date(dateString.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, '$3-$2-$1T$4:$5:$6'));
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Adicionar estilos dinâmicos para os novos componentes
    const additionalStyles = `
        <style>
            /* ===== MAIN LOADING OVERLAY ===== */
            #main-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 50%, rgba(240, 147, 251, 0.95) 100%);
                backdrop-filter: blur(10px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            #main-loading-overlay.visible {
                opacity: 1;
                visibility: visible;
            }
            
            #main-loading-overlay.fade-out {
                opacity: 0;
                transform: scale(0.95);
            }
            
            .main-loading-container {
                text-align: center;
                color: white;
                max-width: 500px;
                padding: 2rem;
            }
            
            .ai-loading-animation {
                position: relative;
                margin-bottom: 2rem;
            }
            
            .ai-brain {
                width: 100px;
                height: 100px;
                margin: 0 auto 2rem;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 3rem;
                animation: pulse 2s ease-in-out infinite;
                position: relative;
                z-index: 2;
            }
            
            .loading-waves {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200px;
                height: 200px;
            }
            
            .wave {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                animation: wave-expand 2s ease-out infinite;
            }
            
            .wave-1 {
                width: 120px;
                height: 120px;
                animation-delay: 0s;
            }
            
            .wave-2 {
                width: 160px;
                height: 160px;
                animation-delay: 0.5s;
            }
            
            .wave-3 {
                width: 200px;
                height: 200px;
                animation-delay: 1s;
            }
            
            .loading-title {
                font-family: 'Poppins', sans-serif;
                font-size: 2rem;
                font-weight: 600;
                margin-bottom: 1rem;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            .loading-description {
                font-size: 1.1rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }
            
            .loading-progress {
                margin-top: 2rem;
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 1rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
                border-radius: 3px;
                animation: progress-fill 3s ease-in-out infinite;
            }
            
            .progress-text {
                font-size: 0.9rem;
                opacity: 0.8;
                animation: text-fade 2s ease-in-out infinite;
            }
            
            /* ===== COMPACT LOADING ===== */
            .compact-loading {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .compact-spinner {
                position: relative;
                width: 60px;
                height: 60px;
                margin: 0 auto 1.5rem;
            }
            
            .spinner-ring {
                position: absolute;
                width: 60px;
                height: 60px;
                border: 3px solid transparent;
                border-top: 3px solid var(--accent-blue);
                border-radius: 50%;
                animation: spin-ring 1s linear infinite;
            }
            
            .spin-icon {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 1.5rem;
                color: var(--accent-blue);
                animation: spin-reverse 2s linear infinite;
            }
            
            .compact-loading h4 {
                color: var(--text-primary);
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .compact-loading p {
                color: var(--text-secondary);
                margin: 0;
            }
            
            /* ===== ANIMATIONS ===== */
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
                }
            }
            
            @keyframes wave-expand {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1.2);
                    opacity: 0;
                }
            }
            
            @keyframes progress-fill {
                0% {
                    width: 0%;
                    transform: translateX(-100%);
                }
                50% {
                    width: 70%;
                    transform: translateX(0%);
                }
                100% {
                    width: 100%;
                    transform: translateX(0%);
                }
            }
            
            @keyframes text-fade {
                0%, 100% {
                    opacity: 0.8;
                }
                50% {
                    opacity: 1;
                }
            }
            
            @keyframes spin-ring {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes spin-reverse {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(-360deg); }
            }
            
            /* ===== EXISTING STYLES ===== */
            .exercise-title-custom {
                background: var(--primary-gradient);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 2rem;
                animation: fadeInUp 0.6s ease-out;
            }
            
            .exercise-header {
                text-align: center;
            }
            
            .exercise-badge {
                display: inline-flex;
                align-items: center;
                background: var(--success-gradient);
                color: white;
                padding: 0.5rem 1.5rem;
                border-radius: 50px;
                font-weight: 500;
                font-size: 0.9rem;
                box-shadow: var(--shadow-md);
            }
            
            .detail-item {
                border-bottom: 1px solid #e2e8f0;
                padding-bottom: 1.5rem;
            }
            
            .detail-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            
            .detail-header {
                display: flex;
                align-items: center;
                font-weight: 600;
                color: var(--accent-blue);
                margin-bottom: 0.75rem;
                font-size: 1.1rem;
            }
            
            .detail-content {
                margin-left: 2rem;
                color: var(--text-secondary);
                line-height: 1.7;
            }
            
            .btn-conclude {
                background: var(--secondary-gradient);
                border: none;
                padding: 1.2rem 2.5rem;
                border-radius: var(--radius-lg);
                color: white;
                font-weight: 600;
                font-size: 1.1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: var(--transition-normal);
                box-shadow: var(--shadow-lg);
                position: relative;
                overflow: hidden;
            }
            
            .btn-conclude:hover {
                transform: translateY(-3px);
                box-shadow: var(--shadow-xl);
            }
            
            .btn-conclude .btn-arrow {
                transition: transform 0.3s ease;
            }
            
            .btn-conclude:hover .btn-arrow {
                transform: translateX(5px);
            }
            
            .error-container {
                text-align: center;
                padding: 3rem 2rem;
            }
            
            .error-icon {
                width: 80px;
                height: 80px;
                margin: 0 auto 1.5rem;
                background: linear-gradient(135deg, #ff6b6b, #ee5a24);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
            }
            
            .error-container h4 {
                color: var(--text-primary);
                margin-bottom: 1rem;
                font-weight: 600;
            }
            
            .error-message {
                color: var(--text-secondary);
                margin-bottom: 1rem;
            }
            
            .error-details {
                background: #f8fafc;
                padding: 1rem;
                border-radius: var(--radius-md);
                margin: 1rem 0;
            }
            
            .error-details code {
                background: #e2e8f0;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
            }
            
            /* ===== RESPONSIVE ===== */
            @media (max-width: 576px) {
                .loading-title {
                    font-size: 1.5rem;
                }
                
                .ai-brain {
                    width: 80px;
                    height: 80px;
                    font-size: 2rem;
                }
                
                .wave-1 { width: 100px; height: 100px; }
                .wave-2 { width: 130px; height: 130px; }
                .wave-3 { width: 160px; height: 160px; }
            }
        </style>
    `;
    
    // Adicionar os estilos ao head
    document.head.insertAdjacentHTML('beforeend', additionalStyles);

    // SVGs inline para ícones (mantidos por compatibilidade, mas agora usando Bootstrap Icons)
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