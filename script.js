const appThemeButton = document.getElementById('button-theme');

appThemeButton.addEventListener('click', () => {
    const htmlTag = document.documentElement;
    const currentAppTheme = htmlTag.getAttribute('app-theme');

    currentAppTheme === 'light' ? htmlTag.setAttribute('app-theme', 'dark') : htmlTag.setAttribute('app-theme', 'light');
})