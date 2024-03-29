let loadedPoems = [];
let savedPoems = [];
//sections:
const searchDiv = document.querySelector(".search-wrapper");
const resultsDiv = document.getElementById("results");
resultsDiv.classList.add("display-none");
const savedContainer = document.querySelector(".saved-poem-container");
//buttons:
const cards = document.querySelectorAll(".search-cards-div .theme-card");
const openLikedPoems = document.querySelector(".open-liked");
const printBackBtns = document.querySelector(".print-back-btn");
printBackBtns.classList.add("display-none");

// Get initial data
async function fetchPoems() {
  const response = await fetch("dati.json");
  loadedPoems = await response.json();
}

fetchPoems();

//Fetch
const searchPoems = (searchText) => {
  poems = loadedPoems;
  //console.log(poems);

  //Filter
  let matches = poems.filter((poem) => {
    resultsDiv.classList.remove("display-none");
    const regex = new RegExp(`${searchText}`, "gi");
    return poem.tēma.match(regex);

    //poem.nosaukums.match(regex) || poem.teksts.match(regex) || poem.autors.match(regex) ||
  });
  if (searchText.length === 0) {
    matches = [];
    resultsDiv.innerHTML = "";
  }

  showPoems(matches);
};

//Sort, add HTML
const showPoems = (matches) => {
  if (matches.length > 0) {
    let sorted = matches.sort((a, b) => {
      return b.id - a.id;
    });

    const html = matches
      .map(
        (match) =>
          `
            <div class="poem-card line">
              <h3 class="name" >${match.nosaukums}</h3>
              <p class="poem">${match.teksts}</p>
              <p class="author">${match.autors}</p>
              <div class="btn-cont">
                <button class="heart-btn" onclick='saveText("${match.teksts}", "${match.autors}", "${match.id}"); animateLikeOn()'><i class="fas fa-heart"></i></button>
              </div>
            </div>
          `
      )
      .join("");

    resultsDiv.innerHTML = html;
  } else {
    resultsDiv.innerHTML = "Nekas netika atrasts";
  }
};

//Push & show liked poems
function saveText(poemText, poemAuthor, poemId) {
  openLikedPoems.classList.remove("display-none");
  setTimeout(animateLikeOn, 100);

  let savedPoemDiv = document.querySelector(".saved-poem-div");

  const savedPoem = `
            <div class="saved-poem-card" data-id=${poemId}>
             <p class="saved-p">${poemText}</p>
             <p class="saved-author">${poemAuthor}</p>
             <div class="btn-cont2">
             <button class="remove-btn" data-id=${poemId}><i class="far fa-trash-alt"></i></i></button>
             </div>
             </div>
          `;

  const isAlreadySaved = savedPoems.find((x) => x.id == poemId);
  if (!isAlreadySaved) {
    savedPoems.push({ id: poemId, html: savedPoem });

    let poems = [];

    const html = savedPoems.forEach((poem) => {
      poems.push(poem.html);
    });

    savedPoemDiv.innerHTML = poems.join(" ");

    removePoems(poemId, savedPoems);
  }
}

function animateLikeOn(e) {
  openLikedPoems.classList.add("animated-like");
  setTimeout(animateLikeOff, 200);
  scrollBtn.classList.add("animated-like");
}

function animateLikeOff() {
  openLikedPoems.classList.remove("animated-like");
  scrollBtn.classList.remove("animated-like");
}

function removePoems(poemId, savedPoems) {
  console.log(poemId, savedPoems);
  const deleteButtons = document
    .querySelectorAll(".remove-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.parentElement.remove();
        //sanāca "parent.parent" tikai formatēšanas nolūkos
        let id = btn.getAttribute("data-id");
        console.log(id);

        savedPoems.splice(
          savedPoems.findIndex((i) => {
            return i.id === id;
          }),
          1
        );
      });
    });
}

function openSavedPoems() {
  window.scrollTo(0, 0);
  savedContainer.classList.remove("display-none");

  let dispNone = [resultsDiv, searchDiv];
  dispNone.forEach((d) => d.classList.add("display-none"));

  const newResults = document
    .querySelectorAll(".saved-poem-card")
    .forEach((res) => {
      res.classList.remove("display-none");
      res.classList.add("new-results");
    });

  printBackBtns.classList.remove("display-none");
}

//Theme cards
Array.from(cards).forEach((card) => {
  card.addEventListener("click", (e) => {
    Array.from(cards).forEach((c) => {
      c.classList.remove("clicked");
    });

    card.classList.add("clicked");

    const clickedCard = e.target;
    console.log(clickedCard);
    searchPoems(clickedCard.textContent);
  });
});

openLikedPoems.addEventListener("click", openSavedPoems);

const returnBtn = document
  .querySelector("#back-btn")
  .addEventListener("click", () => {
    let display = [resultsDiv, searchDiv, printBackBtns];
    display.forEach((d) => d.classList.remove("display-none"));

    savedContainer.classList.add("display-none");
    printBackBtns.classList.add("display-none");
  });

const scrollBtn = document.querySelector("#scroll-btn");
scrollBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  animateLikeOn();
});

const scrollBtnVisibility = () => {
  if (document.documentElement.scrollTop < 200) {
    scrollBtn.style.display = "none";
  } else {
    scrollBtn.style.display = "block";
  }
};

document.addEventListener("scroll", (e) => {
  scrollBtnVisibility();
});

const printBtn = document
  .querySelector("#print-btn")
  .addEventListener("click", () => {
    window.print();
  });
