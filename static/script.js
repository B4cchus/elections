// Fetch candidate names dynamically
const cds = new URLSearchParams(window.location.search).get("cds");
const candidates = cds ? cds.split(',').map(item => item.trim()) : [];
const election_id = new URLSearchParams(window.location.search).get("id");

//Submission endpoint
const submit_url = "/submit_vote"

// DOM elements
const candidateList = document.getElementById('candidate-list');
const rankPopup = document.getElementById('rank-popup');
const rankPopupContent = document.getElementById('rank-popup-content');
const submitBallot = document.getElementById('submit-ballot');
const pwd = document.getElementById("pwd");

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
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

submitBallot.onclick = async () => {
  submitBallot.textContent = "Отправляю...";
  submitBallot.disabled = true;
  console.log('Submitting ballot:', [election_id, rankedCandidates]);

  let pwd_hash = pwd.value;
  for (let i = 0; i < 10; i++) {
    pwd_hash = await sha256(pwd_hash);
  }
  
  fetch(submit_url.concat("?election_id=", election_id, "&cds=", rankedCandidates.join(","), "&vr_id=", pwd_hash), {
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": 0,
    }
  })
  .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(responseData => {
      console.log("Response from server:", responseData);
      submitBallot.textContent = "Отправлено!";
      submitBallot.style.backgroundColor = "green";
  })
  .catch(error => {
      console.error("Error during the POST request:", error);
      submitBallot.textContent = "Не удалось!";
      submitBallot.style.backgroundColor = "red";
  });
};

// Initialize
renderCandidates();
document.getElementById("header").textContent = "Бюллетень для ".concat(election_id);
