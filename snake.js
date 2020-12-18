    // Game data
    const snakeBorder = 'darkblue';
    const snakeB = 255
    var snakeR = 0 // Will be used to change the snakes colour
    var snakeG = 0 // Will be used to change the snakes colour
    var score = 0;
    var changingDirection = false;
    var food_x;
    var food_y;
    // Starting vertical and horizontal velocity of the snake
    var dx = 10;
    var dy = 0;
    var gamePaused = false;
    
    // Snake starting position
    var snake = [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200},
      ]
    
    const gameBoard = document.getElementById("gameBoard");
    const ctx = gameBoard.getContext("2d");
  
    // Allows the program to be able to take in keyboard input 
    document.addEventListener("keydown", change_direction);

    startCountdown(3, "Game will start in:"); // Starts the game
    setTimeout(startGame, 3000); // Starts the game

    // This is the game’s main loop
    function main()
     {
       if (gamePaused) { return null; }
        if (hasGameEnded())
        {
         gameOver();// Restarts the game
        }
        changingDirection = false;
        setTimeout(function onTick() {
        clear_board(); 
        drawFood();
        move_snake();
        drawSnake();
        main(); // Loops
      }, 100)
    }

    function sleep(ms) // Creates a time delay (In milliseconds)
    {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function displayText(text, subtext)
    {
     document.getElementById("overlay").style.display = "block";
     document.getElementById("text").innerHTML = text;
     document.getElementById("subText").innerHTML = subtext;
    }

    function hideText()
    {
      document.getElementById("overlay").style.display = "none";
    }

    function gameOver() // Pressing enter calls the game start function
    {
      displayText("Game Over, Score: " + score, "Press enter to restart")
      gamePaused = true;
    }

    function startGame() // Restarts the game
    {
      gamePaused = false;
      hideText(); // Makes sure that there is no text covering the screen
      hideText();
      main();
      createFood(); // This moves the location of the food to prevent cheating
    }    

    function startCountdown(count, text) // A Recursive function that Prints out text in a countdown timer
    {
      if (count === 0) { return; }
      displayText(text, count);
      sleep(1000).then(() => {
        startCountdown(count -1, text)});
    }

    function newGame() // Creates a new game by resetting all of the values
    {
      gamePaused = true
      score = 0;
      snake =  [
      {x: 200, y: 200},
      {x: 190, y: 200},
      {x: 180, y: 200}, ]
      resetRGB();
      document.getElementById('score').innerHTML = score;
      dx = 10;
      dy = 0;
      startCountdown(3, "Game will start in:");
      setTimeout(startGame, 3000); 
    }


    function resetRGB()
    {
      snakeG = 0
      snakeR = 0
    }

    // Clears / creates our game board colorings
    function clear_board() 
    {
      ctx.fillStyle = "white";
      ctx.strokestyle = "black";
      ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
      ctx.strokeRect(0, 0, gameBoard.width, gameBoard.height);
    }
    
    // Draws the snake on the board
    function drawSnake() { snake.forEach(drawSnakePart), snake.indexOf(drawSnakePart) }

    function drawFood() // Draws the snake’s food
    { 
      ctx.fillStyle = "Red";
      ctx.strokestyle = "Red";
      ctx.fillRect(food_x, food_y, 10, 10);
      ctx.strokeRect(food_x, food_y, 10, 10);
    }
    
    // Draw a snake part
    function drawSnakePart(snakePart, position) 
    {
      if (position === 0){ ctx.fillStyle = "rgb(0,0,255)" }
      else {
        ctx.fillStyle = "rgb(" + snakeR.toString()+","+ snakeG.toString()+","+snakeB.toString()+")";}
      ctx.strokestyle = snakeBorder;
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

     // If the snake collides with it’s self or with a border then the game is over
    function hasGameEnded()
    {
      for (var i = 4; i < snake.length; i++) {// Checks to see if the snake runs into it’s self
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) { return true; }
      }
      // Checks to see if the snake runs into it’s self
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > gameBoard.width - 10;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > gameBoard.height - 10;
      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
    }

    function random_food(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }

    function createFood() { // Creates a bit of food in an empty space
      food_x = random_food(0, gameBoard.width - 10);
      food_y = random_food(0, gameBoard.height - 10);
      snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) createFood();
      });
    }

    function change_direction(event)
     {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;
      const W = 87;
      const A = 65;
      const S = 83;
      const D = 68;
      const ENTER = 13;
            // Press "Y" any time to add a point and increase snake length or hold it down to watch it rapidly grow
      const Y = 89; // "Cheat code"
      const SPACE = 32;

    // Stops the snake from reversing and from moving when the game is paused
      if (changingDirection && !gamePaused ) return;

      changingDirection = true;
      const keyPressed = event.keyCode;
      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;

      switch (keyPressed) // This switch statement converts the key presses into movement
      {
        case UP_KEY:
          if (!goingDown)
          {
           dx = 0;
           dy = -10;
          }
          break;

        case DOWN_KEY:
          if(!goingUp)
          {
            dx = 0;
            dy = 10;
          }
          break;

        case LEFT_KEY:
          if (!goingRight)
          {
           dx = -10;
           dy = 0; 
          }
         break;

        case RIGHT_KEY:
          if (!goingLeft)
          {
           dx = 10;
           dy = 0;
          }
         break;

        case W:
          if (!goingDown)
          {
           dx = 0;
           dy = -10;
          }
          break;

        case S:
          if(!goingUp)
          {
            dx = 0;
            dy = 10;
          }
          break;

          case A:
          if (!goingRight)
          {
           dx = -10;
           dy = 0; 
         }
         break;

        case D:
          if (!goingLeft)
          {
           dx = 10;
           dy = 0;
          }
         break;
        
        case ENTER:
          newGame();
          break;
        
        case SPACE:
          if (gamePaused) 
          { 
            gamePaused = false;
            startCountdown(3, "Game will resume in:");
            setTimeout(startGame, 3000);
            document.getElementById('score').innerHTML = score;
          }
          else
            {
              gamePaused = true;
              document.getElementById('score').innerHTML = "Paused";
            }
          break;

        case Y:
          score ++;
          document.getElementById('score').innerHTML = score;
          const head = {x: snake[0].x + dx, y: snake[0].y + dy};
          snake.unshift(head);
          break;
      }
    }

    function move_snake() 
    {
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
      if (has_eaten_food)
      {
        score += 1;
        document.getElementById('score').innerHTML = score;
         //  Changes the colour of the snake as it eats more food 
        if (score > 0 && snakeG+50 < 255 ) { snakeG += 50; }
        else if (score > 0 && snakeG+50 > 200 && snakeR+50 < 201) {snakeR += 50;}
        else if (score > 0 && snakeG+50 > 255 & snakeR+50 > 201) { resetRGB(); }
        createFood();
      }
       else {
        snake.pop();
      }
    }
    