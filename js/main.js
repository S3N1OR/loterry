const editMembers = document.querySelector('.edit-members');
const editMembersItems = document.querySelectorAll('.edit-members-item');
const edit = document.querySelector('.edit');

const tableMembers = document.querySelector('.table-members');

let countEditMember = 0;

function saveData() {
  savePrizes();

  const editMembersItems = document.querySelectorAll('.edit-members-item');
  const savedData = [];

  editMembersItems.forEach((item) => {
    const nickname = item.querySelector('.edit-members-nickname').value;
    const tickets = parseInt(item.querySelector('.edit-members-tickets').value);
    savedData.push({ nickname, tickets });
  });

  localStorage.setItem('savedData', JSON.stringify(savedData));
}

function loadData() {
  const savedData = JSON.parse(localStorage.getItem('savedData'));

  editMembers.innerHTML = '';

  if (savedData) {
    savedData.forEach((data, index) => {
      const newItem = document.createElement('div');
      newItem.classList.add('edit-members-item');

      if (index === 0) {
        newItem.innerHTML = `<div class="edit-members-content"><h2>Номер</h2><div class="edit-members-index">${index + 1}</div></div><div class="edit-members-content"><h2>NickName</h2><input class="edit-members-nickname" value="${data.nickname}"></input></div><div class="edit-members-content"><h2>купленные<br>билеты</h2><input type="number" class="edit-members-tickets" value="${data.tickets}"></input></div><div class="edit-members-content"><h2>Выигрыш</h2><div class="edit-members-win">$0</div></div>`;
      } else {
        newItem.innerHTML = `<div class="edit-members-index">${index + 1}</div><input class="edit-members-nickname" value="${data.nickname}"></input><input type="number" class="edit-members-tickets" value="${data.tickets}"></input><div class="edit-members-win">$0</div>`;
      }
      
      editMembers.appendChild(newItem);
    });

    countEditMember = savedData.length;
  }
}

function savePrizes() {
  const prizes = [];

  const prizeInputs = document.querySelectorAll('.edit-prizes-item input[type="number"]');
  
  prizeInputs.forEach(input => {
    prizes.push(parseInt(input.value));
  });

  localStorage.setItem('prizes', JSON.stringify(prizes));
}

function loadPrizes() {
  const prizes = JSON.parse(localStorage.getItem('prizes'));

  if (prizes && prizes.length === 6) {
    const prizeInputs = document.querySelectorAll('.edit-prizes-item input[type="number"]');
    
    prizeInputs.forEach((input, index) => {
      input.value = prizes[index];
    });
  }
}

window.onload = function() {
  loadPrizes();
  loadData();
};

function editMemberAdd(){
  countEditMember++;

  let newEditMembersItem = document.createElement('div');
  newEditMembersItem.classList.add('edit-members-item');

  if (countEditMember === 1) {
    newEditMembersItem.innerHTML = `<div class="edit-members-content"><h2>Номер</h2><div class="edit-members-index">${countEditMember}</div></div><div class="edit-members-content"><h2>NickName</h2><input class="edit-members-nickname"></input></div><div class="edit-members-content"><h2>купленные<br>билеты</h2><input type="number" class="edit-members-tickets"></input></div><div class="edit-members-content"><h2>Выигрыш</h2><div class="edit-members-win">$0</div></div>`;
  } else {
    newEditMembersItem.innerHTML = `<div class="edit-members-index">${countEditMember}</div><input class="edit-members-nickname"></input><input type="number" class="edit-members-tickets"></input><div class="edit-members-win">$0</div>`;
  }

  editMembers.appendChild(newEditMembersItem);

  nicknames.push('');
  console.log(nicknames);
}


function editMemberRemove(){
  if(countEditMember > 0){
    countEditMember--;
    editMembers.removeChild(editMembers.lastChild);
    
    
    nicknames.pop();
    console.log(nicknames);
  }
}

function generateRandomTicket() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkWinningTickets(randomNumberString, mainTicketNumber) {
  let matches = 0;

  for (let j = 0; j < 6; j++) {
    if (randomNumberString[j] === mainTicketNumber[j]) {
      matches++;
    }
  }

  let prize = 0;
  switch (matches) {
    case 1:
      prize = parseInt(document.getElementById('prize1').value);
      break;
    case 2:
      prize = parseInt(document.getElementById('prize2').value);
      break;
    case 3:
      prize = parseInt(document.getElementById('prize3').value);
      break;
    case 4:
      prize = parseInt(document.getElementById('prize4').value);
      break;
    case 5:
      prize = parseInt(document.getElementById('prize5').value);
      break;
    case 6:
      prize = parseInt(document.getElementById('prize6').value);
      break;
    default:
      break;
  }

  return prize;
}

function updateMembers() {
  mainTicketShuffle();
  const editMembersItems = document.querySelectorAll('.edit-members-item');
  const mainTicketNumber = document.querySelector('.table-main-ticket').textContent;
  let allTicketsCount = 0;

  tableMembers.innerHTML = '';

  editMembersItems.forEach((item) => {
    const nickname = item.querySelector('.edit-members-nickname').value;
    const tickets = parseInt(item.querySelector('.edit-members-tickets').value);
    let totalPrize = 0;

    if (!isNaN(tickets)) {
      let newItem = '';
      let totalMatches = 0;

      for (let i = 0; i < tickets; i++) {
        const randomNumber = generateRandomTicket();
        const randomNumberString = randomNumber.toString().padStart(6, '0');
        const matches = checkWinningTickets(randomNumberString, mainTicketNumber);

        totalMatches += matches;

        newItem += `<div class="table-members-item">
                      <div class="table-members-nickname">${nickname}</div>
                      <div class="table-members-tickets">
                        <div class="table-members-ticket">${randomNumber}</div>
                        <div class="main-ticket-digit">${randomNumberString[0]}</div>
                        <div class="main-ticket-digit">${randomNumberString[1]}</div>
                        <div class="main-ticket-digit">${randomNumberString[2]}</div>
                        <div class="main-ticket-digit">${randomNumberString[3]}</div>
                        <div class="main-ticket-digit">${randomNumberString[4]}</div>
                        <div class="main-ticket-digit">${randomNumberString[5]}</div>
                      </div>
                    </div>`;   

        totalPrize += matches;
      }

      allTicketsCount += tickets;

      const winElement = item.querySelector('.edit-members-win');
      winElement.textContent = `$${totalPrize.toLocaleString()}`;

      tableMembers.innerHTML += newItem;
    }
  });

  shuffleMembers(mainTicketNumber);
  highlightDigits(mainTicketNumber);
}

function mainTicketShuffle() {
  const mainTicket = document.querySelector('.table-main-ticket');
  const mainTicketDigit = document.querySelectorAll('.main-ticket-digit');

  const randomNumber = generateRandomTicket();
  mainTicket.textContent = randomNumber;

  for (let i = 0; i < mainTicket.textContent.length; i++) {
    mainTicketDigit[i].textContent = mainTicket.textContent.split('')[i];
  }
}

function shuffleMembers(mainTicketNumber) {
  const tableMembers = document.querySelector('.table-members');
  const members = Array.from(tableMembers.querySelectorAll('.table-members-item'));
  
  for (let i = members.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [members[i], members[j]] = [members[j], members[i]];
  }
  
  tableMembers.innerHTML = '';
  
  members.forEach(member => tableMembers.appendChild(member));

  highlightDigits(mainTicketNumber);
}

function highlightDigits(mainTicketNumber) {
  const members = document.querySelectorAll('.table-members-item');

  members.forEach((member) => {
    const memberDigits = member.querySelectorAll('.main-ticket-digit');

    memberDigits.forEach((digit, index) => {
      if (digit.textContent === mainTicketNumber[index]) {
        digit.classList.add('yellow-digit');
      } 
      else{
        digit.classList.remove('yellow-digit');
      }
    });
  });
}
