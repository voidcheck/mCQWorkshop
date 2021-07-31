(()=>{
    const mCQquestions = [];
    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submit');

    const _xmlreq =  new XMLHttpRequest();
    _xmlreq.open('GET','http://167.71.43.172:8081/xmlFile', false);
    _xmlreq.onreadystatechange = () => {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(_xmlreq.responseText,"text/xml");
        getQuestions(xmlDoc.getElementsByTagName('QuizQuestion'));
    }
    _xmlreq.send(null);


    function getQuestions(doc) {
        
        for(var i = 0; i < doc.length; i++) {
          let questList = doc[i].getElementsByTagName("Question");
          let quest = {
            answers:{}
          };
          for(let j = 0; j < questList.length; j++) {
              quest.question = questList[j].childNodes[0].nodeValue;
              
              let ansList = doc[i].getElementsByTagName("Answers")[0].children;
              for(let k = 0; k < ansList.length; k++) {
                quest.answers[k+1] = ansList[k].childNodes[0].nodeValue;
              }
              quest.correctAnswer = doc[i].getElementsByTagName("CorrectAnswer")[0].childNodes[0].nodeValue;
          }
          mCQquestions.push(quest);
        }
      createMCQ(); //Create the MCQ question list 
    }
    
    //add mcq buttons
    for(let i = 1; i <= 5; i++) {
        let elm = document.createElement('button');
        elm.id = 'button'+ i + 'q';
        elm.style.display = 'inline-block';
        elm.style.margin = '12px';
        elm.innerHTML = i;
        elm.addEventListener('click', collectQuestion);
        document.getElementById('mcqbuttons').appendChild(elm)
    }

    function collectQuestion(e) {
        let _a = parseInt(e.target.innerHTML);
        showSlide(_a - 1);//open next question
    } 
  
    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    submitButton.addEventListener('click', result);
    document.getElementById('submit').style.display = 'none';
    
    //MCQ method
    function createMCQ() {
      const gameView = [];
      mCQquestions.forEach( (crrQuestion, qNumber) => {
          const answers = [];
          for(alpha in crrQuestion.answers){
            answers.push(
              `<label>
                <input type="radio" name="question${qNumber}" value="${alpha}">
                ${alpha} :
                ${crrQuestion.answers[alpha]}
              </label>`
            );
          }
  
          gameView.push(
            `<div class="slide">
              <div class="question"> ${crrQuestion.question} </div>
              <div class="answers"> ${answers.join("")} </div>
              <div class="results"></div>
              <br>
            </div>`
          );
        }
      );
      quizContainer.innerHTML = gameView.join('');
    }
  
    //publish result for MCQ
    function result(){
      
      const ansContainers = quizContainer.querySelectorAll('.answers');
      const resultsContainer = quizContainer.querySelectorAll('.results');
      mCQquestions.forEach( (crrQuestion, qNumber) => {
        if(currentSlide === qNumber) {
            const container = ansContainers[qNumber];
            const selector = `input[name=question${qNumber}]:checked`;
            const userAnswer = (container.querySelector(selector) || {}).value;
            if(userAnswer === crrQuestion.correctAnswer){
                ansContainers[qNumber].style.color = 'lightgreen';
                resultsContainer[qNumber].innerHTML = 'Congratulation!!! Your answer is correct.';
            } else if(userAnswer === undefined) {
                ansContainers[qNumber].style.color = 'red';
                resultsContainer[qNumber].innerHTML = 'Please select an option!';
            } else {
                ansContainers[qNumber].style.color = 'red';
                resultsContainer[qNumber].innerHTML = 'Your answer is wrong !!  ';
            }
        }
      });
    }
  
    //To change slide on button click
    function showSlide(n) {
        document.getElementById('submit').style.display = 'inline-block';
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
    }

  })();
  