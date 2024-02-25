const root = document.documentElement
let squares = []

for (let i = 0; i < 9; i++) {
    squares[i] = document.getElementById(i)
    squares[i].onclick = function(e) {
        const id = e.target.id
        play(id)
    }
}

async function waitFunc(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

let playCount = 1
let sign = "O"
const xIndicator = document.querySelector("#xIndicator")
const oIndicator = document.querySelector("#oIndicator")
indicators(false)

function play(id) {
    if (sign === "X") {
        sign = "O"
        squares[id].style.color = "var(--color4)"
    } else if (sign === "O") {
        sign = "X"
        squares[id].style.color = "var(--color3)"
    }
    
    indicators(false)
    
    squares[id].textContent = sign
    squares[id].onclick = null
    squares[id].classList.add("play")
    
    playCount ++
    check()
}

function indicators(reset) {
    if (reset) {
        xIndicator.style.fontSize = "0px"
        oIndicator.style.fontSize = "0px"
    } else {
        if (sign === "X") {
            xIndicator.style.fontSize = "0px"
            oIndicator.style.fontSize = "80px"
        } else if (sign === "O") {
            xIndicator.style.fontSize = "80px"
            oIndicator.style.fontSize = "0px"
        }
    }
}

function check() {
    if (squares[0].textContent === squares[4].textContent && squares[0].textContent === squares[8].textContent) {
        win("diagonal", squares[0], squares[8], "left")
    } else if (squares[2].textContent === squares[4].textContent && squares[2].textContent === squares[6].textContent) {
        win("diagonal", squares[2], squares[6], "right")
    } else if (squares[0].textContent === squares[3].textContent && squares[0].textContent === squares[6].textContent) {
        win("vertical", squares[0], squares[6])
    } else if (squares[1].textContent === squares[4].textContent && squares[1].textContent === squares[7].textContent) {
        win("vertical", squares[1], squares[7])
    } else if (squares[2].textContent === squares[5].textContent && squares[2].textContent === squares[8].textContent) {
        win("vertical", squares[2], squares[8])
    } else if (squares[0].textContent === squares[1].textContent && squares[0].textContent === squares[2].textContent) {
        win("horizontal", squares[0], squares[2])
    } else if (squares[3].textContent === squares[4].textContent && squares[3].textContent === squares[5].textContent) {
        win("horizontal", squares[3], squares[5])
    } else if (squares[6].textContent === squares[7].textContent && squares[6].textContent === squares[8].textContent) {
        win("horizontal", squares[6], squares[8])
    } else if (playCount > 9) {
        reset(false, true)
    }
}

const canvas = document.querySelector("#line")
const grid = document.querySelector(".grid")

async function win(type, start, end, deg) {
    for (let i = 0; i < 9; i++) {
        squares[i].onclick = null
    }
    
    const divSize = document.querySelector(".main-container").getBoundingClientRect()
    canvas.width = divSize.width
    canvas.height = divSize.height
    document.body.appendChild(canvas)
    
    const pos1 = start.getBoundingClientRect()
    const pos2 = end.getBoundingClientRect()
    let x1 = pos1.left + pos1.width / 2
    let y1 = pos1.top + pos1.height / 2
    let x2 = pos2.left + pos2.width / 2
    let y2 = pos2.top + pos2.height / 2
    
    if (type === "horizontal") {
        x1 -= 81.5
        x2 += 81.5
        root.style.setProperty("--beforeScale", "scaleX(0)")
        root.style.setProperty("--afterScale", "scaleX(1)")
    } else if (type === "vertical") {
        y1 -= 81.5
        y2 += 81.5
        root.style.setProperty("--beforeScale", "scaleY(0)")
        root.style.setProperty("--afterScale", "scaleY(1)")
    } else if (type === "diagonal") {
        if (deg === "left") {
            x1 -= 81.5
            x2 += 81.5
            y1 -= 81.5
            y2 += 81.5
        } else if (deg === "right") {
            x1 += 81.5
            x2 -= 81.5
            y1 -= 81.5
            y2 += 81.5
        }
        root.style.setProperty("--beforeScale", "scale(0)")
        root.style.setProperty("--afterScale", "scale(1)")
    }
    
    await waitFunc(200)
    canvas.classList.add("winLine")
    
    const ctx = canvas.getContext("2d")
    const lineColor = getComputedStyle(grid).backgroundColor
    ctx.lineWidth = 5
    ctx.strokeStyle = lineColor
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    
    reset(false, false)
}

const restartBtn = document.querySelector("#restartBtn")

async function reset(restart, draw) {
    restartBtn.disabled = true
    playCount = 1
    indicators(true)
    
    if (draw) {
        grid.classList.add("draw")
        setTimeout(() => {
            grid.classList.remove("draw")
        }, 1200)
    }
    
    if (!restart) await waitFunc(1500)
    grid.classList.add("reset")
    canvas.classList.add("reset")
    canvas.classList.remove("winLine")
    
    await waitFunc(1000)
    scoreboard(restart, draw)
    canvas.remove()
    
    for (let i = 0; i < 9; i++) {
        squares[i].textContent = i
        squares[i].classList.remove("play")
        squares[i].style.fontSize = "0px"
        squares[i].onclick = function(e) {
            const id = e.target.id
            play(id)
        }
    }
    
    await waitFunc(1000)
    grid.classList.remove("reset")
    indicators(false)
    restartBtn.disabled = false
}

let drawScore = 0
let xScore = 0
let oScore = 0
const drawBoard = document.querySelector("#drawScore")
const xBoard = document.querySelector("#xScore")
const oBoard = document.querySelector("#oScore")

async function scoreboard(restart, draw) {
    if (draw) {
        drawScore ++
        drawBoard.classList.add("changeScore")
        
        await waitFunc(250)
        drawBoard.textContent = drawScore
        
        await waitFunc(250)
        drawBoard.classList.remove("changeScore")
    } else if (restart) {
        oBoard.classList.add("changeScore")
        xBoard.classList.add("changeScore")
        drawBoard.classList.add("changeScore")

        await waitFunc(250)
        xScore = 0
        oScore = 0
        drawScore = 0 
        xBoard.textContent = xScore
        oBoard.textContent = oScore
        drawBoard.textContent = drawScore

        await waitFunc(250)
        oBoard.classList.remove("changeScore")
        xBoard.classList.remove("changeScore")
        drawBoard.classList.remove("changeScore")
    } else if (sign === "X") {
        xScore ++
        xBoard.classList.add("changeScore")

        await waitFunc(250)
        xBoard.textContent = xScore

        await waitFunc(250)
        xBoard.classList.remove("changeScore")
    } else if (sign === "O") {
        oScore ++
        oBoard.classList.add("changeScore")

        await waitFunc(250)
        oBoard.textContent = oScore

        await waitFunc(250)
        oBoard.classList.remove("changeScore")
    } 
}

restartBtn.onclick = () => {
    reset(true, false)
}

document.querySelector("#switch").onchange = async(e) => {
    root.style.setProperty("--themeTransition", "0.3s")

    if (e.target.checked === true) {
        root.style.setProperty("--color1", "#2C3333")
        root.style.setProperty("--color2", "#395B64")
        root.style.setProperty("--color3", "#A5C9CA")
        root.style.setProperty("--color4", "#E7F6F2")
    } else {
        root.style.setProperty("--color1", "#F8EDE3")
        root.style.setProperty("--color2", "#DEB6AB")
        root.style.setProperty("--color3", "#AC7D88")
        root.style.setProperty("--color4", "#85586F")
    }

    await waitFunc(300)
    root.style.setProperty("--themeTransition", "0s")
}