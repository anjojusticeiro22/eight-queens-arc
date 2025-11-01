// === CONFIGURAÇÃO DO CONTRATO ===
const CONTRACT_ADDRESS = "0x729abA65933f5663e0A55EF65A70feC97a8a0af9";
const CONTRACT_ABI = [ 
  // Cole aqui todo o ABI que você enviou
];

// === ESTADO DO TABULEIRO ===
let boardState = Array(8).fill(null); // 8 colunas
const boardDiv = document.getElementById('board');
const mintButton = document.getElementById('mintButton');

// === CRIA TABULEIRO ===
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const cell = document.createElement('div');
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.addEventListener('click', () => placeQueen(row, col, cell));
    boardDiv.appendChild(cell);
  }
}

// === FUNÇÃO PARA COLOCAR RAINHA ===
function placeQueen(row, col, cell) {
  // Remove rainha anterior na coluna
  if (boardState[col] !== null) {
    const prevRow = boardState[col];
    const prevCell = document.querySelector(`[data-row="${prevRow}"][data-col="${col}"]`);
    prevCell.classList.remove('red');
    prevCell.textContent = '';
  }

  // Atualiza estado e visual
  boardState[col] = row;
  cell.classList.add('red');
  cell.textContent = '♛';

  // Habilita botão só se 8 rainhas estiverem
  mintButton.disabled = boardState.some(r => r === null);
}

// === FUNÇÃO DE MINT ===
mintButton.addEventListener('click', async () => {
  if (!window.ethereum) return alert('Instale MetaMask ou Rabby!');

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Score do jogador
    const score = boardState.join(',');
    const tokenURI = JSON.stringify({ score, timestamp: Date.now() });

    // Mint NFT pagando apenas gas
    const tx = await contract.mintScore(tokenURI, { gasLimit: 200000 });
    await tx.wait();

    alert("NFT mintada com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao mintar NFT: " + err.message);
  }
});
