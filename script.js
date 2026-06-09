document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. SEÇÕES EXPANSÍVEIS (ACCORDION INTERATIVO)
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isCurrentlyActive = item.classList.contains('active');
            
            // Fecha todos os itens para um comportamento limpo e focado
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });
            
            // Se o item clicado não estava ativo, abre ele
            if (!isCurrentlyActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ==========================================================================
       2. CAIXA DE ACESSIBILIDADE FLUTUANTE
       ========================================================================== */
    let currentFontSize = 100; // Representa a porcentagem (%) base do tamanho da fonte
    const bodyElement = document.body;
    
    // Aumentar Fonte
    document.getElementById('btn-increase-font').addEventListener('click', () => {
        if (currentFontSize < 130) {
            currentFontSize += 5;
            bodyElement.style.fontSize = `${currentFontSize}%`;
        }
    });

    // Diminuir Fonte
    document.getElementById('btn-decrease-font').addEventListener('click', () => {
        if (currentFontSize > 85) {
            currentFontSize -= 5;
            bodyElement.style.fontSize = `${currentFontSize}%`;
        }
    });

    // Alternar Modo Escuro / Claro
    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
        bodyElement.classList.toggle('light-mode');
    });

    /* ==========================================================================
       3. LEITURA POR VOZ (SPEECH SYNTHESIS API)
       ========================================================================== */
    const synth = window.speechSynthesis;
    let utterance = null;

    document.getElementById('btn-speak').addEventListener('click', () => {
        // Cancela leituras anteriores ativas ou pausadas
        if (synth.speaking) {
            synth.cancel();
        }

        const mainContent = document.getElementById('conteudo-principal');
        if (!mainContent) return;

        // Filtra para extrair o texto de elementos puramente informativos
        let textToRead = "";
        const textElements = mainContent.querySelectorAll('h2, h3, p');
        textElements.forEach(el => {
            textToRead += el.innerText + ". ";
        });

        utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0; // Velocidade padrão de fala

        synth.speak(utterance);
    });

    document.getElementById('btn-stop-speak').addEventListener('click', () => {
        if (synth.speaking) {
            synth.cancel();
        }
    });

    /* ==========================================================================
       4. INTERAÇÃO DO LEITOR (ÁREA DE COMENTÁRIOS)
       ========================================================================== */
    const commentForm = document.getElementById('comment-form');
    const commentsDisplay = document.getElementById('comments-display');

    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const textArea = document.getElementById('comment-text');
        const textValue = textArea.value.trim();
        
        if (textValue) {
            const commentItem = document.createElement('div');
            commentItem.classList.add('comment-item');
            
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            
            commentItem.innerHTML = `
                <p style="margin: 0 0 5px 0; font-size: 0.85rem; color: var(--color-accent); font-weight: bold;">Leitor Conectado &bull; ${timeString}</p>
                <p style="margin: 0;">${escapeHTML(textValue)}</p>
            `;
            
            // Adiciona o novo comentário no topo da listagem
            commentsDisplay.insertBefore(commentItem, commentsDisplay.firstChild);
            textArea.value = "";
        }
    });

    /* ==========================================================================
       5. ENVIO DO FORMULÁRIO DE INSCRIÇÃO DA SIDEBAR
       ========================================================================== */
    const subscribeForm = document.getElementById('subscribe-form');
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameValue = document.getElementById('input-name').value;
        alert(`Obrigado pelo interesse, ${nameValue}! Seus dados foram salvos na nossa malha Agrotech com sucesso.`);
        subscribeForm.reset();
    });

    // Sanitização simples contra falhas de segurança XSS nos comentários inseridos
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});