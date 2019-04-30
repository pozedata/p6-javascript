class App {
    constructor(){
        this.turnNumber = 1;
        this.currentPlayer;
        this.nextPlayer;

        this.board = new Board('#jeu');

        this.pistolet = new Weapon("pistolet a eau", 10, "pistolet");
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
        $(window).on('attackMode', () => {this.attackMode = true; this.play()});

    };
    generateMap(){
        this.board.createMap();
        this.board.generateWall();
        this.board.generatePositionPlayer(this.player1, this.player2);
        this.board.generatePlayer([this.player1, this.player2]);
        this.board.generateWeapon([this.laser, this.pompe, this.grenade, this.assaut]);
        this.players.forEach((element)=> {
            element.description(this.weapons);
          });
    };

    play(){
        if (this.turnNumber % 2 === 1){
            this.currentPlayer = this.player1;
            this.nextPlayer = this.player2;
        }
        else {
            this.currentPlayer = this.player2;
            this.nextPlayer = this.player1;
        }
        // this.currentPlayer.activeDefense = false;
        this.currentPlayer.btnEndTurn();
        if (this.attackMode === false) {
            this.board.generateCaseForMove(this.currentPlayer);
            this.currentPlayer.playerMove(this.board.caseGrid, this.weapons, this.board, this.nextPlayer);
        }
        else {
            this.currentPlayer.playerAttack(this.nextPlayer);
            console.log(this.currentPlayer);
        }
    };

    endTurn(){
        this.turnNumber++;
        this.nextPlayer.moveRest =  this.nextPlayer.move;
        this.currentPlayer.elementBtn.btnDef.attr('disabled', true);
        this.currentPlayer.elementBtn.btnFin.attr('disabled', true);
        this.currentPlayer.elementBtn.btnAtt.attr('disabled', true);
        console.log('changement joueur');
        this.play();
    }
};
