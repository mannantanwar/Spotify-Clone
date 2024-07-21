console.log("lets write some js")
let songs
let currFolder
let currsong=new Audio()//ye isliye bnaya hai taaki multiple audio play na ho ek hi element me change hojaye agar doosra audio play krenge to nhi to har baar new objedct ban jata hai everytime we click on the song and it starts playing ....

// http://192.168.0.104:3000/actualstart/spotify/Spotify-Clone/songs/")

async function getsongs(folder){    
    currFolder=folder
    let a=await fetch(`${currFolder}`)
    let response= await a.text()
    // console.log(response)
    let div= document.createElement("div")
    div.innerHTML=response
    let as= div.getElementsByTagName("a")//returns array containing all the link with anchor tag
    let songs=[]
    for (let i = 0; i < as.length; i++) {
        const e=as[i]
        if(e.href.endsWith(".mp3")){//storing only music tracks in the songs array

            songs.push(e.href.split("/").slice(-1)[0])//[1] isliye add kra to get the second part of the split array as it is divided into two parts
        }
    }
    return (songs)
}
function sectomin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
 
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
const playMusic=(track,pause = false)=>{
    currsong.src=`${currFolder}/`+track
    if(!pause){
        currsong.play()
        // clickk.src="img/pause.svg"
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00.00/00.00"

    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs ) {
        songUL.innerHTML=songUL.innerHTML+`<li class="flex">
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div class="song-name">${song}</div>
                                <div class="song-artist">${"...."}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  id="clickk" class="invert" src="img/ply.svg" alt="">
                            </div>
                        </li> `
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",(element)=>{
            console.log(e.querySelector(".song-name").innerHTML)
            playMusic(e.querySelector(".song-name").innerHTML)
        })
    })
}
async function displayAlbums(){
    let a=await fetch("/actualstart/spotify/Spotify-Clone/songs/")
    let response= await a.text()
    // console.log(response)
    let divv= document.createElement("div")
    divv.innerHTML=response
    let anchors=Array.from(divv.getElementsByTagName("a"))
    for (let index = 0; index < anchors.length; index++){
        const e = anchors[index];
        if(e.href.includes("/songs/") && !e.href.includes(".htaccess")){
        // console.log(e.href.split("/").slice(-2)[0])
        let fol=(e.href.split("/").slice(-2)[0])
        //getting meta data for this fol
        let a=await fetch(`/actualstart/spotify/Spotify-Clone/songs/${fol}/info.json`)
        let response= await a.json()
        console.log(response)
        let cardContainer=document.querySelector(".cardContainer")
        cardContainer.innerHTML=cardContainer.innerHTML+`<div data-folder="${fol}"="" class="card rounded">
                        <div class="play">
                            <img src="img/play.svg" alt="">  
                        </div>
                        <img class="rounded" src="/actualstart/spotify/Spotify-Clone/songs/${fol}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
        //loading the library whenever the card is clicked  
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click",async item=>{
            // console.log(e.currentTarget.dataset.folder)
            songs= await getsongs(`/actualstart/spotify/Spotify-Clone/songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0],true)
        })
    });
    }
}
async function main(){
    // getting the list of all the songs
    
    // console.log(songs)
    //song par click krvake song play kara rhe hai in the following code
    // Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e)=>{
    //     e.addEventListener("click",(element)=>{
    //         console.log(e.querySelector(".song-name").innerHTML)
    //         // playMusic(e.querySelector(".song-name").innerHTML)
    //     })
    // })


    //displaying card in the page
    displayAlbums()
    //adding event listner as above to play bar ke play prvious and next buttons
    play.addEventListener("click",()=>{
        if(currsong.paused){
            currsong.play()
            play.src="img/pause.svg"
        }
        else{
            currsong.pause()
            play.src="img/ply.svg"
            clickk.src="img/ply.svg"
        }
    })
    //time update lgana hai
    currsong.addEventListener("timeupdate",()=>{
        // console.log(currsong.currentTime,currsong.duration)
        document.querySelector(".songtime").innerHTML=`${sectomin(currsong.currentTime)}/${sectomin(currsong.duration)}`
        document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration)*100 +"%"
        document.querySelector(".seekbar").addEventListener("click",(e)=>{
            console.log((e.offsetX/e.target.getBoundingClientRect().width))
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent+"%"
            currsong.currentTime=(currsong.duration)*percent/100
        })
    })
    //hamburger me event listner
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0
        // if(d!="none"){
        //     d="none"
        // }
        // else{
        //     d="block"
        // }
    })
    //close ka event
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left=-100+"%"
    })
    //adding event to previous and next button
    document.querySelector("#previous").addEventListener("click",()=>{
        // console.log("previous clicked")
        // console.log(currsong)
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])
        if(index-1>=0)
        playMusic(songs[index-1])
    })
    document.querySelector("#next").addEventListener("click",()=>{
        // console.log("previous clicked")
        // console.log(currsong)
        let index = songs.indexOf(currsong.src.split("/").slice(-1)[0])
        if(index+1<songs.length)
        playMusic(songs[index+1])
    })
    //adding event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currsong.volume=parseInt(e.target.value)/100
        let a = currsong.volume
        if(a==0){
            document.querySelector(".volume").firstElementChild.src="img/mute.svg"
        }
        else{
            document.querySelector(".volume").firstElementChild.src="img/volume.svg"
        }
    })
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currsong.volume=0.10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })

       
    
}
    
main()
