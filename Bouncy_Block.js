// Game data
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");
const block_x = 100; // The location of the block (x-axis)
var score, block_y, jumping, gameOver, number;
var bestScore = 0;
var lastNum = 0 ; // Stores the last randomly picked number
var rp1, rp2, rp3; // The random values that will be returned from the random pipe function
var pipeStorage = [] // Stores the pipes

document.addEventListener("keyup", bounce);
new_Game();

function new_Game()
{
    clear_board();
    gameOver = false;
    document.getElementById("overlay").style.display = "none";
    pipeStorage = []
    jumping = false;
    score = 0;
    document.getElementById('score').innerHTML = score;
    block_y = 100;
    new_Pipe();
    start = null;
    window.requestAnimationFrame(step);// Starts the game’s main loop
    // main(); // Use this if your browser doesn’t support “requestAnimationFrame”. Uncomment out this line and comment out line 26.
    // Note: If the pipe collision is not working correctly replace line 109 with:
    // if (block_x >= pipeStorage[i][0] && block_x <= pipeStorage[i][0]+30)
}


function new_Pipe()
{
    if (pipeStorage.length < 3) // Makes a new set of starting pipes
    {
        for(var i = 0; i < 4; i++)
        {
            var [rp1, rp2, rp3] = random_Pipe();
            // rp = random pipe
            pipeStorage.push([610+(i*230), rp1, rp2, rp3]); // Spaces the pipes out then adds them to the array
        }
    }
    else
    {
        if (score > 1)
        {
            var [rp1, rp2, rp3] = random_Pipe(); // Gets the random values form the random_Pipe() function
            pipeStorage[score-2]= [740, rp1, rp2, rp3];     
        }
    }
}


function random_Pipe() // Return a random pipe
{
    //return [350, 50, 270];
    // [Bottom pipe y value, pipe y height, top pipe y height value]
    // Starts at the bottom and then draws the blocks. The example above 
    // would start drawing the bottom pipe at 350 and draw to 400 (350+50)
    // Then the top starts at the top of the screen (0) and then draws 200 
    // down. 350, 270 = 80, 80 is the amount of space between pipes.
    number = Math.floor(Math.random() * 8);
    // T his will prevent the two bottom most pipes from beige generated after the topmost pipes and vice versa. 
    // This makes sure that there is enough space to reach the next pipe in time.
    if (lastNum === 0 && number > 5) { random_Pipe(); }
    if (lastNum > 5 && number === 0) { random_Pipe(); }
    lastNum = number;
    switch (number)
    {
        case 0:
            return [120, 280, 40];

        case 1: 
            return [160, 240, 80];
        
        case 2:
            return [200, 200, 120];
        
        case 3:
            return[240, 160, 160];

        case 4: 
            return [280, 120, 200];
        
        case 5: 
            return [320, 80, 240];

        case 6:
            return [350, 50, 270];

        case 7:
            return [360, 40, 280];
    }
}


function drawPipe() // Calculates then draws each pipe at it’s proper location
{
    ctx.fillStyle = "green";
    for(var i = 0; i < pipeStorage.length; i++)
    {
        pipeStorage[i][0] -= 1.2; // Moves the pipes
        ctx.fillRect(pipeStorage[i][0], pipeStorage[i][1], 30, pipeStorage[i][2]); // x, y, w, h
        ctx.fillRect(pipeStorage[i][0], 0, 30, pipeStorage[i][3]); // x, y, w, h
        ctx.strokestyle = "black";
        ctx.strokeRect(pipeStorage[i][0], 0, 30, pipeStorage[i][3]);
        ctx.strokeRect(pipeStorage[i][0], pipeStorage[i][1], 30, pipeStorage[i][2]);

        if (block_x >= pipeStorage[i][0]-15 && block_x <= pipeStorage[i][0]+32) // detects the block crashing into the pipes
        {
            if (block_y <= pipeStorage[i][3])
            {
                if (!jumping) {game_Over();} // Makes sure that the block has finished jumping so it can be rendered so
                // the player can see that it hit the pipe. With out it, it looks like it hit an imaginary or inviable pipe.
                jumping = false; 
            }
            else if(block_y >= pipeStorage[i][1])
            {
                //if (!jumping) {game_Over();}
                game_Over();
                jumping = false; 
            }
            console.log(block_x, pipeStorage[i][0]);

            //Increases the score if the block can bounce between the pipes with out hitting the pipes
            // Also generates a new pipe
            if (block_x === Math.round(pipeStorage[i][0])+30)
            {
                increase_Score();
                new_Pipe();
            }
        }
    }
}


function increase_Score()
{
    // Increases the score and sets a new high score when needed
    score++;
    if (score > bestScore) {bestScore = score;}
    document.getElementById('score').innerHTML = score;
}


function step() // Main game loop
{
    if (gameOver) {return;}
    if (block_y > 400) {game_Over();}
    clear_board();
    draw_block();
    drawPipe();
    jumping = false;
    block_y += 1;
    window.requestAnimationFrame(step);
}


function main() // Alternative main game loop (old)
// Use this if your browser doesn’t support "requestAnimationFrame"
// Go to line 27 for more information.
{
    if (gameOver) {return;}
    if (block_y > 400) {game_Over();}
    setTimeout(function onTick(){
        clear_board();
        draw_block();
        drawPipe();
        jumping = false;
        block_y += 10; 
        main();
    }, 100)
}


function bounce(event)
{
    const keyPressed = event.keyCode;
    const SPACE = 32;
    if (gameOver)
    {
        new_Game();
        return;
    }
    else if (keyPressed === 32)
    {
        block_y -= 50;
        jumping = true;
    }
}


function game_Over()
{
    // Setting gameOver to true pauses the main loop as well as prevents pressing space form moving the block
    gameOver = true;
    clear_board();
    document.getElementById("overlay").style.display = "block";
    document.getElementById("subText1").innerHTML = "Score: "+score;
    document.getElementById("subText2").innerHTML = "Best score: "+bestScore;
}


function clear_board() 
{
    ctx.fillStyle = "white";
    ctx.strokestyle = "black";
    ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    ctx.strokeRect(0, 0, gameBoard.width, gameBoard.height);
}


function draw_block()
{
    ctx.fillStyle = "yellow";
    ctx.strokestyle = "black";
    ctx.fillRect(block_x, block_y, 15, 15);
    ctx.strokeRect(block_x, block_y, 15, 15);
}
