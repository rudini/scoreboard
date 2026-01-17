// Avatar collection from popular emoji and Unicode characters
const avatars = [
    '🚀',
    '⚡',
    '🔥',
    '🎯',
    '🏃',
    '💪',
    '🦾',
    '🧠',
    '👽',
    '🤖',
    '🦸',
    '🧙',
    '🐺',
    '🦅',
    '🐉',
    '🦍',
    '🐯',
    '🦁',
    '🐺',
    '🌪️',
    '❄️',
    '⚔️',
    '🗡️',
    '🛡️',
    '💎',
    '👑',
    '🎭',
    '🎪',
    '🎨',
    '🎸',
    '⚽',
    '🏀',
    '🎮',
    '🚁',
    '🚂',
    '⛵',
    '🌟',
    '⭐',
    '✨',
    '🌈',
    '☄️'
];

// Initialize avatar grid
document.addEventListener('DOMContentLoaded', function() {
    const avatarGrid = document.getElementById('avatarGrid');
    const selectedAvatarInput = document.getElementById('selectedAvatar');
    
    avatars.forEach(avatar => {
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option';
        avatarOption.textContent = avatar;
        avatarOption.title = avatar;
        
        avatarOption.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            selectedAvatarInput.value = avatar;
        });
        
        avatarGrid.appendChild(avatarOption);
    });
});
