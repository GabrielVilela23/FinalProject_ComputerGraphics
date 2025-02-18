export class Screen {
    constructor() {
      this.menuScreen = document.getElementById('menu');
      this.winScreen = document.getElementById('win-game');
      this.gameOverScreen = document.getElementById('game-over');
      this.startButton = document.getElementById('start-btn');
      this.gameOverButton = document.getElementById('game-over-btn');
      this.winGameButton = document.getElementById('win-btn');
      this.initListeners();
    }
  
    initListeners() {
      if (this.startButton) {
        this.startButton.addEventListener('click', () => this.onStart());
      }
      if(this.gameOverButton) {
        this.gameOverButton.addEventListener('click', () => this.onStart());
      }
      if(this.winGameButton) {
        this.winGameButton.addEventListener('click', () => this.onStart());
      }
    }
  
    showScreen(screen) {
      this.hideAllScreens();
      if (screen) {
        screen.classList.remove('hidden');
      }
    }
  
    hideAllScreens() {
      this.menuScreen.classList.add('hidden');
      this.winScreen.classList.add('hidden');
      this.gameOverScreen.classList.add('hidden');
    }
  
    showMenu() {
      this.showScreen(this.menuScreen);
    }
  
    showWinScreen() {
      this.showScreen(this.winScreen);
    }
  
    showGameOverScreen() {
      this.showScreen(this.gameOverScreen);
    }
  
    onStart() {
      let canvas = document.querySelector('canvas');
      if (canvas) {
          canvas.remove();
      }
      console.log('Game started!');
      this.hideAllScreens();
      const startEvent = new CustomEvent('startGame');
      document.dispatchEvent(startEvent);
    }
}