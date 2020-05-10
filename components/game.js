var canvas;                                                                         /*declaring variables*/
        var ctx;
        canvas = document.getElementById('canv');
        ctx = canvas.getContext('2d');
        var clik = document.getElementById("click")
        clik.preload = 'auto';
        clik.load();
        var over = document.getElementById("over")
        over.preload = 'auto';
        over.load();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var gravity = 0.25
        var speed = 2
        var pos = 3 * canvas.height / 4;
        var out = 0;
        var score = 0
        var realscore = 0;
        var minrot = 0.04;





        var paused = false;
        var out = 0;
        var resume = 1

        function pause() {                                                      /*fucntion to pause the game*/


            paused = !paused
            if (paused) {
                document.getElementById("pim").src = "./components/resume.svg";
                resume = 1

            } else {
                document.getElementById("pim").src = "./components/pause.svg";
                resume = 0
            }
            if (out) {
                location.reload();
            }

            animate()

        }



        addEventListener('click', up)

        addEventListener("keyup", function(event) {                                      /*eventlistners for keyboard presses*/

            if (event.keyCode === 32) {
                pause()
            }
        })
        addEventListener("keyup", function(event) {

            if (event.keyCode === 38) {
                up()
            }
        })

        function up() {                                                                 /*function to move the ball up on clik or keypress*/
            resume = 1
            if (out == 0) {
                clik.play();
            }

            if (paused == false && resume) {
                
                speed = -6;

            }



        }



        var obsarr = [];                                                            /*array for obstacles */
        var puarr = [];                                                             /*array for powerups*/
        var totcolor = ['#f2a200', '#008c28', '#00078c', 'red'];
        var color = ['#f2a200', '#008c28', '#00078c', 'red'];
        var numcol = [2, 3, 4]

        bcolindex = Math.floor(Math.random() * color.length)
        var safecol = color[bcolindex]
        var bcol = safecol

        color.splice(bcolindex, 1)


        var c1 = new Obstacle(200, Math.floor(Math.random() * color.length), numcol[Math.floor(Math.random() * numcol.length)], Math.random(), safecol);
        obsarr.push(c1);

        function sr() {                                                                 /*function for drawing the ball*/

            ctx.beginPath();
            ctx.arc(canvas.width / 2, pos, 20, 0, Math.PI * 2, false);


            ctx.fillStyle = bcol;



            ctx.fill();
            ctx.closePath();




        }

        sr();                                                                                   /*funstion calls for game to start*/
        animate();

        function update() {                                                                     /*function to update canvas while playing*/                                                                

            if (pos + 40 >= canvas.height) {
                out = 1;
            }



            if (obsarr[obsarr.length - 1].y > canvas.height / 6) {
                
                if (puarr[puarr.length - 1] == undefined || puarr[puarr.length - 1].y > 2 * canvas.height) {
                    var p1 = new Powerup(obsarr[obsarr.length - 1].y - 228, newcolor = Math.floor(Math.random() * totcolor.length))
                    puarr.push(p1)
                    safecol = totcolor[newcolor]
                    color = ['#f2a200', '#008c28', '#00078c', 'red'];

                    color.splice(newcolor, 1)

                }


            }
            if (obsarr[obsarr.length - 1].y > canvas.height / 3) {

                var c1 = new Obstacle(-200, Math.floor(Math.random() * color.length), numcol[Math.floor(Math.random() * numcol.length)], Math.random(), safecol);
                obsarr.push(c1);


            }

            if (pos - puarr[puarr.length - 1].y < 30) {

                bcol = puarr[puarr.length - 1].color

            }
            if (bcol == puarr[puarr.length - 1].color) {
                puarr[puarr.length - 1].radius = 0
            }


            score -= speed;
            if (score > realscore) {
                realscore = score
            }

            ctx.font = "80px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "right";

            ctx.fillText(Math.floor(realscore / 100), canvas.width - 80, 80);
            ctx.font = "30px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "right";





            if (typeof(Storage) !== "undefined") {                                                          /*storing highscore in realtime*/
                var scores = false;

                if (localStorage["scores"]) {

                    scores = localStorage.getItem("scores")
                    if (Math.floor(realscore / 100) > scores) {
                        localStorage.setItem("scores", Math.floor(realscore / 100))
                    }



                } else {

                    localStorage.setItem("scores", Math.floor(realscore / 100))

                }
            }
            ctx.fillText("HIGHSCORE:" + localStorage.getItem("scores"), canvas.width - 80, 130);                    /*drawing highscore on screen*/



            speed += gravity

            if (pos + speed > canvas.height / 2) {
                pos += speed;

            }
            sr();



        }

        function Powerup(y, pcolor) {                                                                           /*constructor function for powerups*/
            this.y = y
            this.radius = 10
            this.color = totcolor[pcolor]
            this.puupdate = function() {
                if (pos + speed < canvas.height / 2 && speed < 0) {
                    this.y -= speed;


                }
                this.draw();
            }



            this.draw = function() {                                                                                /*function to draw powerup on screen*/
                ctx.beginPath();
                ctx.arc(canvas.width / 2, this.y, this.radius, 0, 2 * Math.PI, false);
                ctx.fillStyle = this.color;

                ctx.fill();
            }
        }

        function Obstacle(y, ncolor, div, rotation, safecolor) {                                                    /*constructor function for obstacles*/
            this.xi = Math.random() * Math.PI;
            this.rot = (Math.random() * 0.025) + minrot                                                             /*speeds up the game with time*/
            minrot += 0.003
            if (div == 4) {
                this.rot = 0.04
            }


            if (rotation < 0.5) {
                this.rot = -this.rot                                                                                /*for clockwise and anticlockwise rotation*/
            }

            this.safe = safecolor
            this.div = div;
            this.y = y;

            this.safex = canvas.width / 2 + 95 * Math.cos(this.xi + Math.PI / 2);
            this.safey = this.y + 95 * Math.sin(this.xi + Math.PI / 2);

            this.color = ncolor;
            this.one = color[this.color];
            this.two = color[(this.color + 1) % color.length];
            this.three = color[(this.color + 2) % color.length];



            this.updateobs = function() {                                                                                  /*updating parameters of obstackes*/

                if ((this.y - pos >= 90 - 20 && this.y - pos <= 100 + 20) || (this.y - pos <= -(90 - 20) && this.y - pos >= -(100 + 20))) {
                    if (Math.sqrt(Math.pow(this.safex - canvas.width / 2, 2) + Math.pow(this.safey - pos, 2)) > this.safedis) {



                        out = 1
                    }


                }

                this.xi += this.rot;
                if (pos + speed < canvas.height / 2 && speed < 0) {
                    this.y -= speed;


                }
                if (this.div == 2) {
                    this.safex = canvas.width / 2 + 95 * Math.cos(this.xi + Math.PI / 2);
                    this.safey = this.y + 95 * Math.sin(this.xi + Math.PI / 2);
                    this.safedis = 95 * 1.414;
                }
                if (this.div == 3) {
                    this.safex = canvas.width / 2 + 95 * Math.cos(this.xi + Math.PI / 3);
                    this.safey = this.y + 95 * Math.sin(this.xi + Math.PI / 3);
                    this.safedis = 95;
                }
                if (this.div == 4) {
                    this.safex = canvas.width / 2 + 95 * Math.cos(this.xi + Math.PI / 4);
                    this.safey = this.y + 95 * Math.sin(this.xi + Math.PI / 4);
                    this.safedis = 72.70
                }

                this.draw();


            }
            this.draw = function() {                                                                        /*for drawing obstacles on screen*/

                if (this.div == 2) {


                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, this.y, 95, this.xi, this.xi + Math.PI, false);
                    ctx.strokeStyle = this.safe;

                    ctx.lineWidth = 20;
                    ctx.stroke();

                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + Math.PI, this.xi + 2 * Math.PI, false);
                    ctx.strokeStyle = this.one

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                }
                if (this.div == 3) {



                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, this.y, 95, this.xi, this.xi + 2 * Math.PI / 3, false);
                    ctx.strokeStyle = this.safe;

                    ctx.lineWidth = 20;
                    ctx.stroke();

                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + 2 * Math.PI / 3, this.xi + 4 * Math.PI / 3, false);
                    ctx.strokeStyle = this.one

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + 4 * Math.PI / 3, this.xi + 2 * Math.PI, false);
                    ctx.strokeStyle = this.two

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                }
                if (this.div == 4) {


                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, this.y, 95, this.xi, this.xi + Math.PI / 2, false);
                    ctx.strokeStyle = this.safe;

                    ctx.lineWidth = 20;
                    ctx.stroke();

                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + Math.PI / 2, this.xi + Math.PI, false);
                    ctx.strokeStyle = this.one

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + Math.PI, this.xi + 3 * Math.PI / 2, false);
                    ctx.strokeStyle = this.two

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                    ctx.beginPath();

                    ctx.arc(canvas.width / 2, this.y, 95, this.xi + 3 * Math.PI / 2, this.xi + 2 * Math.PI, false);
                    ctx.strokeStyle = this.three

                    ctx.lineWidth = 20;
                    ctx.stroke();
                    ctx.closePath();
                }
            }

        }

        function animate() {                                                                                /*function to animate the canvas with RAF*/


            if (out == 0) {
                if (!paused) {
                    requestAnimationFrame(animate);

                }
            } else {
                over.play();
                hsc()
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < obsarr.length; i++) {
                obsarr[i].updateobs()
            }
            if (puarr !== 'undefined') {
                for (var i = 0; i < puarr.length; i++) {
                    puarr[i].puupdate()
                }
            }


            update();
        }

        function hsc() {                                                                                                /*function for updating highscore*/


            if (typeof(Storage) !== "undefined") {
                var scores = false;

                if (localStorage["scores"]) {

                    scores = localStorage.getItem("scores")
                    if (Math.floor(realscore / 100) > scores) {
                        localStorage.setItem("scores", Math.floor(realscore / 100))
                    }



                } else {

                    localStorage.setItem("scores", Math.floor(realscore / 100))

                }
            }
        }
