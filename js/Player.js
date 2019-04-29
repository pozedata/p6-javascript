class Player {
    constructor(name, type, weapon, elementBtn, elementP, elementDesc){
        this.name = name;
        this.sante = 100;
        this.weapon = weapon[0].type;
        this.oldWeapon;
        this.move = 3;
        this.moveRest = this.move;
        this.type = type;
        this.position;
        this.oldPosition;
        this.img = "../img/"+ this.type +"-"+ this.weapon +".svg";
        this.activeDefense = false;
        this.elementBtn = elementBtn;
        this.elementP = elementP;
        this.elementDesc = elementDesc;
    };

    description(weapons) {
        let objWeapon = weapons.find(weapon => weapon.type === this.weapon);
        console.log(objWeapon);
        this.elementDesc.helth.text(100);
        this.elementDesc.damage.text(objWeapon.damage);
        this.elementDesc.weapon.text(objWeapon.name);
    }

    //////////////////////// méthode pour la phase de déplacements ///////////////////////

    playerMove(array, weapons, board, nextPlayer) {
        $('.move').on('click', (e) => {
            this.playerMoveOnClick(e, array);
            this.playerMoveOnWeapon(e, weapons);
            this.playerOrientation(e);
            this.calculMoveRestPlayer(e);
            this.verifOtherPlayerAround(nextPlayer);
            $('.move').off('click');
            $('.move').removeAttr('data-move').removeClass('move');
            if (this.moveRest !== 0) {
                board.generateCaseForMove(this);
                this.playerMove(array, weapons, board, nextPlayer);
            }
            else {
                $(window).trigger('endTurn', [this]);
            }
        });
    };

    playerMoveOnClick(e, array) {
        $(e.target).addClass(this.type).removeClass('empty').css('background-image', 'url('+ this.img +')');
        this.oldPosition = this.position;
        this.position = {x:parseInt($(e.target).attr('data-row')) , y:parseInt($(e.target).attr('data-col'))};
        let eltArray = array.find(elt => (elt.attr('id') === (''+ this.oldPosition.x +'' + ''+ this.oldPosition.y +'')));
        eltArray.removeClass(this.type).addClass('empty').removeAttr('style');
    };

    playerMoveOnWeapon(e, weapons) {
        if ($(e.target).hasClass('weapon')) {
            let weaponOnCase = weapons.find(elt => (elt.type === $(e.target).attr('data-weapon')));
            $(e.target).attr('data-weapon', this.weapon);
            this.oldWeapon = this.weapon;
            this.weapon = weaponOnCase.type;
            this.img = "../img/"+ this.type +"-"+ this.weapon +".svg";
            $(e.target).css('background-image', 'url("../img/'+ this.type +'-'+ this.weapon +'.svg")');
        }
        // diviser
        if (this.type === "player1"){
            $('div[class = "element1"] div[class = "imgArme"] img').attr('src', '../img/'+ this.weapon +'.svg');
        }
        else{
            $('div[class = "element2"] div[class = "imgArme"] img').attr('src', '../img/'+ this.weapon +'.svg');
        }
    };

    playerOrientation(e) {
        //condition si clique sur une cardinnalité
        if ($(e.target).attr('data-move') == "est"){
            if (this.type === "player1"){
                $(e.target).css('transform', 'rotate(-90deg)');
            }
            else {
                $(e.target).css('transform', 'rotate(90deg)');
            }
        }   
        else if ($(e.target).attr('data-move') == "ouest"){
            if (this.type === "player1"){
                $(e.target).css('transform', 'rotate(90deg)');
            }
            else {
                $(e.target).css('transform', 'rotate(-90deg)');
            }
        }    
        else if ($(e.target).attr('data-move') == "nord"){
            if (this.type === "player1"){
                $(e.target).css('transform', 'rotate(-180deg)');
            }
         }    
        else if ($(e.target).attr('data-move') == "sud"){
            if (this.type === "player2"){
                $(e.target).css('transform', 'rotate(180deg)');
            }
        }
    };

    calculMoveRestPlayer(e) {  
        if ($(e.target).attr('data-move') === "est") {
            this.moveRest = this.moveRest-(this.position.y - this.oldPosition.y);
        }
        else if ($(e.target).attr('data-move') == "ouest") {
            this.moveRest = this.moveRest-(this.oldPosition.y - this.position.y);
        }
        else if ($(e.target).attr('data-move') == "sud") {
            this.moveRest = this.moveRest-(this.position.x - this.oldPosition.x);

        }
        else if ($(e.target).attr('data-move') == "nord") {
            this.moveRest = this.moveRest-(this.oldPosition.x - this.position.x);
        }
    };

    verifOtherPlayerAround(nextPlayer) {
        if (((this.position.x+1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y))
        || ((this.position.x-1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y)) 
        || ((this.position.y+1 == nextPlayer.position.y) && (this.position.x == nextPlayer.position.x)) 
        || ((this.position.y-1 == nextPlayer.position.y) && (this.position.x == nextPlayer.position.x)))  {
            $(window).trigger('attackMode', [this]);
            this.moveRest = 0;
            this.move = 0;
            nextPlayer.move = 0; // <== chnger son emplacement
        }
    };

    //////////////////////// méthodes pour la phase de combat ///////////////////////

    // pb pour le changement de tour au premier contact avec l'adversaire

    playerAttack(weapons, nextPlayer){
        this.btnAttack(weapons, nextPlayer);
        this.btnDefense();
    };

    // PB : lors de l'arriver d'unjoueur sur l'autre joueur, letour passe.
    btnAttack(weapons, nextPlayer){
        this.elementBtn.btnAtt.removeAttr('disabled');
        this.elementBtn.btnAtt.on('click', () => {
            let weaponOnPlayer = weapons.find(elt => (elt.type === this.weapon));
            if (nextPlayer.activeDefense === true){
                weaponOnPlayer.damage = weaponOnPlayer.damage / 2;
            }
            this.elementP.text("Vous décidez d'attaquer l'autre joueur avec le "+ weaponOnPlayer.name +" ! vous lui infliger "+ weaponOnPlayer.damage +" dégats.");
            this.elementBtn.btnAtt.off('click');
            this.elementBtn.btnAtt.attr('disabled', true);
            $(window).trigger('endTurn', [this]);
        });
    };

    // PB : arrive pas a placer l'activeDefence au bon endroit pour qu'il se desactive pour les tour d'apres, ici present dans la app
    btnDefense() {
        this.elementBtn.btnDef.removeAttr('disabled');
        this.elementBtn.btnDef.on('click', () => {
            this.activeDefense = true; ////////////////
            this.elementP.text("Vous décidez de vous défendre! vous subirez que 50% des dégats.");
            this.elementBtn.btnDef.off('click');
            this.elementBtn.btnDef.attr('disabled', true);
            $(window).trigger('endTurn', [this]);
        });
    }

    //////////////////////// méthodes pour la phase de fin de tour ///////////////////////

    // 2 PB : des fois : - image joueur disparait ; - btn innactif lors du premier clic
    // remarque : apparement la methode se passe dans une boucle
    btnEndTurn(){
        this.elementBtn.btnFin.removeAttr('disabled');
        this.elementBtn.btnFin.on('click', () => {
            $('.move').removeAttr('data-move').removeClass('move');
            $(window).trigger('endTurn', [this]);
            this.elementBtn.btnFin.attr('disabled', true);
        });
    };
}