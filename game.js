  const box = document.getElementById("box");
    const stairs = document.querySelectorAll(".stair");
    const jumpSound = document.getElementById("jumpSound");
    const endingVideo = document.getElementById("endingVideo");
    const controls = document.getElementById("controls");
    const gameArea = document.getElementById("gameArea");
    const ground = document.querySelector(".ground");
    const heart = document.getElementById("heart");
    const winMessage = document.getElementById("winMessage");
    

    let boxX = 50;
    let boxY = 410;
    let velocityY = 0;
    let gravity = 1;
    let isJumping = false;
    let onGround = false;
    let gameEnded = false;

function isLanding(box, stair) {
  const boxRect = box.getBoundingClientRect();
  const stairRect = stair.getBoundingClientRect();

  return (
    boxRect.bottom >= stairRect.top - 4 && 
    boxRect.bottom + velocityY >= stairRect.top &&
    boxRect.right > stairRect.left &&
    boxRect.left < stairRect.right
  );
}


    function isHittingBottom(box, stair) {
      const boxRect = box.getBoundingClientRect();
      const stairRect = stair.getBoundingClientRect();

      return (
        boxRect.top <= stairRect.bottom &&
        boxRect.bottom > stairRect.bottom &&
        boxRect.right > stairRect.left &&
        boxRect.left < stairRect.right
      );
    }

    function updatePosition() {
      if (gameEnded) return;

      velocityY += gravity;
      boxY += velocityY;
      onGround = false;

      stairs.forEach(stair => {
        if (isLanding(box, stair)) {
   boxY = stair.offsetTop - box.offsetHeight + 1; 

          velocityY = 0;
          isJumping = false;
          onGround = true;
        } else if (isHittingBottom(box, stair)) {
          boxY = stair.offsetTop + stair.offsetHeight;
          velocityY = 0;
        }
      });

      const groundRight = ground.offsetLeft + ground.offsetWidth;
      if (boxY + 50 >= 460 && boxX + 50 > ground.offsetLeft && boxX < groundRight) {
        boxY = 460 - 50;
        velocityY = 0;
        isJumping = false;
        onGround = true;
      }

      const boxRect = box.getBoundingClientRect();
      const heartRect = heart.getBoundingClientRect();
      if (
        boxRect.right > heartRect.left &&
        boxRect.left < heartRect.right &&
        boxRect.bottom > heartRect.top &&
        boxRect.top < heartRect.bottom
      ) {
        winGame();
        return;
      }

      if (!onGround && boxY > 500 && !gameEnded) {
        endGame();
        return;
      }

      if (boxY > window.innerHeight - 50) {
        boxY = window.innerHeight - 50;
        velocityY = 0;
        isJumping = false;
        onGround = true;
      }

      boxX = Math.max(0, Math.min(window.innerWidth - 50, boxX));
      box.style.left = `${boxX}px`;
      box.style.top = `${boxY}px`;

      requestAnimationFrame(updatePosition);
    }

    function jump() {
      if (onGround && !isJumping) {
        velocityY = -18;
        isJumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play();
      }
    }

    function moveLeft() {
      if (!gameEnded) boxX -= 10;
    }

    function moveRight() {
      if (!gameEnded) boxX += 10;
    }

    function fallFaster() {
      if (!onGround) velocityY += 2;
    }

function endGame() {
  gameEnded = true;
  gameArea.style.display = "none";
  controls.style.display = "none";

  endingVideo.currentTime = 0;
  endingVideo.muted = false;
  endingVideo.style.display = "block";
  endingVideo.classList.add("show");


  endingVideo.onended = function () {
    resetGame();
  };


  endingVideo.play().catch(() => {
    console.log("Autoplay blocked by browser");
  });
}

function resetGame() {
  boxX = 50;
  boxY = 410;
  velocityY = 0;
  isJumping = false;
  onGround = false;
  gameEnded = false;

  gameArea.style.display = "block";
  controls.style.display = "grid";
  endingVideo.pause();
  endingVideo.currentTime = 0;
  endingVideo.classList.remove("show");
  endingVideo.style.display = "none";

  box.style.left = `${boxX}px`;
  box.style.top = `${boxY}px`;

  updatePosition(); 
}


function winGame() {
  gameEnded = true;
  gameArea.style.display = "none";
  controls.style.display = "none";

  winMessage.style.display = "block";
  setTimeout(() => {
    winMessage.classList.add("show");
    typeWriter(
      "Finally... you got it.\n\n Gusto ko lang sabihin na mahal paren kita. SORRY ah.\n🥺",
      "typedText",
      40
    );
  }, 100);
}
    function typeWriter(text, elementId, speed = 50) {
  let i = 0;
  const element = document.getElementById(elementId);
  element.innerHTML = "";

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}


    document.addEventListener("keydown", function (e) {
      e.preventDefault();
      if (e.key === "ArrowLeft") moveLeft();
      else if (e.key === "ArrowRight") moveRight();
      else if (e.key === "ArrowUp") jump();
      else if (e.key === "ArrowDown") fallFaster();
    });




    document.querySelector(".left").addEventListener("click", e => { e.preventDefault(); moveLeft(); });
    document.querySelector(".right").addEventListener("click", e => { e.preventDefault(); moveRight(); });
    document.querySelector(".up").addEventListener("click", e => { e.preventDefault(); jump(); });
    document.querySelector(".down").addEventListener("click", e => { e.preventDefault(); fallFaster(); });

    updatePosition();
