// js/scanner.js

let currentScanTargetInputId = null; // Armazena o ID do campo input que deve receber o scan
let barcodeValue = ''; // Acumula os caracteres do scanner
let scanningTimeout; // Para limpar o barcodeValue se o scanner parar de enviar dados

/**
 * Ativa o modo de escaneamento.
 * Exibe um alerta visual e foca no input oculto para capturar leituras.
 * @param {string} targetInputId O ID do input HTML onde o valor do código de barras deve ser colocado.
 */
function activateScannerMode(inputId) {
    currentScanTargetInputId = inputId;
    barcodeValue = ''; // Reseta o valor acumulado
    
    // Cria ou pega o input oculto para captura
    let hiddenScanInput = document.getElementById('hiddenScanInput');
    if (!hiddenScanInput) {
        hiddenScanInput = document.createElement('input');
        hiddenScanInput.type = 'text';
        hiddenScanInput.id = 'hiddenScanInput';
        hiddenScanInput.style.position = 'absolute'; // Torna-o invisível
        hiddenScanInput.style.left = '-9999px';
        hiddenScanInput.style.opacity = '0';
        document.body.appendChild(hiddenScanInput);

        // Adiciona o listener para capturar a entrada do scanner
        hiddenScanInput.addEventListener('keydown', handleScannerInput);
    }
    
    // Foca no input oculto para que o scanner direcione os dados para ele
    hiddenScanInput.focus();

    // Notifica o usuário
    alert('Modo Scanner Ativo! Passe o scanner USB no código de barras. O valor será inserido no campo.');

    // Opcional: Adicionar um feedback visual na tela (ex: um spinner, uma mensagem temporária)
    // Para um projeto mais complexo, você pode usar uma modal Bootstrap ou um Toast aqui.
    // Exemplo: showToast('Modo Scanner Ativo...');
}

/**
 * Lida com a entrada de dados do scanner.
 * Scanners USB simulam teclado, então capturamos keydown/keypress.
 * @param {KeyboardEvent} event
 */
function handleScannerInput(event) {
    clearTimeout(scanningTimeout); // Reseta o timeout a cada tecla

    if (event.key === 'Enter') { // A maioria dos scanners envia ENTER no final
        event.preventDefault(); // Impede o Enter de submeter formulários ou adicionar nova linha

        if (barcodeValue && currentScanTargetInputId) {
            const targetInput = document.getElementById(currentScanTargetInputId);
            if (targetInput) {
                targetInput.value = barcodeValue; // Preenche o campo de destino
                targetInput.dispatchEvent(new Event('change')); // Dispara evento 'change' se necessário para outros listeners
            }
        }
        
        barcodeValue = ''; // Reseta para a próxima leitura
        currentScanTargetInputId = null; // Desativa o modo scanner para este botão
        // Opcional: Remover foco do input oculto ou focar em outro lugar
        // hiddenScanInput.blur(); 
        // alert('Leitura concluída e campo preenchido.'); // Feedback visual se necessário
        
    } else if (event.key.length === 1) { // Captura caracteres normais (evita Shift, Ctrl, etc.)
        barcodeValue += event.key;
        // console.log("Código de barras acumulado:", barcodeValue); // Para depuração
    }

    // Define um timeout para resetar o barcodeValue se nenhuma nova tecla for pressionada por um tempo
    // Isso é útil se o scanner for desconectado ou se houver um erro na leitura.
    scanningTimeout = setTimeout(() => {
        barcodeValue = ''; // Limpa se o scanner parar de enviar dados por muito tempo
        // console.log("Timeout: Barcode value reset.");
    }, 100); // Ajuste este tempo se os scanners forem muito lentos
}

// Opcional: Adicionar um evento global para limpar o modo scanner se o usuário clicar fora ou pressionar ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentScanTargetInputId) {
        alert('Modo Scanner Desativado.');
        barcodeValue = '';
        currentScanTargetInputId = null;
        const hiddenScanInput = document.getElementById('hiddenScanInput');
        if (hiddenScanInput) {
            hiddenScanInput.blur(); // Remove o foco do input oculto
        }
    }
});

// Nota: Este script deve ser carregado DEPOIS dos seus elementos HTML
// que contêm os IDs dos inputs de destino.
