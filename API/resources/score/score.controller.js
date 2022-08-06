const imageDataURI = require('image-data-uri')
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const tesseract = require("node-tesseract-ocr")
const fs = require("fs")
const axios = require('axios')

const controller = require('../controller/crud.controller')
const ScoreModel = require('./score.model')
const ExamModel = require('../exam/exam.model');
const { formatDiagnosticsWithColorAndContext } = require('typescript');
//Google search Spell check api
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("1998e6c35cf53614029dc4b7c59ceafc980f544a01756775bd4ed13b9854352b");
//Asynch foreach
var async = require("async");


wholeText = ''
exampleText1 = 'NAME: FIRST NAME ID: RU1234/11 PART 1: TRUE OR FALSE 1) True 2) trye 3) false 4) flse 5) trove 6fsal' + 
'PART 2: CHOOSE 1-q 2-8 3d 4.q 5.c 6.c PART 3: FILL 1. entrepreneurship 2. stakeholder 3. risk' + 
' PART 4: DEFINE 1- the quick brown fox jumps over the lazy dog 2- te quick brown fox humpa over the lazy dog' + 
'PART 5: Short Answer -1- Hello how are you -2- For te shrt anwer prt, i will just write some random tect hoping the optical character' +
' recojnition tool will recohneze most of hte parafrahk accuratelu. It is also tequired that i run this through the spell' +
'checker just incase nimor spelling errors like this wll appen'

exampleText='Part One : True or False 1. Faise 2. True 3. False 4 , false 5. Faise 6. False'+'Part two : Choose 1. D 2. b 3. d 4. a 5. B 6. C '+
'Part three: Fill 1. needs 2. goal 3. risk'+
'Part four :Define 1. The of person who creates and develops a business idea 2. A Social and managerial process by which an individual '+
'art five : Short answer 1. An ability to consider the business as a whole deliver value to its customers better than competitors '+
'2. Refers to determining the strengths and weaknesses of competitors'


var all_answers
var selectedExam
var wholeText = ''

// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: './resources/wired-cogency-327519-c5e368fcaf37.json'
});

async function googleCloudVision(fileName){
  // Read a local image as a text document
  const [result] = await client.documentTextDetection(fileName);
  const fullTextAnnotation = result.fullTextAnnotation;
  // const fullTextAnnotation = copied_response.fullTextAnnotation //Response copied from website

  // console.log(`Full text: ${fullTextAnnotation.text}`);

  let sheetText = ''

  fullTextAnnotation.pages.forEach(page => {
    page.blocks.forEach(block => {
      // console.log(`Block confidence: ${block.confidence}`);
      block.paragraphs.forEach(paragraph => {
        // console.log(`Paragraph confidence: ${paragraph.confidence}`);
        paragraph.words.forEach(word => {
          const wordText = word.symbols.map(s => s.text).join('');
          // console.log(`Word text: ${wordText}`);
          // console.log(`Word confidence: ${word.confidence}`);
          sheetText = sheetText + wordText + ' '
          word.symbols.forEach(symbol => {
            // console.log(`Symbol text: ${symbol.text}`);
            // console.log(`Symbol confidence: ${symbol.confidence}`);
          });
        });
      });
    });
  });
  // console.log('***** \n ' + wholeText + '\n *****')
  // return wholeText;
  return sheetText
}

async function tesseractOCR(fileName){
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  tesseract.recognize(fileName, config)
    .then((text) => {
      console.log("Result:", text)
      return result
    })
    .catch((error) => {
      console.log(error.message)
    })
}


//Remove whitespaces and convert to lowercase
// formatText = (text) => text.replace(/ /g,'').toLowerCase()
formatText = (text) => text.trim().toLowerCase()

//Extract the exam section from the string
async function examSection (text, section) {
  let begin = text.indexOf(section)
  let end = text.indexOf('part', begin)
  section = text.substring(begin, end)

  if(end == -1) section = text.substring(begin)

  return section;
}

//Spell checker
/* const spellCheck = function(data) {  
  console.log('Spell Checked: ' + data['search_information'].spelling_fix)
  return data['search_information'].spelling_fix
}
function googleSpellCheck(text){
  const params = {
    // q: "Helloq everione ma neme is alfred",
    q: text,
    hl: "en",
    gl: "us"
  };
  return search.json(params, spellCheck)
} */

async function logic(sheets, selectedExam){
      
      // console.log('***** \n ' + wholeText + '\n *****')

      for (const sheet of sheets)
      wholeText = await iterateExamSheets(sheet)
      
      text = formatText(exampleText)
      // let text = formatText(wholeText)

      tf_ans = []

      if(selectedExam.exam.content.tf){ // check if section exists... true or false
        const tf = await examSection(text, 'true or false')
        console.log(tf)
        
        selectedExam.exam.tf.ans.forEach((answer, i) => {

          let my = ''
          let score = ''

          ans = tf.substring(tf.indexOf(i+1), tf.indexOf(i+2))
          if(selectedExam.exam.tf.ans.length == i+1) ans = tf.substring(tf.indexOf(i+1))
          
          if(ans.includes('t') || ans.includes('r') || ans.includes('u') || ans.includes('v')){
            my = 'true'
          }
          else if(ans.includes('f') || ans.includes('a') || ans.includes('l') || ans.includes('s') || ans.includes('q')){
            my = 'false'
          }
          else my = 'wrong'

        //Score True or false
          if(answer === my) score = 'correct'
          else score = answer

          tf_ans.push({ my, score })
        })
        // console.log('My TF Ans: ' + tf_ans)
      }

      choice_ans = []

      if(selectedExam.exam.content.choice){ // check if section exists... choice
        
        const choice = await examSection(text, 'choose')

        selectedExam.exam.choice.ans.forEach((answer, i) => {
          
          let my = ''
          let score = ''
          
          ans = choice.substring(choice.indexOf(i+1), choice.indexOf(i+2))
          if(selectedExam.exam.choice.ans.length == i+1) ans = choice.substring(choice.indexOf(i+1))
          
          if(ans.includes('a') || ans.includes('q')){
            my = 'a'
          }
          else if(ans.includes('b') || ans.includes('p') || ans.includes('8')){
            my = 'b'
          }
          else if(ans.includes('c') || ans.includes('<') || ans.includes('€')){
            my = 'c'
          }
          else if(ans.includes('d') || ans.includes('1')){
            my = 'd'
          }
          else if(ans.includes('e') || ans.includes('o')){
            my = 'e'
          }
          else if(ans.includes('f') || ans.includes('l')){
            my = 'f'
          }
          else my = 'wrong'

          //Score Choice
          if(answer.toLowerCase() === my) score = 'correct'
          else score = answer.toLowerCase()

          choice_ans.push({ my, score })
        })
        // console.log('My Choice Ans: ' + choice_ans)
      }
      /*
      if(!selectedExam.exam.content.fill){ // check if section exists... fill
        
        let fill = examSection(text, 'fill')
        fill_ans = []

        selectedExam.exam.fill.ans.forEach((ans, i) => {
          ans = fill.substring(fill.indexOf(i+1), fill.indexOf(i+2))
          if(selectedExam.exam.fill.ans.length == i+1) ans = fill.substring(fill.indexOf(i+1))
          search.json({ q: ans, hl: "en", gl: "us" }, (data) => {
            // console.log('Spell Checked: ' + data['search_information'].spelling_fix)
            if(ans.length > 1){
              fill_ans.push(data['search_information'].spelling_fix)
            }
            else fill_ans.push('wrong')
            console.log('Fill Ans: ' + fill_ans)
          })
        })

        // async.eachSeries([ 2, 3, 5, 7, 11 ], function (prime, callback) {
        //   console.log(prime);
        //   setTimeout(()=>{console.log('a')}, 100) // Alternatively: callback(new Error());
        // }, function (err) {
        //   if (err) { throw err; }
        //   console.log('Well done :-)!');
        // }); 
       
      } 
       
       */
      
      fill_ans = []

      if(selectedExam.exam.content.fill){ // check if section exists... fill
        
        let fill = await examSection(text, 'fill')

        selectedExam.exam.fill.ans.forEach((answer, i) => {
         
          let my = ''
          let score = ''
         
          ans = fill.substring(fill.indexOf(i+1), fill.indexOf(i+2))
          if(selectedExam.exam.fill.ans.length == i+1) ans = fill.substring(fill.indexOf(i+1))
          if(ans.length > 1) my = ans
          else my = 'wrong'
          // console.log('Ans: ' + (i+1) + ': ' + ans + ' \n')

          //Score Fill
          if(answer.toLowerCase().includes(my.toLowerCase()) || my.toLowerCase().includes(answer.toLowerCase())) score = 'correct'
          else score = answer.toLowerCase()

          fill_ans.push({ my, score })
        })
        
        // console.log('My Fill Ans: ' + fill_ans)
      }

      //----------------------------------------------------------------------------------------------------------------

      define_ans = []

      if(selectedExam.exam.content.define && false){ // check if section exists... define
        
        let define = await examSection(text, 'define')
        console.log(define)

        selectedExam.exam.define.ans.forEach((answer, i) => {
         
          let my = ''
          let score = ''
         
          ans = define.substring(define.indexOf(i+1), define.indexOf(i+2))
          if(selectedExam.exam.define.ans.length == i+1) ans = define.substring(define.indexOf(i+1))
          if(ans.length > 1) my = ans
          else my = 'wrong'
          // console.log('Ans: ' + (i+1) + ': ' + ans + ' \n')

          //Score define
          if(answer.toLowerCase().includes(my.substring(7).toLowerCase()) || my.substring(7).toLowerCase().includes(answer.toLowerCase())) score = 'correct'
          else score = 'incorrect'

          define_ans.push({ my, score })
        })
        
        // console.log('My define Ans: ' + define_ans)
      }

      shortans_ans = []

      if(selectedExam.exam.content.shortans && false){ // check if section exists... shortans
        
        let shortans = await examSection(text, 'short')

        selectedExam.exam.shortans.ans.forEach((answer, i) => {
         
          let my = ''
          let score = ''
         
          ans = shortans.substring(shortans.indexOf(i+1), shortans.indexOf(i+2))
          if(selectedExam.exam.shortans.ans.length == i+1) ans = shortans.substring(shortans.indexOf(i+1))
          if(ans.length > 1) my = ans
          else my = 'wrong'
          // console.log('Ans: ' + (i+1) + ': ' + ans + ' \n')

          //Score shortans
          if(answer.toLowerCase().includes(my.substring(5).toLowerCase()) || my.substring(5).toLowerCase().includes(answer.toLowerCase())) score = 'correct'
          else score = 'incorrect'

          shortans_ans.push({ my, score })
        })
        
        // console.log('My shortans Ans: ' + shortans_ans)
      }



      
      //----------------------------------------------------------------------------------------------------------------

      
      async function compareNLPDefine(context, question, answer){
        
      }

      // define_ans = []

      if(selectedExam.exam.content.define){ // check if section exists... define
        
        let define = await examSection(text, 'define')

        // selectedExam.exam.define.ans.forEach((answer, i) => {
        var i=0;
        for(var answer in selectedExam.exam.define.ans){

        let my = ''
        // let score = ''

          ans = define.substring(define.indexOf(i+1), define.indexOf(i+2))
          if(selectedExam.exam.define.ans.length == i+1) ans = define.substring(define.indexOf(i+1))
          if(ans.length > 1) my = ans
          else my = 'wrong'
          // console.log('Ans: ' + (i+1) + ': ' + ans + ' \n')
          
          //Score Define
          // score = await compareNLPDefine(answer.toLowerCase(), selectedExam.exam.define.qn[i], my)


          context = answer.toLowerCase()
          question =selectedExam.exam.define.qn[i]
          answerr = my

          //Compare context with question
        axios.post('http://127.0.0.1:5000/qas', 
        {
          question: answerr,
          context: context
        }
        ).then(qn => {
          // console.log(`statusCode: ${qn.status}`);
          // console.log(qn);
          console.log('\n********************************\n')
          console.log(qn.data.answer)
          if(qn.data.answer.toLowerCase().includes(question.toLowerCase()) || 
          question.toLowerCase().includes(qn.data.answer.toLowerCase())) score = 'correct'
          else score = 'incorrect'
          console.log(score)
          define_ans.push({ my, score })

        }).catch(error => {
          console.error(error);
        });



          // let score = (checkDefine)?'correct':'incorrect'
          // if(checkDefine) score ='correct'
          // else score = 'incorrect'
          // else define_score.push(answer.toLowerCase())
          
          i++
        }
          // })
        
        // console.log('My Define Ans: ' + define_ans)
      }



      async function compareNLPShortans(context, question, answer){
        //Compare context with question
        
      }

      // shortans_ans = []

      if(selectedExam.exam.content.shortans){ // check if section exists... shortans
        
        let shortans = await examSection(text, 'short')

        var i=0
        // selectedExam.exam.shortans.ans.forEach((answer, i) => {
          for(var answer in selectedExam.exam.shortans.ans) {
          
          let my = ''

          ans = shortans.substring(shortans.indexOf(i+1), shortans.indexOf(i+2))
          if(selectedExam.exam.shortans.ans.length == i+1) ans = shortans.substring(shortans.indexOf(i+1))
          if(ans.length > 1) my = ans
          else my = 'wrong'
          // console.log('Ans: ' + (i+1) + ': ' + ans + ' \n')

          //Score Shortans
          // score = await compareNLPShortans(answer.toLowerCase(), selectedExam.exam.shortans.qn[i], my)
          // let score = (checkShortans)?'correct':'incorrect'
          // else score = 'incorrect'
          // else shortans_score.push(answer.toLowerCase())


          context = answer.toLowerCase()
          question =selectedExam.exam.shortans.qn[i]
          answerr = my

          axios.post('http://127.0.0.1:5000/qas', 
        {
          question: question,
          context: context
        }
        ).then(qn => {
          // console.log(`statusCode: ${qn.status}`);
          // console.log(qn);
          console.log('\n********************************\n')
                console.log(qn.data.answer)

          axios.post('http://127.0.0.1:5000/qas', 
          {
            question: answerr,
            context: context
          }
          ).then(ans => {
            // console.log(`statusCode: ${ans.status}`);
            // console.log(ans);
            //Compare context with answer
            console.log('\n********************************\n')
            console.log(ans.data.answer)
            if(qn.data.answer.toLowerCase().includes(ans.data.answer.toLowerCase()) || 
            ans.data.answer.toLowerCase().includes(qn.data.answer.toLowerCase())) 
            score = 'correct'
            else score = 'incorrect' 

            shortans_ans.push({ my, score })

            return

          }).catch(error => {
            console.error(error);
          });
        }).catch(error => {
          console.error(error);
        });



          
          
        i++  
        }
          // })

        // console.log('My Shortans Ans: ' + shortans_ans)
        // console.log('Correct Shortans Ans: ' + shortans_score)
      }

      //Combine all answers
      all_answers = {
        tf: tf_ans,
        choice: choice_ans,
        fill: fill_ans,
        define: define_ans,
        shortans: shortans_ans,
        content: selectedExam.exam.content
      }

      return all_answers
}

allSheetText = ''

async function iterateExamSheets(sheet){

  examSheet = sheet
  try{
    //Convert dataURI(blob) to image and save it to local directory
    let dataURI
    if(examSheet._imageAsDataUrl) dataURI = examSheet._imageAsDataUrl;
    else dataURI = examSheet.imageAsDataUrl;
    let filePath = './out/temp_img';
    let file_path = await imageDataURI.outputFile(dataURI, filePath)
    allSheetText = allSheetText + await googleCloudVision(file_path)
  }catch(e){
    console.log(e)
  }

  /* sheet.forEach((examSheet) => {
    try{
      //Convert dataURI(blob) to image and save it to local directory
      let dataURI
      if(examSheet._imageAsDataUrl) dataURI = examSheet._imageAsDataUrl;
      else dataURI = examSheet.imageAsDataUrl;
      let filePath = './out/temp_img';
      imageDataURI.outputFile(dataURI, filePath).then(path => {
              //Send to OCR
              allSheetText = allSheetText + googleCloudVision(path)
              // plainAnswer += tesseractOCR(path)
      })
    }catch(e){
      console.log(e)
    }
  }) */
  console.log('All Text' + allSheetText)
  return allSheetText
}


module.exports = {
  ...controller(ScoreModel),
    async scoreExam(req, res){

      // console.log(req.body.formData)
      selectedExam = await ExamModel.findOne({_id: req.body.selectedExam})
      
      // await iterateExamSheets(req.body.formData)
      all_answers = await logic(req.body.formData, selectedExam)
      
      res.status(200).send(all_answers)
      

    },


  }




  /* async scoreeExam(req, res){
      req.body.formData.forEach((examSheet) => {
        //Convert dataURI(blob) to image and save it to local directory
        let dataURI = examSheet._imageAsDataUrl;
        let filePath = './out/fileName';
        imageDataURI.outputFile(dataURI, filePath)
            .then(path => {
                //Send to OCR
                googleCloudVision(path)
          })
      })
      // console.log('The whole text: ' + wholeText)
      // res.status(200).send(wholeText)
  } */