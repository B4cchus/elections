// Fetch unique ID and candidate names dynamically (mock data for now)
const urlParams = new URLSearchParams(window.location.search);
const ballotId = urlParams.get('id');
const cds = new URLSearchParams(window.location.search).get("cds");
const candidates = cds ? cds.split(',').map(item => item.trim()) : [];

// DOM elements
const candidateList = document.getElementById('candidate-list');
const rankPopup = document.getElementById('rank-popup');
const rankPopupContent = document.getElementById('rank-popup-content');
const submitBallot = document.getElementById('submit-ballot');

// State management
let rankedCandidates = [];
let maxRank = candidates.length;

// Render candidate boxes
function renderCandidates() {
  candidateList.innerHTML = '';
  rankedCandidates.forEach((name, rank) => {
    const candidate = document.createElement('div');
    candidate.className = 'candidate-box ranked';
    candidate.textContent = `${rank + 1}. ${name}`;
    candidate.onclick = () => openRankPopup(name);
    candidateList.appendChild(candidate);
  });
  candidates.filter(c => !rankedCandidates.includes(c)).forEach(name => {
    const candidate = document.createElement('div');
    candidate.className = 'candidate-box';
    candidate.textContent = name;
    candidate.onclick = () => rankCandidate(name);
    candidateList.appendChild(candidate);
  });
}

// Rank a candidate
function rankCandidate(name) {
  if (rankedCandidates.length < maxRank) {
    rankedCandidates.push(name);
    renderCandidates();
  }
}

// Open rank reassignment pop-up
function openRankPopup(name) {
  rankPopup.classList.remove('hidden');
  rankPopupContent.innerHTML = '';

  // Rank options
  rankedCandidates.forEach((_, index) => {
    const option = document.createElement('div');
    option.className = 'rank-option';
    option.textContent = index + 1;
    option.onclick = () => reassignRank(name, index);
    rankPopupContent.appendChild(option);
  });

  // Remove option
  const removeOption = document.createElement('div');
  removeOption.className = 'rank-remove';
  removeOption.textContent = 'Remove';
  removeOption.onclick = () => removeCandidate(name);
  rankPopupContent.appendChild(removeOption);
}

// Reassign a rank
function reassignRank(name, newRank) {
  rankedCandidates = rankedCandidates.filter(c => c !== name);
  rankedCandidates.splice(newRank, 0, name);
  rankPopup.classList.add('hidden');
  renderCandidates();
}

// Remove a candidate
function removeCandidate(name) {
  rankedCandidates = rankedCandidates.filter(c => c !== name);
  rankPopup.classList.add('hidden');
  renderCandidates();
}

// Submit the ballot
submitBallot.onclick = () => {
  const ballotData = {
    ballotId,
    rankedCandidates
  };
  console.log('Submitting ballot:', ballotData);
  // You can send the data to your server here using fetch or XMLHttpRequest
};

// Initialize
renderCandidates();
