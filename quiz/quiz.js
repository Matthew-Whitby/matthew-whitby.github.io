var currentQuestions=[],allQuestions=[],answeredQuestions=[],players=[];
var generalQs,scienceQs,geographyQs,historyQs,tvFilmQs,foodQs,artQs,musicQs,sportQs;
var currentQuestion,progressBar,currentPlayers=1,disp=false;

function NextQuestion(){
   if(currentQuestion){
      AnsweredQuestion(currentQuestion);
      answeredQuestions.push(currentQuestion);
   }
   GetQuestion();
}

function PopQuestion(){
   if(answeredQuestions.length>0){
      currentQuestion=answeredQuestions[answeredQuestions.length-1];
      answeredQuestions.splice(answeredQuestions.length-1,1);
   }
}

function GetQuestion(){
   var pos,array;
   var select=document.getElementById("categorySelection");
   var selected=select.options[select.selectedIndex].value;
   if(selected=="All"){
      arrayNum=Math.floor(Math.random()*9);
      switch(arrayNum){
         case 0:array=generalQs;selected="General";break;
         case 1:array=scienceQs;selected="Science";break;
         case 2:array=geographyQs;selected="Geography";break;
         case 3:array=historyQs;selected="History";break;
         case 4:array=tvFilmQs;selected="TvFilm";break;
         case 5:array=foodQs;selected="Food";break;
         case 6:array=artQs;selected="Art";break;
         case 7:array=musicQs;selected="Music";break;
         case 8:array=sportQs;selected="Sport";break;
      }
   }else array=GetArray(selected);
   Restock(selected,array);
   pos=Math.floor(Math.random()*array.length);
   DisplayQuestion(array[pos]);
}

function Restock(type,array){
   if(array.length==0){
      console.log("RESTOCKING QUESTIONS OF TYPE: '"+type+"'");
      RestockMessage(type);
      allQuestions.map(q=>{if(q.GetCategory()==type)array.push(q);});
   }
}

function RestockMessage(type){
   var display=document.getElementById("displayMessage");
   display.innerHTML="Answered all "+type+" questions, looping questions";
   //if(!disp)disp=true;
   setTimeout(()=>{if(!disp)display.innerHTML="";else disp=false;},5000);
}

function AnsweredQuestion(question){
   var array=GetArray(question.GetCategory());
   var questionPos=QuestionPosFromID(question.GetId(),array);
   array.splice(questionPos,1);
}

function GetArray(qType){
   switch(qType){
      case"General":return generalQs;
      case"Science":return scienceQs;
      case"Geography":return geographyQs;
      case"History":return historyQs;
      case"TvFilm":return tvFilmQs;
      case"Food":return foodQs;
      case"Art":return artQs;
      case"Music":return musicQs;
      case"Sport":return sportQs;
      default:return null;
   }
}

function QuestionPosFromID(n,array){
   var l=0,r=array.length-1,pointer;
   while(1){
      pointer=Math.floor((l+r)/2);
      if(array[pointer].GetId()==n)return pointer;
      else if(array[pointer].GetId()<n)l=pointer+1;
      else r=pointer-1;
   }
}

function DisplayQuestion(question){
   document.getElementById("question").innerText=question.GetQuestion();
   document.getElementById("answer").innerText=question.GetAnswer();
   currentQuestion=question;
}

function AddPlayer(){
   var pNum=players[players.length-1].GetId()+1;
   var player=new Player();
   player.SetValues(pNum,"Player "+pNum);
   players.push(player);
   panels=document.getElementById("playerPanels");
   var newPanel=document.createElement("div");
   newPanel.classList.add("PP");
   newPanel.id="PP_"+pNum;
   var span=document.createElement("span");
   span.innerHTML="Player/Team Name:";
   newPanel.appendChild(span);
   var name=document.createElement("input");
   name.type="text";
   name.addEventListener("change",function(){UpdatePlayerName(this)});
   name.id="PP_"+pNum+"_Name";
   name.value="Player "+pNum;
   newPanel.appendChild(name);
   var scoreBox=document.createElement("div");
   scoreBox.id="PP_"+pNum+"_ScoreBox";
   scoreBox.addEventListener("click",function(){UpdatePoint(this,1)});
   var pointLabel=document.createElement("h2");
   pointLabel.classList.add("unselectable");
   pointLabel.innerHTML="Points";
   scoreBox.appendChild(pointLabel);
   var pointDisplay=document.createElement("h2");
   pointDisplay.classList.add("unselectable");
   pointDisplay.id="PP_"+pNum+"_Points";
   pointDisplay.innerHTML="0";
   scoreBox.appendChild(pointDisplay);
   newPanel.appendChild(scoreBox);
   var addPointButton=document.createElement("button");
   addPointButton.addEventListener("click",function(){UpdatePoint(this,1)});
   addPointButton.id="PP_"+pNum+"_AddPoint";
   addPointButton.innerHTML="Add Point";
   newPanel.appendChild(addPointButton);
   var removePointBtn=document.createElement("button");
   removePointBtn.addEventListener("click",function(){UpdatePoint(this,-1)});
   removePointBtn.id="PP_"+pNum+"_RemovePoint";
   removePointBtn.innerHTML="Remove Point";
   newPanel.appendChild(removePointBtn);
   panels.appendChild(newPanel);
}

function ClearAllPoints(){
   players.map(p=>{
      p.SetScore(0);
      document.getElementById("PP_"+p.GetId()+"_Points").innerHTML="0";
   });
}

function UpdatePoint(player,point){
   pNum=player.id.split('_')[1];
   var pl=GetPlayer(pNum);
   pl.UpdateScore(point);
   document.getElementById("PP_"+pNum+"_Points").innerText=pl.GetScore();
}

function UpdatePlayerName(n){
   var pNum=n.id.split('_')[1];
   var pl=GetPlayer(pNum);
   pl.SetName(n.value);
}

function GetPlayer(pNum){for(var i=0;i<players.length;i++)if(players[i].GetId()==pNum)return players[i];}

function Initialise(){generalQs=[];scienceQs=[];geographyQs=[];historyQs=[];tvFilmQs=[];foodQs=[];artQs=[];musicQs=[];sportQs=[];allQuestions.map(q=>{GetArray(q.GetCategory()).push(q);});}

function LoadFile(){
   var oFrame=document.getElementById("frmFile");
   var strRawContents=oFrame.contentWindow.document.body.childNodes[0].innerHTML;
   while(strRawContents.indexOf("\r")>=0)
      strRawContents=strRawContents.replace("\r","");
   var arrLines=strRawContents.split("\n");
   var idCounter=0,counter=-1;
   var currentQuestion=new Question(idCounter);
   progressBar=document.getElementById("myBar");
   for(var i=0;i<arrLines.length;i++){
      var curLine=arrLines[i].trim();
      if(curLine==""||curLine.substring(0,1)=="*")continue;
      switch(counter=(counter==2)?0:counter+1){
         case 0:currentQuestion.SetQuestion(curLine);break;
         case 1:currentQuestion.SetAnswer(curLine);break;
         case 2:
            currentQuestion.SetCategory(curLine);
            allQuestions.push(currentQuestion);
            move(Math.round((i/(arrLines.length-1))*100));
            currentQuestion=new Question(++idCounter);
            break;
      }
   }
   document.getElementById("quizWindow").style.display="block";
   document.getElementById("loadingScreen").style.display="none";
   Initialise();
   move(100);
}

function move(percentage){
   progressBar.style.width=percentage+'%';
   progressBar.innerHTML=percentage*1+'%';
 }

function GenerateRandomNumber(){
   var range=document.getElementById("randomNumInput").value;
   var out=Math.floor(Math.random()*range)+1;
   document.getElementById("randomNumDisplay").innerHTML=out;
}

function PrintData(){
   var generalCount=0,scienceCount=0,geographyCount=0,historyCount=0,tvFilmCount=0,foodCount=0,artCount=0,musicCount=0,sportCount=0;
   allQuestions.map(q=>{
      switch(q.GetCategory()){
         case"General":generalCount++;break;
         case"Science":scienceCount++;break;
         case"Geography":geographyCount++;break;
         case"History":historyCount++;break;
         case"TvFilm":tvFilmCount++;break;
         case"Food":foodCount++;break;
         case"Art":artCount++;break;
         case"Music":musicCount++;break;
         case"Sport":sportCount++;break;
      }
   });
   console.log("Current Question Data:");
   console.log("Total Quesitons: "+allQuestions.length);
   console.log("General Questions: "+generalCount);
   console.log("Science Questions: "+scienceCount);
   console.log("Geography Questions: "+geographyCount);
   console.log("History Questions: "+historyCount);
   console.log("Tv/Film Questions: "+tvFilmCount);
   console.log("Food Questions: "+foodCount);
   console.log("Art Questions: "+artCount);
   console.log("Music Questions: "+musicCount);
   console.log("Sport Questions: "+sportCount);
}
