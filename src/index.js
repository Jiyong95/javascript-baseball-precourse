import { NumberRules, Message } from './constant.js';

export default class BaseballGame {
  constructor() {
    this.answer = this.getAnswer();
    this.userInputEl = document.querySelector('#user-input');
    this.resultEl = document.querySelector('#result');
    this.appEl = document.querySelector('#app');
    this.submitButtonEl = document.querySelector('#submit');
    this.submitButtonEl.addEventListener('click', this.submitButtonHandle);
  }

  getAnswer() {
    const answer = [];
    while (answer.length < NumberRules.length) {
      const num = MissionUtils.Random.pickNumberInRange(
        NumberRules.min,
        NumberRules.max,
      );
      if (answer.indexOf(num) === -1) {
        answer.push(num);
      }
    }

    return answer.join('');
  }

  isDifferentInputNumber(userInputNumbers) {
    const userInputSet = new Set(userInputNumbers.split(''));
    if (userInputSet.size !== userInputNumbers.length) {
      return false;
    }

    return true;
  }

  isInputNumberWithinRange(userInputNumbers) {
    for (let i = 0; i < userInputNumbers.length; i += 1) {
      if (
        userInputNumbers[i] < `${NumberRules.min}` ||
        userInputNumbers[i] > `${NumberRules.max}`
      ) {
        return false;
      }
    }

    return true;
  }

  isCorrectInputNumberLength(userInputNumbers) {
    if (userInputNumbers.length === NumberRules.length) {
      return true;
    }

    return false;
  }

  isAllCorrectInputNumber(userInputNumbers) {
    return (
      this.isDifferentInputNumber(userInputNumbers) &&
      this.isInputNumberWithinRange(userInputNumbers) &&
      this.isCorrectInputNumberLength(userInputNumbers)
    );
  }

  compareAnswer(computerInputNumbers, userInputNumbers) {
    let strikeCount = 0;
    let ballCount = 0;
    userInputNumbers.split('').forEach((element, index) => {
      if (computerInputNumbers.indexOf(element) === index) {
        strikeCount += 1;
      }
      if (
        computerInputNumbers.indexOf(element) !== index &&
        computerInputNumbers.indexOf(element) !== -1
      ) {
        ballCount += 1;
      }
    });

    return [strikeCount, ballCount];
  }

  submitButtonHandle = () => {
    if (this.isAllCorrectInputNumber(this.userInputEl.value)) {
      this.resultEl.innerHTML = this.resultText(
        this.compareAnswer(this.answer, this.userInputEl.value),
      );
    } else {
      alert(Message.error);
    }
    this.userInputEl.value = '';
  };

  strikeBallText(strikeCount, ballCount) {
    let printText = '';
    if (ballCount !== 0) {
      printText += `${ballCount}볼`;
    }
    if (ballCount !== 0 && strikeCount !== 0) {
      printText += ' ';
    }
    if (strikeCount !== 0) {
      printText += `${strikeCount}스트라이크`;
    }
    if (ballCount === 0 && strikeCount === 0) {
      printText += '낫싱';
    }

    return printText;
  }

  resultText([strikeCount, ballCount]) {
    if (strikeCount === 3) {
      this.createRestartSpan();
      this.createRestartButton();
      this.submitButtonEl.removeEventListener('click', this.submitButtonHandle);
      return Message.success;
    }

    return this.strikeBallText(strikeCount, ballCount);
  }

  createRestartSpan() {
    this.restartTextEl = document.createElement('span');
    this.restartTextEl.innerHTML = '게임을 새로 시작하시겠습니까? ';
    this.appEl.appendChild(this.restartTextEl);
  }

  createRestartButton() {
    this.restartButtonEl = document.createElement('button');
    this.restartButtonEl.id = 'game-restart-button';
    this.restartButtonEl.innerHTML = '재시작';
    this.restartButtonEl.addEventListener('click', (e) => {
      this.answer = this.getAnswer();
      this.submitButtonEl.addEventListener('click', this.submitButtonHandle);
      this.userInputEl.value = '';
      this.resultEl.innerHTML = '';
      this.restartTextEl.remove();
      e.target.remove();
    });
    this.appEl.appendChild(this.restartButtonEl);
  }

  play(computerInputNumbers, userInputNumbers) {
    if (
      this.isAllCorrectInputNumber(computerInputNumbers) &&
      this.isAllCorrectInputNumber(userInputNumbers)
    ) {
      return this.resultText(
        this.compareAnswer(computerInputNumbers, userInputNumbers),
      );
    }
    alert(Message.error);

    return Message.error;
  }
}

new BaseballGame();
