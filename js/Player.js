class Player {
    constructor(name, type, weapons, elementBtn, elementP, elementDesc, elementWeapon){
        this.name = name;
        this.sante = 100;
        this.weapon = weapons[0];
        this.oldWeapon;
        this.move = 3;
        this.moveRest = this.move;
        this.type = type;
        this.position;
        this.oldPosition;
        this.img = "../img/"+ this.type +"-"+ this.weapon.type +".svg";
        this.activeDefense = false;
        this.elementBtn = elementBtn;
        this.elementP = elementP;
        this.elementDesc = elementDesc;
        this.elementWeapon = elementWeapon;
    };

    description() {
        this.elementDesc.helth.text(this.sante).css('color', 'green');
        this.elementDesc.damage.text(this.weapon.damage);
        this.elementDesc.weapon.text(this.weapon.name);
    }

    //////////////////////// méthode pour la phase de déplacements ///////////////////////

    playerMove(array, weapons, board, nextPlayer) {
        $('.move').on('click', (e) => {
            this.playerMoveOnClick(e, array);
            this.playerMoveOnWeapon(e, weapons);
            this.playerOrientation(e);
            this.calculMoveRestPlayer(e);
            const returnPlayer = this.verifOtherPlayerAround(nextPlayer, array);
            this.removeMovesAttributes();
            if (this.moveRest !== 0) {
                board.generateCaseForMove(this);
                this.playerMove(array, weapons, board, nextPlayer);
            }
            else if (!returnPlayer && this.moveRest === 0){
                $(window).trigger('endTurn', [this]);
            }
        });
    };

    playerMoveOnClick(e, array) {
        $(e.target).addClass(this.type).removeClass('empty').delay(2000).css('background-image', 'url('+ this.img +')');
        this.oldPosition = this.position;
        this.position = {x:parseInt($(e.target).attr('data-row')) , y:parseInt($(e.target).attr('data-col'))};
        let eltArray = array.find(elt => (elt.attr('id') === (''+ this.oldPosition.x +'' + ''+ this.oldPosition.y +'')));
        eltArray.removeClass(this.type).addClass('empty').removeAttr('style');
        $('#tp')[0].play();
    };

    playerMoveOnWeapon(e, weapons) {
        if ($(e.target).hasClass('weapon')) {
            let weaponOnCase = weapons.find(elt => (elt.type === $(e.target).attr('data-weapon')));
            $(e.target).attr('data-weapon', this.weapon.type);
            this.oldWeapon = this.weapon;
            this.weapon = weaponOnCase;
            this.img = "../img/"+ this.type +"-"+ this.weapon.type +".svg";
            $(e.target).css('background-image', 'url("../img/'+ this.type +'-'+ this.weapon.type +'.svg")');
        }
        this.weaponOnInterface();
    };

    weaponOnInterface() {
            this.elementWeapon.attr('src', '../img/'+ this.weapon.type +'.svg');
            this.elementDesc.damage.text(this.weapon.damage);
            this.elementDesc.weapon.text(this.weapon.name);

    }

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

    verifOtherPlayerAround(nextPlayer, array) {
        if (((this.position.x+1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y))
        || ((this.position.x-1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y)) 
        || ((this.position.y+1 == nextPlayer.position.y) && (this.position.x == nextPlayer.position.x)) 
        || ((this.position.y-1 == nextPlayer.position.y) && (this.position.x == nextPlayer.position.x)))  {
            this.elementBtn.btnFin.off('click'); 
            $(window).trigger('attackMode', [this]);
            this.moveRest = 0;
            this.move = 0;
            nextPlayer.move = 0;
            this.playerOrientationFight(nextPlayer, array);
            return true;
        }
        else {
            return false;
        }
    };

    playerOrientationFight(nextPlayer, array){
        let eltNextPlayer = array.find(elt => (elt.attr('id') === (''+ nextPlayer.position.x +'' + ''+ nextPlayer.position.y +'')));
        let eltPlayer = array.find(elt => (elt.attr('id') === (''+ this.position.x +'' + ''+ this.position.y +'')));
        if ((this.position.x+1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y)) {
            if (this.type === "player1"){
                eltNextPlayer.css('transform', 'rotate(0deg)');
                eltPlayer.css('transform', 'rotate(0deg)');
            }
            else {
                eltNextPlayer.css('transform', 'rotate(180deg)');
                eltPlayer.css('transform', 'rotate(180deg)');
            }
        }
        else if ((this.position.x-1 == nextPlayer.position.x) && (this.position.y == nextPlayer.position.y)) {
            if (this.type === "player1"){
                eltNextPlayer.css('transform', 'rotate(-180deg)');
                eltPlayer.css('transform', 'rotate(-180deg)');
            }
            else {
                eltNextPlayer.css('transform', 'rotate(0deg)');
                eltPlayer.css('transform', 'rotate(0deg)');
            }
        }
        else if ((this.position.y+1 == nextPlayer.position.y) && (this.position.x == nextPlayer.position.x)) {
            if (this.type === "player1"){
                eltNextPlayer.css('transform', 'rotate(-90deg)');
                eltPlayer.css('transform', 'rotate(-90deg)');
            }
            else {
                eltNextPlayer.css('transform', 'rotate(90deg)');
                eltPlayer.css('transform', 'rotate(90deg)');
            }
        }
        else {
            if (this.type === "player1"){
                eltNextPlayer.css('transform', 'rotate(90deg)');
                eltPlayer.css('transform', 'rotate(90deg)');
            }
            else {
                eltNextPlayer.css('transform', 'rotate(-90deg)');
                eltPlayer.css('transform', 'rotate(-90deg)');
            }
        }
    }

    //////////////////////// méthodes pour la phase de combat ///////////////////////

    playerAttack(nextPlayer){
        this.btnAttack(nextPlayer);
        this.btnDefense();
    };

    btnAttack(nextPlayer){
        this.elementBtn.btnAtt.removeAttr('disabled');
        this.elementBtn.btnAtt.on('click', () => {
            this.interfaceOnAttack(nextPlayer);
            $('#waterGun')[0].play();
            let playerDie = this.verifHelthPlayer(nextPlayer);
            if (!playerDie) {
                $(window).trigger('endTurn', [this]);
            }
            else {
                $(window).trigger('endGame', [this]);
            }
        });
    };

    interfaceOnAttack(nextPlayer) {
        if (nextPlayer.activeDefense === true){
            nextPlayer.sante = nextPlayer.sante - this.weapon.damage/2;
            this.elementP.text("Vous décidez d'attaquer l'autre joueur avec le "+ this.weapon.name +" ! vous lui infligez "+ this.weapon.damage/2 +" dégats.");
            nextPlayer.activeDefense = false;
        }
        else {
            nextPlayer.sante = nextPlayer.sante - this.weapon.damage;
            this.elementP.text("Vous décidez d'attaquer l'autre joueur avec le "+ this.weapon.name +" ! vous lui infligez "+ this.weapon.damage +" dégats.");
        }
        this.updateEnemyHealthInfo(nextPlayer);
    }

    updateEnemyHealthInfo(nextPlayer){
        nextPlayer.elementDesc.helth.text(nextPlayer.sante);
        if(nextPlayer.sante >= 60){
            nextPlayer.elementDesc.helth.css('color', 'green');
        }
        else if (nextPlayer.sante >= 30) {
            nextPlayer.elementDesc.helth.css('color', 'orange');
        }
        else{
            nextPlayer.elementDesc.helth.css('color', 'red');
        }

        if(nextPlayer.sante <= 0) {
            nextPlayer.elementDesc.helth.text(nextPlayer.sante = 0);
        }
    }

    verifHelthPlayer(nextPlayer){
        if(nextPlayer.sante <= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    btnDefense() {
        this.elementBtn.btnDef.removeAttr('disabled');
        this.elementBtn.btnDef.on('click', () => {
            this.activeDefense = true;
            this.elementP.text("Vous décidez de vous défendre ! Vous subirez que 50% des dégats.");
            $('#armor')[0].play();
            $(window).trigger('endTurn', [this]);
        });
    }

    //////////////////////// méthodes pour la phase de fin de tour ///////////////////////

    btnEndTurn(){
        this.elementBtn.btnFin.removeAttr('disabled');
        this.elementBtn.btnFin.on('click', () => {
            this.removeMovesAttributes();
            this.moveRest = 0;
            this.elementP.text("Vous avez décidé de mettre fin à votre tour !")
            $('#end')[0].play(); 
            $(window).trigger('endTurn', [this]);
        });
    };
    
    removeMovesAttributes() {
        $('.move').off('click');
        $('.move').removeAttr('data-move').removeClass('move');
    }
}