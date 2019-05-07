// bouton Règle du jeu 

$('#info').on('click', function(){
    $('#modal1').attr('style', 'display:null');
    $('#close').on('click', function(){
        $('#modal1').attr('style', 'display:none');
    });
});

// bouton Rejouer

$('#playAgain').click(function() {
    location.reload();
});