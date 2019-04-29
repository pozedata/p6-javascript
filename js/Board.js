class Board {
    constructor(mapId) {
        this.row = 10;
        this.colum = 10;
        this.nbWall = 12;
        this.mapId = mapId;
        this.caseGrid = [];
        this.weapons = [];
        this.players = [];
    };

    // méthode qui génère la map
    createMap() {
        for (let row = 0; row < this.row; row++) {
            const divRow = $('<div>').addClass('row').attr('id', row); // a peut etre elever
            $(this.mapId).append(divRow);
            for (let col = 0;col < this.colum; col++) {
                const divCol = $('<div>').addClass('case empty').attr("data-row", row).attr("data-col", col).attr('id', (row).toString() + (col).toString());
                this.caseGrid.push(divCol);
                divRow.append(divCol);
            }
        }   
    };

    // méthode pour la génération des murs
    generateWall() {
        // copie du tableau qui contient les cases de la grille, en sélectionnant toutes les cases interdite au mur 
        let nbRow = this.row -1;
        let nbColum = this.colum -1;
        let walls = $.grep(this.caseGrid, function(obj) {
            return (obj.attr('data-col') == 0) || (obj.attr('data-col') == nbColum) || (obj.attr('data-row') == 0) || (obj.attr('data-row') == nbRow) 
            || ((obj.attr('data-row') == 3) && ((obj.attr('data-col') >= 2) && (obj.attr('data-col') <= nbColum-2))) 
            || ((obj.attr('data-row') == nbRow-3) && ((obj.attr('data-col') >= 2) && (obj.attr('data-col') <= nbColum-2))) 
            || ((obj.attr('data-col') == 3) && ((obj.attr('data-row') >= 2) && (obj.attr('data-row') <= nbRow-5))) 
            || ((obj.attr('data-col') == nbColum-3) && ((obj.attr('data-row') >= 2) && (obj.attr('data-row') <= nbRow-5)));
        }, true); // invertion pour récupere les case autoriser 
    
        // création des mur
        for (let i=0; i < this.nbWall; i++) {
            let caseRandom = walls[Math.floor(Math.random() * walls.length/2)];
            let indCaseRandom = (this.caseGrid.length-1)-this.caseGrid.indexOf(caseRandom);
            let caseRandomOpp = this.caseGrid[indCaseRandom];
            caseRandom.addClass('wall').removeClass('empty');
            caseRandomOpp.addClass('wall').removeClass('empty');
        }
    };

    generatePositionPlayer(player1,player2) {
        let playerRandom = this.caseGrid[Math.floor(Math.random() * this.caseGrid.length/2)];
        let playerRandomOpp = this.caseGrid[(this.caseGrid.length-1)-this.caseGrid.indexOf(playerRandom)];
        if (playerRandom.hasClass('empty')) {
            player1.position = {x:parseInt(playerRandom.attr('data-row')), y:parseInt(playerRandom.attr('data-col'))};
            player2.position = {x:parseInt(playerRandomOpp.attr('data-row')), y:parseInt(playerRandomOpp.attr('data-col'))};
        }
        else {
            this.generatePositionPlayer(player1,player2);
        }
    }

    generatePlayer(players) {
        players.forEach(char => {
            $('#'+ char.position.x +''+ char.position.y +'').addClass(char.type).removeClass('empty').css('background-image', 'url('+ char.img +')');
        });
        this.players = [... players];
    };

    // méthode pour la génération des armes
    generateWeapon(weapons) {
        for (let i=0; i < weapons.length; i++) {
            let random = Math.floor(Math.random() * weapons.length); 
            let weaponRandom = this.caseGrid[Math.floor(Math.random() * (this.caseGrid.length-1))];
            if (weaponRandom.hasClass('empty')) {
                weaponRandom.attr('class', 'case weapon');
                weaponRandom.attr('data-weapon', weapons[random].type);
                // weaponRandom.attr('data-num-weapon', random); // peut etre a enlever 
            }
            else {
                i--;
            }
        }
        this.weapons = [... weapons];
    };

    generateCaseForMove(player) {
        //mouvement est
        for(let i = 1; i <= player.moveRest; i++){
            let elt = $(`#${player.position.x}${player.position.y+i}`);
            if(elt !== null && (elt.hasClass('empty') || elt.hasClass('weapon'))){
                elt.addClass('move').attr('data-move', 'est');
            }else {
                break;
            }
        }
        //mouvement ouest
        for(let i = 1; i <= player.moveRest; i++){
            let elt = $(`#${player.position.x}${player.position.y-i}`);
            if(elt !== null && (elt.hasClass('empty') || elt.hasClass('weapon'))){
                elt.addClass('move').attr('data-move', 'ouest');
            }else {
                break;
            }
        }
        //mouvement sud
        for(let i = 1; i <= player.moveRest; i++){
            let elt = $(`#${player.position.x+i}${player.position.y}`);
            if(elt !== null && (elt.hasClass('empty') || elt.hasClass('weapon'))){
                elt.addClass('move').attr('data-move', 'sud');
            }else {
                break;
            }
        }
        //mouvement nord
        for(let i = 1; i <= player.moveRest; i++){
            let elt = $(`#${player.position.x-i}${player.position.y}`);
            if(elt !== null && (elt.hasClass('empty') || elt.hasClass('weapon'))){
                elt.addClass('move').attr('data-move', 'nord');
            }else {
                break;
            }
        }
    };
};