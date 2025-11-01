// CONFIGURAÇÃO DO CONTRATO
const CONTRACT_ADDRESS = "0x729abA65933f5663e0A55EF65A70feC97a8a0af9";
const CONTRACT_ABI = [ 
  // Cole aqui todo o ABI que você enviou
];

// ESTADO DO TABULEIRO
let boardState = Array(8).fill(null); // 8 colunas
const boardDiv = document.getElementById('board');
const mintButton = document.getElementById('mintButton');

// CRIA TABULEIRO
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const cell = document.createElement('div');
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener('click', () => placeQueen(row, col, cell));
    boardDiv.appendChild(cell);
  }
}

// CHECA SE UMA CELULA É ATACADA
function isAttacked(r, c) {
  for (let col = 0; col < 8; col++) {
    const row = boardState[col];
    if (row === null) continue;
    if (row === r || col === c || Math.abs(row - r) === Math.abs(col - c)) return true;
  }
  return false;
}

// ATUALIZA VISUAL DO TABULEIRO
function updateBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      cell.classList.remove('queen','invalid');
      if (boardState[col] === row) {
        cell.classList.add('queen');
        cell.textContent = '♛';
      } else if (isAttacked(row, col)) {
        cell.classList.add('invalid');
        cell.textContent = '';
      } else {
        cell.textContent = '';
      }
    }
  }
}

// COLOCAR RAINHA
function placeQueen(row, col, cell) {
  boardState[col] = row;
  updateBoard();
  mintButton.disabled = boardState.some(r => r === null);
}

// MINT NFT
mintButton.addEventListener('click', async () => {
  if (!window.ethereum) return alert('Instale MetaMask ou Rabby!');

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const score = boardState.join(',');
    const tokenURI = JSON.stringify({ score, timestamp: Date.now() });

    const tx = await contract.mintScore(tokenURI, { gasLimit: 200000 });
    await tx.wait();

    alert("NFT mintada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao mintar NFT: " + err.message);
  }
});
