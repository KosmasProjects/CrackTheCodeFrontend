function enableAndFocusInput(id) {
  var nextInput = document.getElementById(id);
  nextInput.disabled = false;
  nextInput.focus();
}

let guessCount = 0;

var inputArray = document.querySelectorAll("input[type=number]");
var randCode = "";

fetch("https://crack-the-code-backend.vercel.app/random/")
  .then((response) => response.json())
  .then((data) => {
    randCode = data.rand.toString();
    console.log(randCode);
  })
  .catch((error) => console.error("Error:", error));

inputArray.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    if (input.value.length > 1) {
      input.value = input.value.slice(0, 1);
    }
    if (event.inputType !== "deleteContentBackward" && input.value !== "") {
      enableAndFocusInput(`input${index + 2}`);
    }
  });

  input.addEventListener("keyup", (event) => {
    if (event.key === "Backspace" && input.value === "" && index > 0) {
      inputArray[index - 1].focus();
    }
  });

  input.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      var userCode = Array.from(inputArray)
        .map((input) => input.value)
        .join("");
      if (userCode.length === 4) {
        guessCount++; 
        document.getElementById("guessCount").textContent =
          "Guesses: " + guessCount;
        var guessed = 0;
        for (var i = 0; i < 4; i++) {
          if (userCode[i] === randCode[i]) {
            guessed++;
          }
        }
        document.getElementById("winMessage").textContent =
          guessCount == 1
            ? `You cracked the code ${randCode} in ${guessCount} guess.`
            : `You cracked the code ${randCode} in ${guessCount} guesses.`;
        var guessesDiv = document.getElementById("guesses");
        var guessDiv = document.createElement("div");
        guessDiv.textContent = `Guess: ${userCode}, Correct digits: ${guessed}`; 
        guessesDiv.prepend(guessDiv);

        if (guessed === 4) {
          guessDiv.style.backgroundColor = "green";
          guessDiv.classList.add("animate__animated", "animate__bounce");
          document.getElementById("winModal").style.display = "flex";
        } else if (guessed === 3) {
          guessDiv.style.backgroundColor = "darkorange";
          guessDiv.style.color = "black";
        } else if (guessed === 2) {
          guessDiv.style.backgroundColor = "orange";
          guessDiv.style.color = "black";
        } else if (guessed === 1) {
          guessDiv.style.backgroundColor = "yellow";
          guessDiv.style.color = "black";
        } else {
          guessDiv.style.opacity = "0.5";
        }

        for (var i = 0; i < inputArray.length; i++) {
          if (guessed === 4) {
            inputArray[i].disabled = true;
          } else {
          inputArray[i].value = "";
          if (i === 0) {
            inputArray[i].focus();
          }
        }
        }
      }
    }
    document.getElementById("playAgain").addEventListener("click", function () {
      location.reload();
    });
    document
      .getElementById("closeModal")
      .addEventListener("click", function () {
        document.getElementById("winModal").style.display = "none";
      });
  });
});
