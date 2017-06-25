		
			var VELOCITY = 1;
			var rint = 400;
			
			var mouse = {x:0, y:0};
			var balls = [];
			var colors = [ "#f75357","#FFD040","#5DB5E2" ];
			var canvas = document.getElementById('canvas');
			var context;
			
			if (canvas && canvas.getContext) {
				context = canvas.getContext('2d');
				
				for( var i = 0; i < rint; i++ ) {
					balls.push( { 
						x: Math.random()*window.innerWidth, 
						y: Math.random()*window.innerHeight, 
						vx: ((Math.random()*(VELOCITY*2))-VELOCITY),
						vy: ((Math.random()*(VELOCITY*2))-VELOCITY),
						size: 1+Math.random()*3,
						color: colors[ Math.floor( Math.random() * colors.length ) ]
					} );
				}
				
				Initialize();
			}
			
			function Initialize() {
				canvas.addEventListener('mousemove', MouseMove, false);
				window.addEventListener('mousedown', MouseDown, false);
				window.addEventListener('resize', ResizeCanvas, false);
				
				//Touch events
				
				canvas.addEventListener('touchstart', MouseMove, false);
                                canvas.addEventListener('touchmove', MouseDown, false);
				
				
				
				setInterval( TimeUpdate, 40 );
				
				ResizeCanvas();
			}
			
			function TimeUpdate(e) {
				
				context.clearRect(0, 0, window.innerWidth, window.innerHeight);
				
				var len = balls.length; // ball length
				var ball;
				
				for( var i = 0; i < len; i++ ) {
					ball = balls[i];
					
					if (!ball.frozen) {
						ball.x += ball.vx;
						ball.y += ball.vy;
						
						if (ball.x > window.innerWidth) {
							ball.vx = -VELOCITY - Math.random();
						}
						else if (ball.x < 0) {
							ball.vx = VELOCITY + Math.random();
						}
						else {
							ball.vx *= 1 + (Math.random() * 0.005);
						}
						
						if (ball.y > window.innerHeight) {
							ball.vy = -VELOCITY - Math.random();
						}
						else if (ball.y < 0) {
							ball.vy = VELOCITY + Math.random();
						}
						else {
							ball.vy *= 1 + (Math.random() * 0.005);
						}
						
						var distanceFactor = DistanceBetween( mouse, ball );
						distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
						
						ball.currentSize = ball.size*distanceFactor;
					}
					
					context.fillStyle = ball.color;
					context.beginPath();
					context.arc(ball.x,ball.y,ball.currentSize,0,Math.PI*2,true);
					context.closePath();
					context.fill();
					
				}
			}
			
			function MouseMove(e) {
				mouse.x = e.layerX;
				mouse.y = e.layerY;
			}
			
			function MouseDown(e) {
				var len = balls.length;
				
				var closestIndex = 0;
				var closestDistance = 1000;
				
				for( var i = 0; i < len; i++ ) {
					var thisDistance = DistanceBetween( balls[i], mouse );
					
					if( thisDistance < closestDistance ) {
						closestDistance = thisDistance;
						closestIndex = i;
					}
					
				}
				
				if (closestDistance < balls[closestIndex].currentSize) {
					balls[closestIndex].frozen = true;
				}
			}
			
			function ResizeCanvas(e) {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}
			
			function DistanceBetween(p1,p2) {
				var dx = p2.x-p1.x;
				var dy = p2.y-p1.y;
				return Math.sqrt(dx*dx + dy*dy);
			}
