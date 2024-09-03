
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//


let balls = [];
let nextBallText = 1;

// Function to create a new ball with a specific text
function createBall(x, y, text) {
    return {
        x: x,
        y: y,
        radius: 50,
        defaultColor: 'lightgray',
        borderColor: 'black',
        draggingColor: 'gray',
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        text: text,
        textColor: 'black'
    };
}

// Create the initial ball
balls.push(createBall(canvas.width / 2, canvas.height / 2, 'Drag Me'));

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.isDragging ? ball.draggingColor : ball.defaultColor;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = ball.borderColor;
    ctx.stroke();
    ctx.closePath();

    // Draw the text
    ctx.fillStyle = ball.textColor;
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ball.text, ball.x, ball.y);
}

function drawAllBalls() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const ball of balls) {
        drawBall(ball);
    }
}

function isInsideBall(ball, x, y) {
    const distance = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
    return distance <= ball.radius;
}

function mergeBalls(ball1, ball2) {
    // Calculate the new ball position as the midpoint of the two merging balls
    const newX = (ball1.x + ball2.x) / 2;
    const newY = (ball1.y + ball2.y) / 2;

    // Call OpenAI API to get the new ball's name
    const prompt = `Generate a creative name for a ball that is a combination of '${ball1.text}' and '${ball2.text}'`;
    openai.completions.create({
        model: 'gpt-4o-mini',
        prompt: prompt,
        max_tokens: 10
    }).then(response => {
        const newName = response.choices[0].text.trim();
        const newBall = createBall(newX, newY, newName);

        // Add the new ball and remove the old balls
        balls = balls.filter(ball => ball !== ball1 && ball !== ball2);
        balls.push(newBall);
        drawAllBalls();
    }).catch(error => {
        console.error('Error generating ball name:', error);
    });
}

canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    for (const ball of balls) {
        if (isInsideBall(ball, mouseX, mouseY)) {
            ball.isDragging = true;
            ball.offsetX = mouseX - ball.x;
            ball.offsetY = mouseY - ball.y;
            drawAllBalls();  // Update immediately to show the dragging color
            return;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (balls.some(ball => ball.isDragging)) {
        for (const ball of balls) {
            if (ball.isDragging) {
                ball.x = e.clientX - ball.offsetX;
                ball.y = e.clientY - ball.offsetY;
                drawAllBalls();
                return;
            }
        }
    }
});

canvas.addEventListener('mouseup', () => {
    const ballsToMerge = [];
    for (const ball of balls) {
        if (ball.isDragging) {
            // Check for collisions with other balls
            for (const otherBall of balls) {
                if (otherBall !== ball && isInsideBall(otherBall, ball.x, ball.y)) {
                    ballsToMerge.push([ball, otherBall]);
                }
            }
        }
    }

    if (ballsToMerge.length > 0) {
        // Merge the first pair of colliding balls
        const [ball1, ball2] = ballsToMerge[0];
        mergeBalls(ball1, ball2);
    }

    for (const ball of balls) {
        ball.isDragging = false;
    }
    drawAllBalls();
});

canvas.addEventListener('mouseleave', () => {
    for (const ball of balls) {
        ball.isDragging = false;
    }
    drawAllBalls();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'e' || e.key === 'E') {
        const newText = `Ball ${nextBallText++}`;
        const newBall = createBall(canvas.width / 2, canvas.height / 2, newText);
        balls.push(newBall);
        drawAllBalls();
    }
});

// Initial drawing
drawAllBalls();
