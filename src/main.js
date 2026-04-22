import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { ResultScene } from './scenes/ResultScene.js';
import { authClient } from './authClient.bundle.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: { 
            debug: false 
        }
    },
    scene: [MenuScene, GameScene, ResultScene],
    backgroundColor: '#030914'
};

let game;

const logoutContainer = document.getElementById('logout-container');
const authLogoutBtn = document.getElementById('auth-logout');

function initGame() {
    if (!game) {
        document.getElementById('game-container').style.display = 'block';
        logoutContainer.style.display = 'block';
        game = new Phaser.Game(config);
    }
}

// Authentication UI Flow
const authContainer = document.getElementById('auth-container');
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

let isLoginMode = true;

// Check existing session
authClient.getSession().then(({ data }) => {
    if (data?.session) {
        authContainer.classList.add('hidden');
        initGame();
    }
});

authToggle.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    authTitle.textContent = isLoginMode ? 'Welcome back' : 'Create Account';
    authSubmit.textContent = isLoginMode ? 'Log In' : 'Sign Up';
    authToggle.textContent = isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in";
    authName.style.display = isLoginMode ? 'none' : 'block';
    authName.required = !isLoginMode;
    authError.style.display = 'none';
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;
    const name = authName.value || 'Player';
    authError.style.display = 'none';
    authSubmit.disabled = true;
    
    let result;
    if (isLoginMode) {
        result = await authClient.signIn.email({ email, password });
    } else {
        result = await authClient.signUp.email({ email, password, name });
    }

    if (result.error) {
        authError.textContent = result.error.message || 'Authentication failed.';
        authError.style.display = 'block';
        authSubmit.disabled = false;
    } else {
        authContainer.classList.add('hidden');
        initGame();
    }
});

const handleSocialInfo = () => {
    authError.textContent = "Social keys not yet configured. Please use Email.";
    authError.style.display = 'block';
};

authGithub.addEventListener('click', () => authClient.signIn.social({ provider: 'github' }).catch(handleSocialInfo));
authGoogle.addEventListener('click', () => authClient.signIn.social({ provider: 'google' }).catch(handleSocialInfo));

authLogoutBtn.addEventListener('click', async () => {
    await authClient.signOut();
    window.location.reload();
});
