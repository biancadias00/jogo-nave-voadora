// cria o estado principal do jogo 
var estadoPrincipal = {
    preload: function () {
        // carrega a imagem de cenario
        game.load.image('cenario', 'assets/cenario.png');
        // Carrega a imagem da nave
        game.load.image('nave', 'assets/nn.png');
        // Carrega a imagem do obstaculo 
        game.load.image('obstaculo', 'assets/obt.png');
        // carrega o audio
        game.load.audio('voar', 'assets/jump.wav');
    },
    create: function () {
        // mostra a imagem do cenario
        game.add.sprite(0, 0, 'cenario');

        // Configura o sistema de física para que utlize o arcade
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //configura a posição da nave 
        this.nave = game.add.sprite(100, 245, 'nave');

        // Adiciona física na nave 
        game.physics.arcade.enable(this.nave);
        // Adiciona gravidade a nave para que ela caia 
        this.nave.body.gravity.y = 1000;

        // Chama a função 'voar' quando a tecla de espaço for pressionada 
        var teclaEspaco = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        teclaEspaco.onDown.add(this.voar, this);

        // Cria um grupo de obstaculos vazio 
        this.obstaculos = game.add.group();

        //adicionando um temporizador para criar um espaço-tempo entre as criações de linhas de obstaculos
        this.temporizador = game.time.events.loop(2000, this.criaLinhaDeObstaculos, this);

        //define a ancora da nave
        this.nave.anchor.setTo(-0.2, 0.5);

        //adiciona o audio na nave
        this.somAoVoar = game.add.audio('voar');
    },
    update: function () {
        // verifica se a nave saiu do cenario, se tiver saido reinicia o jogo
        if (this.nave.y < 0 || this.nave.y > 600) {
            this.reinciaJogo();
        }
        //Reinicia a jogo sempre que a nave colidir com o obstaculo 
        game.physics.arcade.overlap(this.nave, this.obstaculos, this.obstaculoAtingido, null, this);

        //acrescenta +1 sempre que a nave estiver no angulo menor que 20
        if (this.nave.angle < 20) {
            this.nave.angle += 1;
        }

    },

    // Faz a nave voar
    voar: function () {
        // verifica se a nave esta ativa
        if (this.nave.alive == false) {
            return;
        }
        // Adiciona uma velocidade vertical na nave
        this.nave.body.velocity.y = -350;

        // cria animação da nave
        var animacao = game.add.tween(this.nave);
        // muda o ângulo da nave ao longo do tempo em 100 ms
        animacao.to({ angle: -20 }, 100);
        //inicia a animação
        animacao.start();

        // Inicia a funçao 'somAoVoar'
        this.somAoVoar.play();
    },

    // Função Reinicia o jogo
    reinciaJogo: function () {
        // Inicia o "main", que faz o com que o jogo seja reiniciado
        game.state.start('main');

    },

    //Função cria obstaculo
    criaUmObstaculo: function (x, y) {
        // Cria um obstaculo na posição x e y 
        var obstaculo = game.add.sprite(x, y, 'obstaculo');
        // Adiciona o obstaculo ao grupo de obstaculos criado anteriormente 
        this.obstaculos.add(obstaculo);
        // Adiciona física no obstaculo 
        game.physics.arcade.enable(obstaculo);
        // Adiciona velocidade no obstaculo para que ele se mova para a esquerda 
        obstaculo.body.velocity.x = -200;
        // Deleta o obstaculo automaticamente quando ele não estiver mais visível 
        obstaculo.checkWorldBounds = true;
        obstaculo.outOfBoundsKill = true;
    },

    // Função que cria uma linha de obstaculos
    criaLinhaDeObstaculos: function () {
        // Cria uma linha de obstaculos e escolhe um numero aleatorio entre 1 e 5 para criar o espaço entre os obstaculos
        var buraco = Math.floor(Math.random() * 5) + 1;
        //Adiciona a linha com 6 obstaculo e cria o espaço na posição "buraco" e "buraco + 1"
        for (var i = 0; i < 8; i++) {
            if (i != buraco && i != buraco + 1) {
                this.criaUmObstaculo(600, i * 80 + 20);
            }
        }
    },

    //Função que para os obstaculos
    obstaculoAtingido: function () {
        // Verifica se a nave colidiu com o obstaculo, se não colidio, não deve realizar nenhuma ação
        if (this.nave.alive == false) {
            return;
        }
        // Define que a nave colidiu
        this.nave.alive = false;
        //Impede os obstaculos de aparecer
        game.time.events.remove(this.temporizador);
        // Para o movimento de todos os obstaculos
        this.obstaculos.forEach(function (p) {
            p.body.velocity.x = 0;
        }, this);
    }
};
// Inicializa o Phaser e cria um jogo com as dimenções de 800 por 600 
var game = new Phaser.Game(800, 600);
// Adicione o "estadoPrincipal" ao jogo e o chama de "main" 
game.state.add('main', estadoPrincipal);
// Inicia o estado de jogo 
game.state.start('main');
