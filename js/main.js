const tarotDeck = [
  { name: 'The Fool', meaning: 'New beginnings, optimism, trust in life, stepping into the unknown.', image: 'The Fool .png' },
  { name: 'The Magician', meaning: 'Action, the power to manifest, creativity, resourcefulness.', image: 'The Magician .png.webp' },
  { name: 'The High Priestess', meaning: 'Intuition, subconscious, mystery, inner voice.', image: 'The High Priestess.png' },
  { name: 'The Empress', meaning: 'Abundance, nurturing, fertility, life in bloom.', image: 'The Empress .webp' },
  { name: 'The Emperor', meaning: 'Structure, stability, rules and power, authority.', image: 'The Emperor .webp' },
  { name: 'The Hierophant', meaning: 'Tradition, spiritual guidance, education, belief systems.', image: 'The Hierophant .webp' },
  { name: 'The Lovers', meaning: 'Partnerships, duality, choice, union.', image: 'The Lovers .webp' },
  { name: 'The Chariot', meaning: 'Direction, control, willpower, victory.', image: 'The Chariot .webp' },
  { name: 'Strength', meaning: 'Inner strength, bravery, compassion, focus.', image: 'Strength.webp' },
  { name: 'The Hermit', meaning: 'Contemplation, search for truth, inner guidance.', image: 'The Hermit .webp' },
  { name: 'Wheel of Fortune', meaning: 'Change, cycles, inevitable fate, luck.', image: 'Wheel of Fortune.webp' },
  { name: 'Justice', meaning: 'Cause and effect, clarity, truth, balance.', image: 'Justice .webp' }
];

// === Hamburger Menu Toggle ===
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.querySelector('.header').classList.toggle('menu-open');
    });
    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        document.querySelector('.header').classList.remove('menu-open');
      });
    });
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
        document.querySelector('.header').classList.remove('menu-open');
      }
    });
  }
});

// === Tarot Reading Logic ===

let selectedCards = [];
let selectedSlots = [null, null, null]; // track which slots are occupied
let availableCards = [...tarotDeck];

document.addEventListener('DOMContentLoaded', () => {
  const tarotGrid = document.getElementById('tarotGrid');
  if (!tarotGrid) return; // Only run on reading page

  initDeck(); // สร้างไพ่และกางพัด

  document.getElementById('resetBtn').addEventListener('click', () => {
    selectedCards = [];
    selectedSlots = [null, null, null];
    availableCards = [...tarotDeck];
    document.getElementById('resultSection').classList.remove('active');
    tarotGrid.innerHTML = '';

    // Remove animation classes if any remain
    document.querySelectorAll('.tarot-card').forEach(c => {
      c.classList.remove('merged', 'dimmed');
    });

    initDeck();
    resetResultUI();
  });

  // Shuffle button - reshuffle the deck without clearing selections
  const shuffleBtn = document.getElementById('shuffleBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      if (selectedCards.length > 0) return; // Don't shuffle mid-pick
      availableCards = [...tarotDeck];
      tarotGrid.innerHTML = ''; // ลบไพ่เก่าออกจากหน้า
      initDeck();
      // Spin animation on button
      // shuffleBtn.classList.add('shuffling');
      // setTimeout(() => shuffleBtn.classList.remove('shuffling'), 600);
    });
  }
});


// main logic
function initDeck() {
  const tarotGrid = document.getElementById('tarotGrid');
  // Shuffle cards
  availableCards.sort(() => Math.random() - 0.5);

  // Render 12 cards for the user to choose from
  for (let i = 0; i < 12; i++) {
    const cardEl = document.createElement('div');
    cardEl.className = 'tarot-card';

    // Calculate arc คำณวนตำแหน่ง
    const angle = (i - 5.5) * 5; // Spread angle (slightly flattened)
    const xOffset = (i - 5.5) * 30; // Horizontal spacing (30px per card = ~330px total width)
    const yOffset = Math.abs(i - 5.5) * Math.abs(i - 5.5) * 1.2; // Parabola effect

    // Start State (Stacked and invisible)
    cardEl.style.setProperty('--fan-angle', `0deg`); // ยังไม่หมุน
    cardEl.style.setProperty('--fan-x', `0px`);// อยู่กลาง
    cardEl.style.setProperty('--fan-y', `150px`);// ซ่อนใต้กรอบ
    cardEl.style.opacity = '0'; // มองไม่เห็น
    cardEl.style.zIndex = i;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-back"></div>
        <div class="card-front"></div>
      </div>
    `;

    cardEl.addEventListener('click', () => handleCardClick(cardEl, i));
    tarotGrid.appendChild(cardEl);

    // Staggered Animation ทยอยกางออก
    setTimeout(() => {
      cardEl.style.opacity = '1'; // โผล่ขึ้น
      cardEl.style.setProperty('--fan-angle', `${angle}deg`); // กางออกตามมุมที่คำนวณ
      cardEl.style.setProperty('--fan-x', `${xOffset}px`);
      cardEl.style.setProperty('--fan-y', `${yOffset}px`);
    }, 200 + (i * 120)); // Delay sequence ทยอยออกมาทีละใบ
  }
}

function handleCardClick(cardEl, index) {
  const cardData = availableCards[index];

  // If card is already flipped, we cannot un-flip it (selection is final)
  if (cardEl.classList.contains('flipped')) return;

  // Prevent selecting more than 3 cards
  if (selectedCards.length >= 3) return;

  // Find first available slot (0, 1, or 2)
  // slotindex
  const slotIndex = selectedSlots.findIndex(s => s === null);// หา slot ว่าง (0,1,2)
  selectedSlots[slotIndex] = cardData;// จองไว้
  cardEl.dataset.slot = slotIndex;
  cardEl.style.setProperty('--slot-index', slotIndex);

  // บรรทัดที่ บันทึกไพ่ที่เลือก
  selectedCards.push(cardData);

  // Update front content before flipping
  // ← เตรียมรูปไว้ก่อน ยังมองไม่เห็น รอ flip แล้วค่อยโชว์
  const frontEl = cardEl.querySelector('.card-front');
  frontEl.style.backgroundImage = `url('img/${cardData.image}')`;
  frontEl.style.backgroundSize = "100% 100%";
  frontEl.style.backgroundPosition = "center";
  frontEl.style.backgroundColor = "transparent";

  // Flip animation // ← กดแล้ว เพิ่ม class นี้
  cardEl.classList.add('flipped');

  // Check if 3 cards selected
  if (selectedCards.length === 3) {
    // We must pass the cards in slot order to the results, not in push order
    setTimeout(showResults, 1000);    
    // wait 1 second
  }
}

function showResults() {
  const overlay = document.getElementById('magical-overlay');
  const tarotCards = document.querySelectorAll('.tarot-card');

  // 1. Trigger Magical Flash
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 600);
  }

  // 2. Animate cards (Merge selected, Dim others)
  tarotCards.forEach(card => {
    if (card.classList.contains('flipped')) {
      card.classList.add('merged');
    } else {
      card.classList.add('dimmed');
    }
  });

  // 3. Wait for merging animation then reveal results
  setTimeout(() => {
    document.getElementById('resultSection').classList.add('active');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
  }, 1000);

  const cards = [
    {
      slot: selectedSlots[0],
      cardId: 'pastTarotCard',
      imgId: 'pastCardImg',
      nameId: 'pastCardName',
      meaningId: 'pastCardMeaning'
    },
    {
      slot: selectedSlots[1],
      cardId: 'presentTarotCard',
      imgId: 'presentCardImg',
      nameId: 'presentCardName',
      meaningId: 'presentCardMeaning'
    },
    {
      slot: selectedSlots[2],
      cardId: 'futureTarotCard',
      imgId: 'futureCardImg',
      nameId: 'futureCardName',
      meaningId: 'futureCardMeaning'
    }
  ];

  cards.forEach((c, i) => {
    // Populate the image before flipping
    const frontEl = document.getElementById(c.imgId);
    frontEl.style.backgroundImage = `url('img/${c.slot.image}')`;

    // Populate text
    document.getElementById(c.nameId).textContent = c.slot.name;
    document.getElementById(c.meaningId).textContent = c.slot.meaning;

    // Stagger the flip animation
    setTimeout(() => {
      const cardEl = document.getElementById(c.cardId);
      cardEl.classList.add('revealed');

      // Fade in details after card is revealed
      setTimeout(() => {
        const detailsEl = cardEl.closest('.result-card-container').querySelector('.result-details');
        if (detailsEl) detailsEl.classList.add('visible');
      }, 700);
    }, 500 + i * 700); // Stagger by 700ms
  });


}



function resetResultUI() {
  const cardIds = ['pastTarotCard', 'presentTarotCard', 'futureTarotCard'];
  cardIds.forEach(id => {
    const card = document.getElementById(id);
    if (card) card.classList.remove('revealed');
  });

  document.querySelectorAll('.result-details').forEach(el => el.classList.remove('visible'));

  document.getElementById('pastCardName').textContent = '???';
  document.getElementById('pastCardMeaning').textContent = 'Select a card...';
  document.getElementById('pastCardImg').style.backgroundImage = 'none';
  document.getElementById('presentCardName').textContent = '???';
  document.getElementById('presentCardMeaning').textContent = 'Select a card...';
  document.getElementById('presentCardImg').style.backgroundImage = 'none';
  document.getElementById('futureCardName').textContent = '???';
  document.getElementById('futureCardMeaning').textContent = 'Select a card...';
  document.getElementById('futureCardImg').style.backgroundImage = 'none';
}

// === Preloader ===
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Add small delay to let users see the cool animation briefly
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 500);
  }
});
