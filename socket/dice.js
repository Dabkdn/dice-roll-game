const mongoose = require('mongoose')
//client connect server and server emit data
const User = mongoose.model('User')

const diceRoll = () => {
    let roll = Math.floor(Math.random() * 6 + 1);
    return roll;
}

const diceGame = (io) => {
    let start
    let gameStatus
    let roll1   
    let roll2
    let turns
    setInterval(function() {
        start = Date.now()
        roll1 = diceRoll();
        roll2 = diceRoll();
        turns = new Array()
        gameStatus = 'prepare'
        io.sockets.emit('prepare_game', {status: gameStatus, start: start});
        let interval = setInterval(function() {
            if(Date.now() - start >= 10000) {
                if(turns.length != 0) {
                    turns.forEach(turn => {
                        let amoutCoin
                        let roll = roll1 + roll2
                        if(roll%2) {
                            if(turn.choice == 'odd') {
                                amoutCoin = turn.coin
                            }
                            else {
                                amoutCoin = -(turn.coin)
                            }
                        }
                        else {
                            if(turn.choice == 'odd') {
                                amoutCoin = -(turn.coin)
                            }
                            else {
                                amoutCoin = turn.coin
                            }
                        }
                        let userFromDb = User.findOneAndUpdate(
                            {userName: turn.user},
                            {$inc:{coin: amoutCoin}
                        })

                        userFromDb.exec()
                    })
                }
                io.sockets.emit('play_game', {result: turns});
                gameStatus = 'end'
                io.sockets.emit('end_game', {status: gameStatus, roll1: roll1, roll2: roll2});
                clearInterval(interval);
            }
        },100);
    },15000)

    io.on('connection', function(socket){
        console.log('a user connected');

        socket.on('result', (fn) => {
            fn(turns)
        })
        
        socket.on('user_coin', (user, fn) => {
            let userName = user
            let userFromDb = User.findOne({'userName': userName});
            userFromDb.then((doc) => {
                fn(doc.coin)
            })
        })
        gameStatus = 'prepare'
        socket.emit('prepare_game', {status: gameStatus, start: start});

        socket.on('play_game', function (data) {
            let turn = new Object()
            turn.user = data.user
            turn.coin = parseFloat(data.coin)
            turn.choice = data.choice
            turns.push(turn)
            io.sockets.emit('play_game', {result: turns});
        });
        
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}

module.exports = {
    diceGame
}