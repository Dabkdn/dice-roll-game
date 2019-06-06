$(document).ready(function () {
    $('#main_container').hide();
    let userName = $('p#welcome').text();
    let socket = io();
    let currentCoin

    //get current coin
    socket.emit('user_coin', userName, function(data) {
        $('span#coin').text(data);
        currentCoin = parseFloat(data);
    })
    //get list turn of players
    socket.emit('result', function(data) {
        let result = '';
        if(data != null) {
            data.forEach(turn => {
                result += '<p class="'+turn.choice+'">'+turn.user+' '+turn.coin+' '+turn.choice+'</p>'
                if(userName == turn.user) {
                    $('#odd, #even, #dice-coin').hide();
                }
            });
        }
        $('#dice-result-content').html(result);
    });

    socket.on('prepare_game', function(data) {
        $('#odd, #even, #dice-coin').show();
        if(typeof data.start == 'undefined') {
            $('#dice-container > div').hide();
            $('#dice-container > h1').text('pending...');
        }
        else {
            $('#dice-container > div').show();
            $('#dice-container > h1').hide();
            $('#prepare-container').show();
            $('#main_container').hide();
            $('#dice-coin input').val('');
            $('#dice-result-content').html('');
            start = data.start;
            let interval = setInterval(function() {
                milliseconds = Date.now() - start;
                $('#dice-second h1').text(10-Math.round(milliseconds/1000));
                if(milliseconds >= 10000) {
                    clearInterval(interval);
                    $('#dice-second h1').text('0');
                    $('#prepare-container').hide();
                    $('#main_container').show();
                }
            }, 100);
        }
    });
    
    socket.on('play_game', function(data) {
        let result = '';
        if(data.result.length != 0) {
            data.result.forEach(turn => {
                result += '<p class="'+turn.choice+'">'+turn.user+' '+turn.coin+' '+turn.choice+'</p>'
                if(userName == turn.user) {
                    $('#odd, #even, #dice-coin').hide();
                }
            });
        }
        $('#dice-result-content').html(result);
    });

    //send info if play
    $('#odd').click(function() {
        let coinVal = $('#dice-coin input').val();
        if(coinVal != '' && parseFloat(coinVal) <= currentCoin) {
            socket.emit('play_game', {user: userName, coin: coinVal, choice: 'odd'});
        }
    });
    $('#even').click(function() {
        let coinVal = $('#dice-coin input').val();
        if(coinVal != '' && parseFloat(coinVal) <= currentCoin) {
            socket.emit('play_game', {user: userName, coin: coinVal, choice: 'even'});
        }
    });

    socket.on('end_game', function(data) {
        $('.pip').show();
        $('.pip_4').hide();
        $('#dice_roller #title h1').text('shake...')
        $('#dice_roller #title h1').addClass('shake');
		setTimeout(function(){
			let roll1 = data.roll1;
            let roll2 = data.roll2;
            $('#dice_roller #title h1').removeClass('shake');
            let roll = roll1 + roll2;
            $('#dice_roller #title h1').text(roll);
            if(roll%2) {
                $('.odd').css('background-color','green');
                $('.even').css('background-color','red');
            }
            else {
                $('.odd').css('background-color','red');
                $('.even').css('background-color','green');
            }

            socket.emit('user_coin', userName, function(data) {
                $('span#coin').text(data);
                currentCoin = parseFloat(data);
            })
            showDot('#die_1', roll1);
            showDot('#die_2', roll2);
        }, 1000);
        
    });

    function showDot(diceId, roll) {
        let all = diceId + ' .pip';
		let pip_1 = diceId + '_pip_1';
		let pip_2 = diceId + '_pip_2';
		let pip_3 = diceId + '_pip_3';
		let pip_4 = diceId + '_pip_4';
		let pip_5 = diceId + '_pip_5';
		let pip_6 = diceId + '_pip_6';
        let pip_7 = diceId + '_pip_7';
        switch(roll) {
            case 1: {
                $(all).hide();
                $(pip_4).show();
                break;
            }
            case 2: {
                $(all).hide();
                $(pip_1 + ', ' + pip_7).show();
                break;
            }
            case 3: {
                $(all).hide();
                $(pip_1 + ', ' + pip_4 + ', ' + pip_7).show();
                break;
            }
            case 4: {
                $(all).show();
                $(pip_2 + ', ' + pip_4 + ', ' + pip_6).hide();
                break;
            }
            case 5: {
                $(all).show();
                $(pip_2 + ', ' + pip_6).hide();
                break;
            }
            case 6: {
                $(all).show();
                $(pip_4).hide();
                break;
            }
            default: $(all).show();
        }
    }
});