let url='https://cataas.com/cat?json=true';
let srcUrl='https://cataas.com/cat/';
let imgBox=document.querySelector('.img');


async function imgGen(){
    let result = await axios.get(url);
    let id=result.data['_id'];
    let tag=result.data['tags'];
    card(id,tag);
}



let lim=document.querySelector('#limit');
let preVal;
let search=document.querySelector('.go');
search.addEventListener('click',async ()=>{
    if(preVal!=lim.value&&lim.value!=''){
        console.log(lim.value);
        preVal=lim.value;
        imgBox.innerHTML="";
        for(let i=0; i<lim.value; i++){
            await imgGen();            
            document.querySelector('.refresh').classList.add('visible');
        }
        btnClick();
    }
})

    
async function card(id,tag){
    let div=document.createElement('div'); //card creation
    div.classList.add('card'); //assign class
    let innerDiv=document.createElement('div');//for img and Tags
    innerDiv.classList.add('innerdiv');

    let img=addImg(id); //img adder
    let btn=addBtn(); //download button Adder
    let tagBtn=addTagBtn(); //add tag button
    let tags=addtag(tag);
    if(tag!=""){
        let caption=document.createElement('p');
        caption.classList.add('cap','cap-position');
        caption.textContent=`Tags`;
        caption.append(tags);
        // console.log(caption.innerHTML);
        innerDiv.append(img,caption)
        let btns=document.createElement('div');
        btns.append(btn,tagBtn);
        div.append(innerDiv,btns);
        imgBox.append(div);
    }else{
        div.append(img,btn)
        imgBox.append(div);
    }
    
}

function addImg(id){
    let img=document.createElement('img');
    img.classList.add('card-img')
    img.src=srcUrl+id;
    return img;
}

function addBtn(){
    let btn=document.createElement('button');
    btn.classList.add('download');
    btn.innerHTML='<i class="fa-solid fa-download"></i>';
    return btn;
}

function addTagBtn(){
    let btn=document.createElement('button');
    btn.classList.add('tagbtn')
    btn.textContent="Tags";
    return btn;
}

function addtag(tag){
    let tags=document.createElement('p');
    tags.classList.add('tag');
    for(i of tag){
        tags.innerHTML=tags.innerHTML+"<br>"+" #"+i;
    }
    // console.log(tags.innerHTML);
    return tags;
}

async function btnClick() {
    let down = document.querySelectorAll('.download');
    // console.log(down);
    for (let btn of down) {
        btn.addEventListener('click', function() {
            // Get the image URL
            let tempUrl = this.parentElement.previousElementSibling.querySelector('img').src;
            console.log(tempUrl);
            // Create a new Blob object
            fetch(tempUrl)
                .then(response => response.blob())
                .then(blob => {
                    // Create a new URL for the Blob object
                    console.log(blob);
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'download.jpg';
                    document.body.appendChild(link); // Append to body for Firefox
                    link.click();
                    document.body.removeChild(link); // Remove after download
                    URL.revokeObjectURL(url); // Clean up
                })
                .catch(error => {
                    console.error('Error downloading the image:', error);
                });
        });
    }
    let tagBtns=document.querySelectorAll('.tagbtn');
    for(btn of tagBtns){
        btn.addEventListener('click',function(){
            let cap=this.parentElement.previousElementSibling.querySelector('.cap');
            cap.classList.toggle('visible');
            cap.classList.toggle('cap-position');
        })
    }
}

document.querySelector('.refresh').addEventListener('click',async ()=>{
    imgBox.innerHTML="";
    for(let i=0; i<lim.value; i++){
        await imgGen();
    }
    btnClick();
});
document.addEventListener('keypress',(event)=>{
    if(event.key=='Enter'){
        search.click();
    }
})
btnClick();