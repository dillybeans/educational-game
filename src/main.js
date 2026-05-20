import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { authClient } from './authClient.bundle.js';
import audioEngine from './AudioEngine.js';

// Expose AudioEngine globally for Phaser scenes to access
window.audioEngine = audioEngine;

// ── Phaser Config ──
const config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    render: {
        antialias: true,
        roundPixels: true,
        pixelArt: false,
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: [MenuScene, GameScene, ResultScene],
    backgroundColor: '#0D0D1A'
};

let game;
let isGuest = false;

// ── View Management ──
window.showView = function(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
};

// ── Guest Mode ──
window.startGuestMode = function() {
    isGuest = true;
    showView('game-page');
    initGame();
};

// ── Instructions Modal ──
window.showInstructions = function() {
    document.getElementById('instructions-modal').style.display = 'flex';
};
window.hideInstructions = function() {
    document.getElementById('instructions-modal').style.display = 'none';
};

// ── Init Game ──
function initGame() {
    if (!game) {
        const logoutContainer = document.getElementById('logout-container');
        if (!isGuest) logoutContainer.style.display = 'block';
        game = new Phaser.Game(config);
    }
}

// ── Auth UI ──
const authForm = document.getElementById('auth-form');
const authName = document.getElementById('auth-name');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authTitle = document.getElementById('auth-title');
const authSubmit = document.getElementById('auth-submit');
const authToggle = document.getElementById('auth-toggle');
const authError = document.getElementById('auth-error');
const authGithub = document.getElementById('auth-github');
const authGoogle = document.getElementById('auth-google');
const authLogoutBtn = document.getElementById('auth-logout');

let isLoginMode = true;

// Check existing session on load
authClient.getSession().then(({ data }) => {
    if (data?.session) {
        showView('game-page');
        initGame();
    }
});

authToggle.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'WELCOME BACK' : 'CREATE ACCOUNT';
    authSubmit.textContent = isLoginMode ? 'LOG IN' : 'SIGN UP';
    authToggle.textContent = isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in";
    authName.style.display = isLoginMode ? 'none' : 'block';
    authName.required = !isLoginMode;
    authError.textContent = '';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;
    const name = authName.value || 'Player';
    authError.textContent = '';
    authSubmit.disabled = true;

    let result;
    if (isLoginMode) {
        result = await authClient.signIn.email({ email, password });
    } else {
        result = await authClient.signUp.email({ email, password, name });
    }

    if (result.error) {
        authError.textContent = result.error.message || 'Authentication failed.';
        authSubmit.disabled = false;
    } else {
        showView('game-page');
        initGame();
    }
});

const handleSocialInfo = () => {
    authError.textContent = "Social keys not yet configured. Please use Email.";
};

authGithub.addEventListener('click', () => authClient.signIn.social({ provider: 'github' }).catch(handleSocialInfo));
authGoogle.addEventListener('click', () => authClient.signIn.social({ provider: 'google' }).catch(handleSocialInfo));

authLogoutBtn.addEventListener('click', async () => {
    await authClient.signOut();
    window.location.reload();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideInstructions();
    }
});
