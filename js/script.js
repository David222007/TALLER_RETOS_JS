let pantalla = document.getElementById('pantalla');
let operacionActual = '';
let operadorAnterior = null;
let esperandoOperando = false;

function actualizarPantalla() {
    pantalla.textContent = operacionActual || '0';
}

function limpiar() {
    operacionActual = '';
    operadorAnterior = null;
    esperandoOperando = false;
    actualizarPantalla();
}

function borrar() {
    if (operacionActual.length > 0) {
        operacionActual = operacionActual.slice(0, -1);
        actualizarPantalla();
    }
}

function agregarNumero(numero) {
    if (esperandoOperando) {
        operacionActual = numero;
        esperandoOperando = false;
    } else {
        operacionActual += numero;
    }
    actualizarPantalla();
}

function agregarPunto() {
    if (esperandoOperando) {
        operacionActual = '0.';
        esperandoOperando = false;
    } else if (!operacionActual.includes('.')) {
        operacionActual += '.';
    }
    actualizarPantalla();
}

function agregarOperador(operador) {
    if (operacionActual === '') return;

    // Evitar duplicar operadores al final
    const lastChar = operacionActual.trim().slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        operacionActual = operacionActual.slice(0, -1);
    }

    operacionActual += operador;
    operadorAnterior = operador;
    esperandoOperando = false;
    actualizarPantalla();
}

function calcular() {
    if (operadorAnterior === null || esperandoOperando) return;

    try {
        let expresion = operacionActual.replace(/×/g, '*').replace(/÷/g, '/');

        let resultado = Function('"use strict"; return (' + expresion + ')')();

        resultado = Math.round((resultado + Number.EPSILON) * 100000000) / 100000000;

        operacionActual = resultado.toString();
        operadorAnterior = null;
        esperandoOperando = true;
        actualizarPantalla();
    } catch (error) {
        operacionActual = 'Error';
        operadorAnterior = null;
        esperandoOperando = true;
        actualizarPantalla();
    }
}

// Soporte para teclado
document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        agregarNumero(key);
    } else if (key === '.') {
        agregarPunto();
    } else if (['+', '-', '*', '/'].includes(key)) {
        event.preventDefault(); // evita acción por defecto (como búsqueda)
        agregarOperador(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calcular();
    } else if (key === 'Escape') {
        limpiar();
    } else if (key === 'Backspace') {
        borrar();
    }
});

// Inicializar
actualizarPantalla();