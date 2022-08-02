const imageDataURI = require('image-data-uri')
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

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
exampleText = 'NAME: FIRST NAME ID: RU1234/11 PART 1: TRUE OR FALSE 1) True 2) trye 3) false 4) flse 5) trove 6fsal' + 
'PART 2: CHOOSE 1-q 2-c 3b 4.d PART 3: FILL 1. Some 2. thin 3. ansewr' + 
' PART 4: DEFINE -1- the quick brown fox jumps over the lazy dog -2- te quick brown fox humpa over the lazy dog' + 
'PART 4: Short Answer -1- Hello how are you -2- For te short answer part, i will just write some random tect hoping the optical character' +
' recojnition tool will recohneze most of hte parafrahk accuratelu. It is also tequired that i run this through the spell' +
'checker just incase nimor spelling errors like this wll appen'

// Creates a client
const client = new vision.ImageAnnotatorClient({
    keyFilename: './resources/wired-cogency-327519-c5e368fcaf37.json'
});

async function googleCloudVision(fileName){
// Read a local image as a text document
const [result] = await client.documentTextDetection(fileName);
const fullTextAnnotation = result.fullTextAnnotation;
// const fullTextAnnotation = copied_response.fullTextAnnotation //Response copied from website

console.log(`Full text: ${fullTextAnnotation.text}`);
fullTextAnnotation.pages.forEach(page => {
  page.blocks.forEach(block => {
    // console.log(`Block confidence: ${block.confidence}`);
    block.paragraphs.forEach(paragraph => {
      // console.log(`Paragraph confidence: ${paragraph.confidence}`);
      paragraph.words.forEach(word => {
        const wordText = word.symbols.map(s => s.text).join('');
        // console.log(`Word text: ${wordText}`);
        // console.log(`Word confidence: ${word.confidence}`);
        wholeText = wholeText + wordText + ' '
        word.symbols.forEach(symbol => {
          // console.log(`Symbol text: ${symbol.text}`);
          // console.log(`Symbol confidence: ${symbol.confidence}`);
        });
      });
    });
  });
});
console.log('***** \n ' + wholeText + '\n *****')
}

//Remove whitespaces and convert to lowercase
formatText = (text) => text.replace(/ /g,'').toLowerCase()

//Extract the exam section from the string
examSection = (text, section) => {
  let begin = text.indexOf(section)
  let end = text.indexOf('part', begin)

  section = text.substring(begin, end)
  if(end == -1) text.substring(begin)

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


module.exports = {
  ...controller(ScoreModel),
    async scoreExam(req, res){
      let selectedExam = await ExamModel.findOne({_id: req.body.selectedExam})
      
      text = formatText(exampleText)
      if(selectedExam.exam.content.tf){ // check if section exists... true or false

        const tf = examSection(text, 'trueorfalse')

        tf_ans = []
        selectedExam.exam.tf.ans.forEach((ans, i) => {
          ans = tf.substring(tf.indexOf(i+1), tf.indexOf(i+2))
          if(selectedExam.exam.tf.ans.length == i+1) ans = tf.substring(tf.indexOf(i+1))
          
          if(ans.includes('t') || ans.includes('r') || ans.includes('u') || ans.includes('v')){
            tf_ans.push('true')
          }
          else if(ans.includes('f') || ans.includes('a') || ans.includes('l') || ans.includes('s') || ans.includes('q')){
            tf_ans.push('false')
          }
          else tf_ans.push('wrong')
        })
        console.log('TF Ans: ' + tf_ans)
      }
      if(selectedExam.exam.content.choice){ // check if section exists... choice
        
        const choice = examSection(text, 'choose')
        console.log(choice)

        choice_ans = []
        selectedExam.exam.choice.ans.forEach((ans, i) => {
          ans = choice.substring(choice.indexOf(i+1), choice.indexOf(i+2))
          if(selectedExam.exam.choice.ans.length == i+1) ans = choice.substring(choice.indexOf(i+1))
          
          if(ans.includes('a') || ans.includes('q')){
            choice_ans.push('a')
          }
          else if(ans.includes('b') || ans.includes('p')){
            choice_ans.push('b')
          }
          else if(ans.includes('c') || ans.includes('<')){
            choice_ans.push('c')
          }
          else if(ans.includes('d') || ans.includes('1')){
            choice_ans.push('d')
          }
          else if(ans.includes('e') || ans.includes('o')){
            choice_ans.push('e')
          }
          else if(ans.includes('f') || ans.includes('l')){
            choice_ans.push('f')
          }
          else choice_ans.push('wrong')
        })
        console.log('Choice Ans: ' + choice_ans)
      }
      if(selectedExam.exam.content.fill){ // check if section exists... fill
        
        let fill = examSection(text, 'fill')
        console.log(fill)
        fill_ans = []

        selectedExam.exam.fill.ans.forEach((ans, i) => {
          ans = fill.substring(fill.indexOf(i+1), fill.indexOf(i+2))
          if(selectedExam.exam.fill.ans.length == i+1) ans = fill.substring(fill.indexOf(i+1))
          console.log('Ans: ' + ans)
          search.json({ q: ans, hl: "en", gl: "us" }, (data) => {
            console.log('Spell Checked: ' + data['search_information'].spelling_fix)
            if(ans.length > 1){
              fill_ans.push(data['search_information'].spelling_fix)
            }
            else fill_ans.push('wrong')
            console.log('Fill Ans: ' + fill_ans)
          })
        })

        /* async.eachSeries([ 2, 3, 5, 7, 11 ], function (prime, callback) {
          console.log(prime);
          setTimeout(()=>{console.log('a')}, 100) // Alternatively: callback(new Error());
        }, function (err) {
          if (err) { throw err; }
          console.log('Well done :-)!');
        }); */

      }
    },
    async scoreeExam(req, res){
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
    }
}