const cvs = document.getElementById('game') //canvas js için çizim alanı
const ctx = cvs.getContext('2d') //getcontext çizim yapmamızı sağlar



const drawRect = (x,y,w,h,color) => { // dikdörgen çizim gerçekleştiricez
    ctx.fillStyle = color //renk tanımlama
    ctx.fillRect(x,y,w,h) //çizdirme işlemi
}

const drawCirclef = (x,y,r,color) => { //daire çizimi gerçekleştiricez
    ctx.fillStyle = color
    ctx.beginPath() 
    ctx.arc(x,y,r,0,2 * Math.PI, false)
    ctx.closePath()
    ctx.fill()
}

const drawCircleS = (x,y,r,w,color) => { //çember çizimi gerçekleştiricez
    ctx.strokeStyle = color
    ctx.lineWidth = w //genişlik çiz
    ctx.beginPath() //yol çiziyor
    ctx.arc(x,y,r,0,2 * Math.PI)//yay çizimi yapıyoruz ortadaki 
    ctx.closePath()
    ctx.stroke()
}

const drawText = (text,x,y,color) => { //çizim gerçekleştiricez
    ctx.fillStyle = color //renkbelirliyoruz
    ctx.font = '50px sans-serif'
    ctx.fillText(text,x,y)
}



const user = { //nesnemizde oyuncumuzun bilgilerini tutucaz
    x: 20,
    y: cvs.height/2 -500, //sağa sola savrulmasın 
    w: 10,
    h:100,
    color: '#fff',
    score:0
}

const com = { //nesnemizde bilgisayarın bilgilerini tutucaz
    x: cvs.width - 20, //sağa gitmesi için -20 olması lazım 10-30= -10  youtubeda yazan -30
    y: cvs.height/2 -50,
    w: 10,
    h:100,
    color: '#fff',
    score:0
}






const ball = { //topumuz
    x:cvs.width/2, //ortadan başlaması için
    y:cvs.height/2,
    r:15,
    color: '#a51890',
    speed: 5,
    velocityX:3,
    velocityY:5,
    stop:true

}


const movePaddle = (e) => { //maouse yakalar 
    let rect = cvs.getBoundingClientRect()//hareketi takip et
    user.y = e.clientY - rect.top - user.h/2//belli eksen üzerinde harketetmesi için
    ball.stop = false
}


cvs.addEventListener('mousemove' , movePaddle)



const collision = (b,p) => { 
     b.top = b.y - b.r//topun en yüksek noktası sayılar yani
     b.bottom = b.y + b.r
     b.left = b.x - b.r//topun en sağ sol noktası sayılar yani
     b.right = b.x + b.r

     p.top = p.y
     p.bottom = p.y + p.h
     p.left = p.x
     p.right = p.x + p.w

     return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left)
}

const resetBall = () => {
    ball.x = cvs.width/2
    ball.y = cvs.height/2

    ball.speed = 5 
    ball.velocityX = 3 
    ball.velocityY = 4 
    ball.stop = true
}



const  update = () =>{ //x deki ve y deki hızı topla hareket için
    if(!ball.stop){
        ball.x += ball.velocityX
        ball.y += ball.velocityY

    }

     if(ball.y + ball.r > cvs.height || ball.y - ball.r < 0) //kenara çarpması için top tablo yüksekliğindan büyük ise y kordinaıtndaki hızı ters çevir. ters yönde gitmesi için            
     ball.velocityY = -ball.velocityY

     let comLvl = 0.1 //bilgisayarın top a endeksliyoruz
     com.y += (ball.y - (com.y + com.h/2)) * comLvl

     let player = (ball.x < cvs.width/2) ? user : com //hangi yarı sahada

     if(collision(ball,player)){ //çarpışma 
        
        let intersectY = ball.y - (player.y + player.h/2) 
        intersectY /= player.h/2

        let maxBounceRate = Math.PI / 3
         let bounceAngle = intersectY * maxBounceRate

         let direction = (ball.x < cvs.width/2) ? 1 : -1 

        
         ball.velocityX = direction * ball.speed * Math.cos(bounceAngle)
 ball.velocityY = ball.speed * Math.sin(bounceAngle)
         ball.speed += 0.8
     }

      if(ball.x > cvs.width){
          user.score++
          resetBall()
      }else if(ball.x < 0 ){
          com.score++
          resetBall()
      }
      
}







const render = () => { //görelhazırmala işlemi
    drawRect(0,0,cvs.width, cvs.height, '#000') //arka plan 
    drawRect(cvs.width/2 - 2 ,0,4, cvs.height, '#fff') //orta şerit çizimi ortada olması için canvası 2 ye bölüyoruz ve 2 ile çıkarıyouz (4 verilince 0 kalıcak ve ortaya gelecek)
    drawCirclef(cvs.width/2, cvs.height/2,8,'#fff') //çember çizme
    drawCircleS(cvs.width/2, cvs.height/2,50,4, '#fff')//geniş çember
drawText(user.score,cvs.width/4,100,'#fff')//scoru yazdık 4 e böldük çeyrek yerde görünmesi için 
drawText(com.score,3*cvs.width/4,100,'#fff')

drawRect(user.x, user.y, user.w, user.h,user.color) //dikdörtgen oluşturduk userlarımız (obejimzden degerleri çektik)
drawRect(com.x,com.y, com.w,com.h,com.color)
drawCirclef(ball.x,ball.y, ball.r,ball.color) //top çizdik


}



const game = () => {
    update()
    render()
}


const fps = 55
setInterval(game,1000/fps)  //ilk çalışacak fonks. 2 kaç ms bir gerçekleşecek 



/* 
drawRect(0,0,600,400,'#000')
drawCirclef(50,50,10,'#fff')
drawCircleS(250,250,50,10,'#fff')
drawText('deneme',400,200,'#fff') */