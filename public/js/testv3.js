let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

$(function () {

    $('.drag').draggable({
        containment: '.container',
        axis: 'x',
        start: function () {
            let num = parseInt($(this).css('left'))-15
            console.log(toDate(num))
        },
        drag: function () {
            let num = parseInt($(this).css('left'))-15
            $('#' + $(this).attr('name')).text(toDate(num))
        },
        stop: function () {
        }
    })

    $('#company_money').text(web3.fromWei(web3.eth.getBalance('0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'), "ether").toFixed(3))
    $('#user_money').text(web3.fromWei(web3.eth.getBalance('0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'), "ether").toFixed(3))
    $('#death_money').text(web3.fromWei(web3.eth.getBalance('0x68a874f2e8d20718af2ebb48dc10940ede50c080'), "ether").toFixed(3))

    initTimeLine()

})

function initTimeLine() {
    for (var i = 2017; i < 2100; i++) {
        $('#timeline #dates').append('<li><a href="#' + i + '" id="d' + i + '">' + i + '</a></li>')
        $('#timeline #issues').append('<li id="' + i + '"></li>')
    }
    $().timelinr({
        orientation: 'horizontal',
        // value: horizontal | vertical, default to horizontal
        containerDiv: '#timeline',
        // value: any HTML tag or #id, default to #timeline
        datesDiv: '#dates',
        // value: any HTML tag or #id, default to #dates
        datesSelectedClass: 'selected',
        // value: any class, default to selected
        datesSpeed: 'normal',
        // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
        issuesDiv: '#issues',
        // value: any HTML tag or #id, default to #issues
        issuesSelectedClass: 'selected',
        // value: any class, default to selected
        issuesSpeed: 'fast',
        // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
        issuesTransparency: 0.2,
        // value: integer between 0 and 1 (recommended), default to 0.2
        issuesTransparencySpeed: 500,
        // value: integer between 100 and 1000 (recommended), default to 500 (normal)
        arrowKeys: 'false',
        // value: true/false, default to false
        startAt: 1,
        // value: integer, default to 1 (first)
        autoPlay: 'false',
        // value: true | false, default to false
        autoPlayDirection: 'forward',
        // value: forward | backward, default to forward
        autoPlayPause: 2000
        // value: integer (1000 = 1 seg), default to 2000 (2segs)< });
    })
}

function toDate(num){
    num /= 2
    num += 4
    return Math.floor(num/12) + 2017 + '年' + Math.floor(num%6+1)*2 + '月'
}