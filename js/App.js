class App {
    constructor(){
        this.turnNumber = 1;
        this.currentPlayer;
        this.nextPlayer;

        this.board = new Board('#jeu');

        this.pistolet = new Weapon("pistolet à eau", 10, "pistolet");
        this.laser = new Weapon("pistolet laser", 15, "laser");
        this.pompe = new Weapon("fusil a pompe", 20, "pompe");
        this.grenade = new Weapon("lance grenade", 25, "grenade");
        this.assaut = new Weapon("fusil d'assaut", 30, "assaut");
        
        this.weapons = [this.pistolet, this.laser, this.pompe, this.grenade, this.assaut];

        this.player1 = new Player("Joueur bleu", "player1", this.weapons,
        {btnFin:$('.element1 .btnFin'), btnAtt:$('.element1 .btnAtt'), btnDef:$('.element1 .btnDef')},
        $('.element1 .part3 p'), 
        {helth: $('.element1 .helth'), damage: $('.element1 .damage'), weapon: $('.element1 .weaponPlayer')},
        $('div[class = "element1"] div[class = "imgArme"] img'));
        this.player2 = new Player("Joueur rouge", "player2", this.weapons,
        {btnFin:$('.element2 .btnFin'), btnAtt:$('.element2 .btnAtt'), btnDef:$('.element2 .btnDef')},
        $('.element2 .part3 p'), 
        {helth: $('.element2 .helth'), damage:$('.element2 .damage'), weapon: $('.element2 .weaponPlayer')},
        $('div[class = "element2"] div[class = "imgArme"] img'));
        
        this.players = [this.player1, this.player2];

        this.attackMode = false;

        $(window).on('endTurn', () => {this.endTurn()});
        $(window).on('attackMode', () => {this.startFight()});
        $(window).on('endGame', () => {this.endGame()});

    };

    generateMap(){
        this.players.forEach((player)=> {
            player.elementBtn.btnDef.attr('disabled', true);
            player.elementBtn.btnFin.attr('disabled', true);
            player.elementBtn.btnAtt.attr('disabled', true);
        });
        this.board.createMap();
        this.board.generateWall();
        this.board.generatePositionPlayer(this.player1, this.player2);
        this.board.generatePlayer([this.player1, this.player2]);
        this.board.generateWeapon([this.laser, this.pompe, this.grenade, this.assaut]);
        this.players.forEach((player)=> {
            player.description(this.weapons);
          });
    };

    whoPlayerPlay(){
        if (this.turnNumber % 2 === 1){
            this.currentPlayer = this.player1;
            this.nextPlayer = this.player2;
            $('.element1').css('border-color', 'rgba(0, 0, 250, 1)');
            $('.element2').css('border-color', 'rgba(250, 0, 0, 0)');
        }
        else {
            this.currentPlayer = this.player2;
            this.nextPlayer = this.player1;
            $('.element1').css('border-color', 'rgba(0, 0, 250, 0)');
            $('.element2').css('border-color', 'rgba(250, 0, 0, 1)');
        }
    }

    play(){
        this.whoPlayerPlay();
        this.currentPlayer.btnEndTurn();
        if (this.attackMode === false) {
            this.board.generateCaseForMove(this.currentPlayer);
            this.currentPlayer.playerMove(this.board.caseGrid, this.weapons, this.board, this.nextPlayer);
        }
        else {
            setTimeout(() => {
                this.currentPlayer.playerAttack(this.nextPlayer);
            }, 1200);
        }
    };

    endTurn(){
        this.turnNumber++;
        this.nextPlayer.moveRest =  this.nextPlayer.move;
        this.currentPlayer.elementBtn.btnDef.attr('disabled', true);
        this.currentPlayer.elementBtn.btnFin.attr('disabled', true);
        this.currentPlayer.elementBtn.btnAtt.attr('disabled', true);

        this.currentPlayer.elementBtn.btnAtt.off('click'); 
        this.currentPlayer.elementBtn.btnDef.off('click'); 
        this.currentPlayer.elementBtn.btnFin.off('click'); 

        this.nextPlayer.elementP.text(""); 
        this.nextPlayer.elementP.text(""); 
        this.nextPlayer.elementP.text(""); 
        this.play();
    }

    startFight(){
        this.attackMode = true;
        $('#fight')[0].play();
        this.play();
        this.players.forEach((player)=> {
            player.elementP.text("Le combat commence ! C'est au "+ this.currentPlayer.name +" de commencer.")
        });
    }

    endGame() {
        let playerLose = this.players.find(elt => (elt.sante === 0));
        let playerWin = this.players.find(elt => (elt.sante !== 0));
        playerLose.elementP.text("Vous avez perdu :'( ");
        playerWin.elementP.text("Vous avez gagné :D !!!!");
        this.players.forEach((player)=> {
            player.elementBtn.btnDef.attr('disabled', true);
            player.elementBtn.btnFin.attr('disabled', true);
            player.elementBtn.btnAtt.attr('disabled', true);
        });
        setTimeout( () => {
            $('#gameOver')[0].play();
        }, 1000);
        
    }

    settingSound(){
        $('#tp')[0].volume = 0.07;
        $('#fight')[0].volume = 0.2;
        $('#gameOver')[0].volume = 0.2;
        $('#waterGun')[0].volume = 1;
        $('#end')[0].volume = 0.2;
    }
};
